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
   //check if user already reported before counter if existing
   //create if not existing
   

    
    return res.json(new ApiResponse(200,{},"reported"))


})



export {reporting};