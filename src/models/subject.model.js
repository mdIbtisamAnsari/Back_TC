import mongoose, {Schema} from "mongoose";

const SubjectSchema = new Schema({
    category:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    }
})

export const Subject = mongoose.model("Subject", SubjectSchema)