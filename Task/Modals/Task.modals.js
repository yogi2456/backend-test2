import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    dueDate: {
        type: Date,
        required: true,
    },
    completed: {
        type: String,
        enum: ["true", "false"],
        default: 'false'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

export default mongoose.model("Task", taskSchema)