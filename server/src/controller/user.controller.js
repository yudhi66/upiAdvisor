import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";


 const createUser=asyncHandler(async(req,res)=>{

    const {email,username,password}=req.body;

    if([email,username,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required")
    }
    
const existingUser=await User.findOne({
    $or:[{username},{email}]
})

if(existingUser){
    throw new ApiError(409,"User with email or username already exist")
}

 const user=await User.create({
    username,
    email,
    password
 })

 const createdUser=await User.findById(user._id).select(
    "-password -refreshToken"
 )
 if(!createdUser){
    throw new ApiError(500,"Something went wrong while registring user please retry after some time")

 }

 return res.status(200).json(
    new ApiResponse(200,createUser,"User created successfully")
 )


 })




export {createUser};



