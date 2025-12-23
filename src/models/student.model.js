import mongoose, {Schema} from "mongoose";

const StudentSchema = new Schema({}, {timestamps: true});

export const Student = mongoose.model("Student", StudentSchema);