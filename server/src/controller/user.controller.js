import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";




const loginUser=asyncHandler(async (req,res)=>{


 throw new ApiError(400,"user not logged in");
});




export {loginUser};



