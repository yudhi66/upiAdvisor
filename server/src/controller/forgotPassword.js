import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import redis from "../db/redis.js";
import crypto from 'crypto'

const generateOtp=asyncHandler(async(req,res)=>{

      const {email}=req.body

     const  user= await User.findOne({email});

     if(user){
        const otp = crypto.randomInt(100000, 999999).toString();

       await redis.set(`${email}:otp`,otp,'EX',300);


     }


     return res.status(200).json(new ApiResponse(200,{},"You will receive password reset otp in inbox if you are registered user otp is only valid for 5 minutes"))


       
})



export {generateOtp};