import { asyncHandler } from "../utils/asyncHandler.utils";

const regusterUser = asyncHandler(async(req, res)) => {
  res.status(200).json({
    message: "register user",
  })
  
}