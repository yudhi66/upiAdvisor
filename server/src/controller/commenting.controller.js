import { ApiError } from "../utils/ApiError.js";

import { asyncHandler } from "../utils/asyncHandler.js";
 
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
 import { Upi } from "../models/upi.model.js";
 import mongoose from 'mongoose';


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

     

    const createdComment=await Comment.findById(comment._id);
     
    if(!createdComment){
        throw new ApiError(403,"Error while creating comment")
    }

    return res.status(200).json(new ApiResponse(200,{},"Commented Successfully"))
})

const fetchComment=asyncHandler(async(req,res)=>{
      const {upi}=req.query;

      if(!upi){
        throw new ApiError(403,"Couldn't retrive comment")
      }
       const upiDetails=await Upi.findOne({baseUpi:upi}).select("-reportedBy -associatedUpi -count")
         
     if(!upiDetails){
        throw new ApiError(403,"Couldn't retrive comment")
     }

     const commentList = await Upi.aggregate([
        {
          $match: {
            _id: upiDetails._id,
          },
        },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "associatedUpi",
            as: "result",
          },
        },
        {
          $unwind: {
            path: "$result",
            preserveNullAndEmptyArrays: false,  
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "result.owner",
            foreignField: "_id",
            as: "commentOwner",
          },
        },
        {
          $unwind: {
            path: "$commentOwner",
            preserveNullAndEmptyArrays: false, // Optional, for cases where the comment has no associated user
          },
        },
        {
          $project: {
            "comment._id": "$result._id",
            "comment.content": "$result.content",
            "comment.ownerDetails.username": "$commentOwner.username",
            _id: 0,
          },
        },
      ]);

        
    if(!commentList){
        throw new ApiError(402,"No comments found")
    }

    if(commentList.length==0){

        return res.status(200).json(
            new ApiResponse(200,{},"0 comments on  this upi")
          )

    }
       
      return res.status(200).json(
        new ApiResponse(200,commentList,"Comment fetched")
      )
})




export {createComment,fetchComment};