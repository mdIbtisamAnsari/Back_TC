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
    passward:{
        type: String,
        required: [true, 'PASSWARD IS REQUIRED']

    },
    refreshToken:{
        type: String
    }
}, { timestamps: true })

UserSchema.pre("save", async function(next){
    if(!this.isModified("passward")) return next()
    this.passward= await bcrypt.hash(this.passward, 10)
    next()
})

UserSchema.methods.isPasswarwCorrect= async function(passward){
    return await bcrypt.compare(passward, this.passward)
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