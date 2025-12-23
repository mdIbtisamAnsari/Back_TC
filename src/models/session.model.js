import mongoose, {Schema} from "mongoose";

const SessionSchema = new Schema({},{timestamps:true})

export const Session = mongoose.model("Session", SessionSchema)