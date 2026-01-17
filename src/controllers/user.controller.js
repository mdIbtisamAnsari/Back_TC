import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import nodemailer from 'nodemailer'

const generateAccessAndRefreshTokens = async (userId) => {
    const user = await User.findById(userId)

    const accessToken = await user.generateAccessToken()

    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken

    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
}


const registerUser = asyncHandler(async (req, res) => {

    const { userName, fullName, email, password, role } = req.body;

    const profileImageLocalPath = req.files?.image?.[0]?.path;

    const allCredentials = userName && fullName && email && password && role

    if (!allCredentials) {

        if (profileImageLocalPath) {
            fs.unlinkSync(profileImageLocalPath)
        }
        throw new ApiError(400, "All credentials are required")
    }

    const existedUser = await User.findOne(
        { userName }
    )

    if (existedUser) {

        if (profileImageLocalPath) {
            fs.unlinkSync(profileImageLocalPath)
        }
        throw new ApiError(409, "user already exists with given username")
    }


    if (!profileImageLocalPath) {
        throw new ApiError(400, "Profile image is required")
    }

    const photo = await uploadOnCloudinary(profileImageLocalPath)

    if (!photo) {
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

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Error while creating user !!")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, createdUser, "User Registered Successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const credentials = email && password

    if (!credentials) {
        throw new ApiError(400, "All fields are required!!")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
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
                user: loggedInUser, accessToken, refreshToken
            },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incommingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    //console.log(incommingRefreshToken)

    if (!incommingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request")
    }

    try {

        const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        //console.log(decodedToken)

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(
                401, "Invalid Token User Does Not Exist"
            )
        }

        if (incommingRefreshToken !== user?.refreshToken) {
            throw new ApiError(
                400, "Incorrect Refresh Token"
            )
        }


        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200, {
                    accessToken, refreshToken: refreshToken
                },
                    "Access token refreshed"
                )
            )

    } catch (error) {
        throw new ApiError(401, error?.message || "Invaled Refresh Token")
    }
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200, req.user, "User Fetvhed Successfully"
        ))
})

const verifyMail = asyncHandler(async (req, res) => {

    const {email} = req.body

    if(!email){
        throw new ApiError(400, "Email is required")
    }

    const existedEmail = await User.findOne({email})

    if(existedEmail){
        throw new ApiError(410, "Email already exist")
    }

    try {
        const otp = Math.floor(Math.random() * 900000 + 100000)
    
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NODEMAILER_APP_GMAIL,
                pass: process.env.NODEMAILER_APP_PASSWORD,
            },
        });
    
        await transporter.sendMail({
            from: process.env.NODEMAILER_APP_GMAIL,
            to: email,
            subject: "Email Verification - Tute Connect",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Email Verification</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.5;">Hello,</p>
                        <p style="color: #666; font-size: 16px; line-height: 1.5;">Thank you for registering with Tute Connect. Please use the following OTP to verify your email address:</p>
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; text-align: center; margin: 30px 0;">
                            <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px;">${otp}</span>
                        </div>
                        <p style="color: #666; font-size: 14px; line-height: 1.5;">This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
                        <p style="color: #666; font-size: 14px; line-height: 1.5; margin-top: 30px;">If you didn't request this verification, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">© 2026 Tute Connect. All rights reserved.</p>
                    </div>
                </div>
            `
        })
    
        res.status(200).json(new ApiResponse(
            200, otp, "otp sent"
        ))
    } catch (error) {
        throw new ApiError(401, error.message || "Error sending mail")
    }
})

export { registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser, verifyMail }