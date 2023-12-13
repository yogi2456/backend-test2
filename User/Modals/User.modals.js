import mongoose, { Schema } from "mongoose";

const user = new Schema({
    username: String,
    email: String,
    type: String
})


export default mongoose.model("User", user)