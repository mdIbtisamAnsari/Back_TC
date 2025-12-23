import mongoose, {Schema} from "mongoose"

const ReviewSchema = new Schema({},{timestamps:true})

export const Review = mongoose.model("Review", ReviewSchema)