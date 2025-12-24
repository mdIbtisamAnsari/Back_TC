import mongoose, {Schema} from "mongoose";

const PostSchema = new Schema({
    teacherName:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    courses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    }],
    rating:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher"
    },
    discription:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher"
    },
    monthlyRate:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher"
    }
},{timestamps:true})

export const Post = mongoose.model("Post", PostSchema)