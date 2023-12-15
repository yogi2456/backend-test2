import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    type: String,
});

export default mongoose.model("User", userSchema)