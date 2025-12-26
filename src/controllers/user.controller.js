import {assyncHandler} from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const registerUser = assyncHandler( async (req, res) => {

    const { userName, fullName, email, password, role} = req.body;

    const allCredentials = (userName && fullName && email && password && role)

    if (!allCredentials) {
        throw new ApiError(400, "All all credentials are required")
    }

    const existedUser = await User.findOne(
        { $or: [ { userName }, { email }]}
    )

    if (existedUser) { throw new ApiError(409,"user already exists with given username or email")}

    const profileImageLocalPath = req.files?.image[0]?.path;

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

export { registerUser }