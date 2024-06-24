import { asyncHandler } from "../utils/asyncHandler.utils";

const verifyJWT = asyncHandler(async (req, res, next) => {
  req.cookies?.accessToken || req.header("Authorization");
});
