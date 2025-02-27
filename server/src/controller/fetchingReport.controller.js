import { ApiError } from "../utils/ApiError.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { Upi } from "../models/upi.model.js";
import extractBaseUpi from "../utils/baseUpi.js";
import isValidUpi from "../utils/validUpi.js";





const fetchReport = asyncHandler(async (req, res) => {

    const { upi } = req.body;


    if (!isValidUpi(upi)) {
        throw new ApiError(401, "Invalid upi format")
    }

    const baseUpi = extractBaseUpi(upi);
    const existingUpi = await Upi.findOne({ baseUpi }).select("-reportedBy")


    if (!existingUpi) {
        return res.status(207).json(
            new ApiResponse(207, {}, "Not Reported till now if suspicous please report")
        )
    } else {
        return res.status(200).json(
            new ApiResponse(200, existingUpi, "Report fetched")
        )

    }

})


export { fetchReport };

