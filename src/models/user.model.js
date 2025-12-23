import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    profilePhoto: {
        type: String,
        required: true
    },
    fullName:{
        type: String,
        required:true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['student', 'tutor'],
        lowercase: true,
        trim: true
    },
    passward:{
        type: String,
        required: [true, 'PASSWARD IS REQUIRED']

    },
    refreshToken:{
        type: String
    }
}, { timestamps: true })

export const User = mongoose.model("User", UserSchema)