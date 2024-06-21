import { asyncHandler } from "../utils/asyncHandler.utils.js";

const regusterUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "User registered successfully",
  });
});
