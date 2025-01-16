import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken=async(userId)=>{
   try {
      const user=await User.findById(userId);

      const accessToken=user.generateAccessToken();
     

      const refreshToken=user.generateRefreshToken();

      user.refreshToken=refreshToken;

      await user.save({validateBeforeSave:false})

      return {accessToken,refreshToken};
      
   } catch (error) {
      throw new ApiError(500,"Error while generating tokens");
   }
}


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

const loginUser=asyncHandler(async (req,res)=>{
   const {email,password}=req.body;


   if(!email ){
      throw new ApiError(400,"Email required");
   }

   if(!password){
      throw new ApiError(401,"Password required");
   }


 const user=await User.findOne({
  email
 })

 if(!user){
   throw new ApiError(404,"user does not exist")
  }

  const isPasswordValid=await user.passwordCheck(password);
  if(!isPasswordValid){
   throw new ApiError(401,"Incorrect Password")
  }

  const {accessToken,refreshToken}=await generateToken(user._id);
  console.log(accessToken)
  const loggedInUser=await User.findById(user._id).select("-password -refreshToken");

  const options={
   httpOnly:true,
   secure:true
  }


  return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
   new ApiResponse(200,
      {
         user:loggedInUser,accessToken,refreshToken
      },
       "User logged In Successfully"
   )
  )

})

const logOutUser=asyncHandler(async (req,res)=>{
   await User.findByIdAndUpdate(
      req.user._id,
      {
         $unset:{
            refreshToken:1
         }
      },{
         new:true
      }
   )
   const options={
      httpOnly:true,
      secure:true
     }


     return res.status(200).clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
     .json(new ApiResponse(200,{},"User logged Out"))
   
})


const updatePassword=asyncHandler(async (req,res)=>{  

   const tempUser=req.user;
   const {oldPassword,newPassword}=req.body;


   if(!oldPassword || !newPassword){
      throw new ApiError(402,"Old and new password required")
   }

   if(oldPassword===newPassword){
      throw new ApiError(402,"New password should be different from old password")
   }


   const user=await User.findById(tempUser._id);

   if(!user){
      throw new ApiError(402,"Couldnt update password try after some time")
   }

   const isOldPasswordValid=await user.passwordCheck(oldPassword);

   if(!isOldPasswordValid){
      throw new ApiError(404,"Incorrect old password")
   }


   user.password=newPassword;

   await user.save({validateBeforeSave:false})



   return res.status(200).json(new ApiResponse(200,{},"Password Changed Successfully"));




})

const getUser=asyncHandler(async (req,res)=>{
  console.log("hello");

  const incomingRefreshToken=req.cookies.refreshToken;
 
  if(!incomingRefreshToken){
   return res.status(401).json(new ApiResponse(401, {}, "Not logged in"));
  }

 
   const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

   const user=await User.findById(decodedToken?._id).select("-password");
    if(!user || incomingRefreshToken!==user?.refreshToken){
      return res.status(401).json(new ApiResponse(401, {}, "Not logged in"));
    }
    
    const isProduction = process.env.NODE_ENV === "production";

    const accessToken=user.generateAccessToken();
    const options={
      httpOnly: true,
  secure: isProduction,  
  sameSite: isProduction ? "None" : "Lax", 
     }
   
     return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",incomingRefreshToken,options).json(
      new ApiResponse(
        200,
        user,
        "Access token refreshed successfully"
      ));


 

  


})

 


export {createUser,loginUser,logOutUser,updatePassword,getUser};



