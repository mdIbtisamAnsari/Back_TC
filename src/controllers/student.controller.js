import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { studentPost } from "../models/studentPost.model.js";

const createStudentPost = asyncHandler(async (req, res) => {
    let { selectedCategory, selectedSubject, customSubject, studentQualification, requirement, tutorQualification, offer, mode, country, address } = req.body

    if (!(selectedSubject || customSubject)) {
        throw new ApiError(400, "Please select or enter a subject")
    }

    if (customSubject) {
        selectedSubject = customSubject
    }

    if (!(selectedCategory && studentQualification && requirement && tutorQualification && offer && mode && country && address)) {
        throw new ApiError(400, "All fields are required")
    }

    try {
        const newPost = await studentPost.create({
            studentID: req.user._id.toString(),
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
        console.error('Error creating post:', error)
    }

    return res.status(200).json(
        new ApiResponse(200, "Data posted successfully")
    )
})

const getStudentPosts = asyncHandler(async (req, res) => {

    const student = req.user._id

    const posts = await studentPost.aggregate([
        { $match: { 
            studentID: student 
        }},
        {
            $lookup: {
                from: "users",
                localField: "studentID",
                foreignField: "_id",
                as: "studentInfo",
                pipeline:[{
                    $project: {
                        password:0,
                        refreshToken:0
                    }
                }]
            }
        },
        {
            $unwind: "$studentInfo"
        }])

    return res.status(200)

        .json(
            posts,
            new ApiResponse(200, "Post Data Fetched Successfully")
        )
})

const deletePost = asyncHandler(async(req, res)=> {
    const { postID } = req.params;
    try {
        await studentPost.findByIdAndDelete(postID)
    } catch (error) {
        
    }
    return res.status(200).json(
        new ApiResponse(200, "Post Deleted Successfully")
    )
})

export { createStudentPost, getStudentPosts, deletePost }