import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const StudentPostSchema = new Schema({
    studentID:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    studentQualification:{
        type: String,
        required: true
    },
    selectedSubject:{
        type: String,
        required: true
    },
    selectedCategory:{
        type: String,
        required: true
    },
    offer:{
        type: Number,
        required: true
    },
    requirement:{
        type: String,
        required: true
    },
    tutorQualification:{
        type: String,
        required: true
    },
    mode:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    }
},{timestamps: true})

StudentPostSchema.plugin(mongooseAggregatePaginate)

export const studentPost = mongoose.model("studentPost", StudentPostSchema)