import { asyncHandler } from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/ApiError.utils.js";
import User from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";
import ApiResponse from "../utils/ApiResponse.utils.js";
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  console.log(`${fullName} ${email} ${username} ${password}`);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(404, "All fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  const coverLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(404, "Avatar image is required");
  }

  const avatar = await uploadToCloudinary(avatarLocalPath);
  const coverImage = await uploadToCloudinary(coverLocalPath);

  if (!avatar) {
    throw new ApiError(404, "Avatar image is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

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

export { registerUser };

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
