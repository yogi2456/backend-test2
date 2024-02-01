import { connect } from "nats";
import User from "../Modals/User.modal.js";
import Task from "../Modals/Task.modals.js"

const natsOptions = {
    servers: ['nats://localhost:4222'],
};
let natsConnection;

const publishEvent = async (subject, data) => {
    if (!natsConnection) {
        console.log('Attempting to connect to NATS server...');
        natsConnection = await connect(natsOptions);
        console.log('Connected to NATS server.');
    }

    try {
        natsConnection.publish(subject, data);
        console.log('Event published successfully');
        await natsConnection.flush();
    } catch (error) {
        console.error('Error publishing event:', error);
    }
};

export const CreateTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, adminId } = req.body;

        const isAdmin = await User.findOne({ _id: adminId, type: "admin" })
        if (!isAdmin) return res.status(401).json({ error: "Admin not found." })

        const newTask = new Task({ title, description, priority, dueDate });
        await newTask.save();

        res.status(201).json({ success: true, newTask });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

export const UpdateTask = async (req, res) => {
    try {
        const { id, title, description, priority, dueDate, adminId } = req.body;

        const isAdmin = await User.findOne({ _id: adminId, type: "admin" })
        if (!isAdmin) return res.status(401).json({ error: "Admin not found." })

        const updatedTask = await Task.findByIdAndUpdate(id, { title, description, priority, dueDate }, { new: true });

        res.status(201).json({ success: true, updatedTask });

    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

export const SortSearch = async (req, res) => {
    try {

        const { adminId, searchQuery, sortBy } = req.body;

        const isAdmin = await User.findOne({ _id: adminId, type: "admin" })
        if (!isAdmin) return res.status(401).json({ error: "Admin not found." })

        const query = {};
        if (searchQuery) {
            query.$or = [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
            ];
        }

        let sort = {};
        switch (sortBy) {
            case 'completionStatus':
                sort.completed = 1;
                break;
            case 'dueDate':
                sort.dueDate = 1;
                break;
            case 'priority':
                sort.priority = 1;
                break;
            default:
                sort.createdAt = -1;
                break;
        }

        const tasks = await Task.find(query).sort(sort);

        res.status(201).json({ success: true, tasks });

    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

export const ReadOwnTasks = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const userTasks = await Task.find({ userId: userId });

        res.status(201).json({ success: true, userTasks });

    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

export const MarkTaskAsComplete = async (req, res) => {
    try {
        const { userId, taskId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const task = await Task.findOne({ _id: taskId, userId });
        if (!task) {
            return res.status(404).json({ error: "Task not found or does not belong to the user." });
        }

        task.completed = true;
        await task.save();

        const eventData = {
            userId: userId,
            taskId: taskId,
            completedAt: new Date(),
        };

        await publishEvent('TASK_COMPLETED', JSON.stringify(eventData));

        res.status(201).json({ success: true, task });

    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

export const AssignTaskToUser = async (req, res) => {
    try {
        const { adminId, taskId, assignedUserId } = req.body;

        const isAdmin = await User.findOne({ _id: adminId, type: "admin" });
        if (!isAdmin) {
            return res.status(401).json({ error: "Admin not found." });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found." });
        }

        const assignedUser = await User.findById(assignedUserId);
        if (!assignedUser) {
            return res.status(404).json({ error: "Assigned user not found." });
        }

        task.userId = assignedUserId;
        await task.save();

        res.status(201).json({ success: true, task });

    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}



export const CompleteTask = async (req, res) => {
    try {
        // const { taskId, userId } = req.body;
        const {name} = req.body
        // if (!taskId || !userId) {
        //     return res.status(400).json({ error: 'Invalid request. Both taskId and userId are required.' });
        // }
        // const updatedTask = await Task.findOneAndUpdate(
        //     { _id: taskId, userId },
        //     { completed: true },
        //     { new: true, useFindAndModify: false }
        // // );
        // if (!updatedTask) {
        //     return res.status(404).json({ error: 'User not belong to task or Task not found' });
        // }

        const completedTaskEvent = {
            eventType: 'TASK_COMPLETED',
            // taskId: taskId,
            // userId: userId,
            completedAt: new Date().toISOString()
        };
        try {
            await publishEvent('TASK_COMPLETED', JSON.stringify(completedTaskEvent));
        } catch (error) {
            console.error('Error publishing event:', error);
        }
        res.status(201).json({ success: true, message: 'Task marked as complete' });

    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}