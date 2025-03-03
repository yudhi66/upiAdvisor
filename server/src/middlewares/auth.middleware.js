import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
   try {

      const accessToken = req.cookies?.accessToken

      const refreshToken = req.cookies?.refreshToken
      if (!accessToken || !refreshToken) {
         throw new ApiError(401, "unauthorized request")
      }

      const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decodedToken?.id).select("-password")

      if (!user) {
         throw new ApiError(401, "Invalid Access Token")
      }
      if (user.refreshToken !== refreshToken) {
         throw new ApiError(401, "Invalid Refresh Token")
      }

      req.user = user;



      next();


   } catch (error) {
      throw new ApiError(401, error?.message || "Invalid access token")
   }
})