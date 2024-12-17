import { ApiError } from "../utils/ApiError.js";

import { asyncHandler } from "../utils/asyncHandler.js";
 
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
 import { Upi } from "../models/upi.model.js";


const createComment=asyncHandler(async(req,res)=>{
    const {associatedUpi,content}=req.body;
 
    const user=req.user;

        const upi=await Upi.findOne({baseUpi:associatedUpi});
      

        if(!upi){
            throw new ApiError(409,"Unauthorized comment")
        }
 
   
    const comment=await Comment.create({
        associatedUpi:upi._id,
        owner:user._id,
        content
    })

    console.log(comment)

    const createdComment=await Comment.findById(comment._id);
     
    if(!createdComment){
        throw new ApiError(403,"Error while creating comment")
    }

    return res.status(200).json(new ApiResponse(200,{},"Commented Successfully"))
})


export {createComment};