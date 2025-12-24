import mongoose, {Schema} from "mongoose";

const SessionSchema = new Schema({
    studentID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    teacherID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher"
    },
    subjectID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    },
    status:{
        type: String,
        enum: ['active', 'completed'],
        lowercase: true,
        trim: true,
        required: true
    }
},{timestamps:true})

export const Session = mongoose.model("Session", SessionSchema)