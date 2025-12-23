import mongoose, {Schema} from "mongoose";

const StudentSchema = new Schema({
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
    enrolledCourses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }],
    grade: {
        type: String,
        enum: ['9', '10', '11', '12'],
        required: true
    }
}, {
    timestamps: true
});

export const Student = mongoose.model("Student", StudentSchema);