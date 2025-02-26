import { ApiError } from "../utils/ApiError.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { Upi } from "../models/upi.model.js";
import extractBaseUpi from "../utils/baseUpi.js";
import isValidUpi from "../utils/validUpi.js";
import { User } from "../models/user.model.js";

const reporting = asyncHandler(async (req, res) => {

    const user = req.user

    const { upi } = req.body;
    if (!isValidUpi(upi)) {
        throw new ApiError(402, "Please Report valid upi");
    }


    const baseUpi = extractBaseUpi(upi);

    const existingUpi = await Upi.findOne({ baseUpi });

    if (!existingUpi) {


        const newReport = await Upi.create({
            baseUpi,
            reportedBy: [user._id],
            associatedUpi: [upi],
            count: 1,

        })

        const createdReport = await Upi.findById(newReport._id).select(
            "-reportedBy"
        )

        if (!createdReport) {
            throw new ApiError(500, "Something went wrong while reporting please retry after some time")
        }
        const updatedUser = await User.findByIdAndUpdate(user._id, {
            $push: {
                reports: {
                    upi: baseUpi,
                    createdAt: new Date()
                }

            },
        }, { new: true })


        return res.status(200).json(
            new ApiResponse(200, createdReport, "Reported Succesfully")
        )

    } else {

        if (existingUpi.reportedBy.includes(user._id)) {

            const updatedReport = await Upi.findOneAndUpdate(
                { baseUpi },
                {

                    $addToSet: {
                        reportedBy: user._id,
                        associatedUpi: upi,
                    },
                },
                {
                    new: true,
                    fields: { reportedBy: 0 },
                }
            );
            if (!updatedReport) {
                throw new ApiError(404, "Error while reporting");
            }
            return res.status(201).json(
                new ApiResponse(201, updatedReport, "Reported Succesfully")
            )
        } else {
            const updatedReport = await Upi.findOneAndUpdate(
                { baseUpi },
                {
                    $inc: { count: 1 },
                    $addToSet: {
                        reportedBy: user._id,
                        associatedUpi: upi,
                    },
                },
                {
                    new: true,
                    fields: { reportedBy: 0 },
                }
            );
            if (!updatedReport) {
                throw new ApiError(404, "Error while reporting");
            }
            const updatedUser = await User.findByIdAndUpdate(user._id, {
                $push: {
                    reports: {
                        upi: baseUpi,
                        createdAt: new Date()
                    }

                },
            }, { new: true })
            return res.status(200).json(
                new ApiResponse(200, updatedReport, "Reported Succesfully")
            )
        }



    }






})



export { reporting };