import mongoose, {Schema} from "mongoose";

const StudentSchema = new Schema({
    _id: false,
    studentsID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    studentName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    grade:{
        type: String
    },
    requiredSubject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    },
    offeredPrise: {
        type: Number
    },

}, {timestamps: true});

export const Student = mongoose.model("Student", StudentSchema);