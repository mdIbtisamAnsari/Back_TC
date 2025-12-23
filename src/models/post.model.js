import mongoose, {Schema} from "mongoose";

const PostSchema = new Schema({
    teacherName:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    courses:{},
    rating:{},
    discription:{}
},{timestamps:true})

export const Post = mongoose.model("Post", PostSchema)