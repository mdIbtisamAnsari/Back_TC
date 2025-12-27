import {asyncHandler} from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import fs from "fs"

const generateAccessAndRefreshTokens = async(userId)=>{    
    const user = await User.findById(userId)

    const accessToken = await user.generateAccessToken()

    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken

    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
}


const registerUser = asyncHandler( async (req, res) => {

    const { userName, fullName, email, password, role} = req.body;

    const profileImageLocalPath = req.files?.image?.[0]?.path;

    const allCredentials = userName && fullName && email && password && role

    if (!allCredentials) {

        if(profileImageLocalPath){
            fs.unlinkSync(profileImageLocalPath)
        }
        throw new ApiError(400, "All credentials are required")
    }

    const existedUser = await User.findOne(
        { $or: [ { userName }, { email }]}
    )

    if (existedUser) { 

        if(profileImageLocalPath){
            fs.unlinkSync(profileImageLocalPath)
        }
        throw new ApiError(409,"user already exists with given username or email")
    }

    if(!profileImageLocalPath){
        throw new ApiError(400, "Profile image is required")
    }

    const photo = await uploadOnCloudinary(profileImageLocalPath)

    if(!photo){
        throw new ApiError(500, "Error while uploading image !!")
    }

    const user = await User.create({
        userName: userName.toLowerCase(),
        fullName,
        email,
        password,
        role,
        profilePhoto: photo.url
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Error while creating user !!")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )
})

const loginUser = asyncHandler( async(req, res )=>{

    const { email, password } = req.body;

    const credentials = email && password

    if (!credentials) {
        throw new ApiError(400, "All fields are required!!")
    }

    const user = await User.findOne({ email })

    if(!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid Password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {
            user: loggedInUser
        }, 
        "User logged in successfully"
        )
    )
})

export { registerUser, loginUser }