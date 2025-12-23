import mongoose, {Schema} from "mongoose";

const TeacherSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    subjects: [{
        type: String,
        required: true
    }],
    qualifications: [{
        degree: String,
        institution: String,
        year: Number
    }],
    coursesTeaching: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }]
}, {
    timestamps: true
});

export const Teacher = mongoose.model("Teacher", TeacherSchema);