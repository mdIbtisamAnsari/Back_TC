import mongoose, {Schema} from "mongoose";

const SubjectSchema = new Schema({},{timestamps:true})

export const Subject = mongoose.model("Subject", SubjectSchema)