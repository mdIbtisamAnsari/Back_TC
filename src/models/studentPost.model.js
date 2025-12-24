import mongoose, {Schema} from "mongoose";

const StudentPostSchema = new Schema({
    studentName:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    grade:{
        types: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    subject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    },
    offer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }
},{timestamps: true})