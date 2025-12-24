import mongoose, {Schema} from "mongoose";

const TeacherSchema = new Schema({
    _id: false,
    teacherID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    teacherFullName:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    experience:{
        type: String,
    },
    discription:{
        type:string
    },
    coursesOffered:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    }],
    monthlyRate: {
        type: Number,
        required: true
    },
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    rating:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
}, {timestamps: true});

export const Teacher = mongoose.model("Teacher", TeacherSchema);