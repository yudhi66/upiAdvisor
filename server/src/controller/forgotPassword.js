import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import redis from "../db/redis.js";
import crypto from 'crypto'

import { sendEmail } from "../utils/senmail.js";

const generateOtp = asyncHandler(async (req, res) => {

  const { email } = req.body

  const user = await User.findOne({ email });

  if (user) {
    const otp = crypto.randomInt(100000, 999999).toString();

    await redis.set(`${email}:otp`, otp, 'EX', 300);




    const send = await sendEmail(email, otp);

    if (send === false) {
      throw new ApiError(502, "Error while sending email try after some time")
    }




  }


  return res.status(200).json(new ApiResponse(200, {}, "You will receive password reset otp in inbox if you are registered user otp is only valid for 5 minutes if not found check spam folder"))



})


const validateOtp = asyncHandler(async (req, res) => {
  const { otp, email, newPassword } = req.body

  const correctOtp = await redis.get(`${email}:otp`)

  if (otp === correctOtp) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(402, "Couldnt update password try after some time")
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, {}, "password updated successfully"))
  } else {
    return res.status(401).json(new ApiResponse(401, {}, "otp verification failed"))
  }

})


export { generateOtp, validateOtp };