import mongoose, {Schema} from "mongoose"

const ReviewSchema = new Schema({
    reviewerName:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    reviewTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher"
    },
    review:{
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
},{timestamps: true})

export const Review = mongoose.model("Review", ReviewSchema)