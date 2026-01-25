import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { studentPost } from "../models/studentPost.model.js";


import mongoose from "mongoose";

const createStudentPost = asyncHandler(async(req, res)=>{
    const {selectedCategory, selectedSubject, studentQualification, requirement, tutorQualification, offer, mode, country, address} = req.body


    if(!(selectedCategory && selectedSubject && studentQualification && requirement && tutorQualification && offer && mode && country && address)){
        throw new ApiError(400, "All fields are required")
    }

    try {
        await studentPost.create({
            studentID: new mongoose.Types.ObjectId(req.user._id),
            selectedCategory,
            selectedSubject,
            studentQualification,
            requirement,
            tutorQualification,
            offer,
            mode,
            country,
            address
        })
    } catch (error) {
        console.error(error)
    }

    return res.status(200).json(
        new ApiResponse(200, "Data posted successfully")
    )
})

export { createStudentPost }