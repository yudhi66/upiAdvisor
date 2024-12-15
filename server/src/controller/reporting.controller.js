import { ApiError } from "../utils/ApiError.js";

import { asyncHandler } from "../utils/asyncHandler.js";
 
import { ApiResponse } from "../utils/ApiResponse.js";
import { Upi } from "../models/upi.model.js";
import extractBaseUpi from "../utils/baseUpi.js";
import isValidUpi from "../utils/validUpi.js";

const reporting =asyncHandler(async(req,res)=>{

    const user=req.user

    const {upi}=req.body;
    if(!isValidUpi(upi)){
        throw new ApiError(402,"Please Report valid upi");
    }


    const baseUpi=extractBaseUpi(upi);
     
    const existingUpi=await Upi.findOne({baseUpi});
    if(!existingUpi){


        const newReport=await Upi.create({
            baseUpi,
            reportedBy:[user._id],
            associatedUpi:[upi],
            count:1,

        })

        const createdReport=await Upi.findById(newReport._id).select(
            "-reportedBy"
        )

              if(!createdReport){
                throw new ApiError(500,"Something went wrong while reporting please retry after some time")
              }

              return res.status(200).json(
                new ApiResponse(200,createdReport,"Reported Succesfully")
              )

    }



   //check if user already reported before counter if existing
   //create if not existing
   

    
    return res.json(new ApiResponse(200,{},"reported"))


})



export {reporting};