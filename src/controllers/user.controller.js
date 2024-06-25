import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import User from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";
import ApiResponse from "../utils/ApiResponse.utils.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong from server");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  // console.log("🚀 ↭ registerUser ↭ req.body:", req.body);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(404, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  // console.log("🚀 ↭ registerUser ↭ existedUser:", existedUser);

  if (existedUser) {
    throw new ApiError(409, "User already exist");
  }

  const avatarLocalPath = await req.files?.avatar[0]?.path;
  // console.log("🚀 ↭ registerUser ↭ avatarLocalPath:", avatarLocalPath);
  const coverLocalPath = await req.files?.coverImage[0]?.path;
  // console.log("🚀 ↭ registerUser ↭ coverLocalPath:", coverLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(404, "Avatar image is required");
  }

  const avatar = await uploadToCloudinary(avatarLocalPath);
  // console.log("🚀 ↭ registerUser ↭ avatar:", avatar);
  const coverImage = await uploadToCloudinary(coverLocalPath);
  // console.log("🚀 ↭ registerUser ↭ coverImage:", coverImage);

  if (!avatar) {
    throw new ApiError(404, "Avatar image is required cloudinary");
  }

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
  });
  // console.log("🚀 ↭ registerUser ↭ user:", user);

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  // console.log("🚀 ↭ registerUser ↭ createUser:", createUser);

  if (!createUser) {
    throw new ApiError(
      500,
      "Something went wrong from server white registering the user",
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createUser, "User Created Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!User) {
    throw new ApiError(400, "User does not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(User._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  User.findOneAndReplace(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookies("accessToken")
    .clearCookies("refreshToken")
    .json(new ApiResponse(200, {}, "User Logout"));
});

export { registerUser, loginUser, logoutUser };

/**
 * get user detail from frontend or postman
 * validation - not empty
 * check if user already exist: email, username
 * check for image, chec for avatar
 * upload them to clodinary, avatar
 * create user object - create entry in debatable
 * remove pass and refresh token field from respose
 * check for user creation
 * return response
 */

/**
 * Req bosy => data
 * username or email
 * Find the user
 * password check
 * access token and refresh token genararte
 * send cookies
 */
