import mongoose, {Schema} from "mongoose";

const TeacherSchema = new Schema({
    
}, {timestamps: true});

export const Teacher = mongoose.model("Teacher", TeacherSchema);