import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: [true, "Username Already Taken"]
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
        unique: [true, "This Email Is Already Registered"]
    },
    role: {
        type: String,
        enum: ['student', 'tutor'],
        lowercase: true,
        trim: true,
        required: true
    },
    password:{
        type: String,
        required: [true, 'PASSWORD IS REQUIRED']

    },
    refreshToken:{
        type: String
    }
}, { timestamps: true })

UserSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    this.password= await bcrypt.hash(this.password, 10)
})

UserSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken= async function(){
    return jwt.sign(
    {
        _id: this._id,
        email: this.email,
        userName:this.userName,
        fullName:this.fullName

    },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

UserSchema.methods.generateRefreshToken= async function(){
    return jwt.sign(
    {
        _id: this._id
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User = mongoose.model("User", UserSchema)