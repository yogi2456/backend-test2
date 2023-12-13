import { connect } from "mongoose";

const natsOptions = {
    servers: ['nats://localhost:4222'],
};
let natsConnection;

const publishEvent = async (subject, data) => {
    if (!natsConnection || natsConnection.isClosed()) {
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



export const CompleteTask = async (req, res) => {
    try {
        const { taskId, userId } = req.body;
        if (!taskId || !userId) {
            return res.status(400).json({ error: 'Invalid request. Both taskId and userId are required.' });
        }
        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, userId },
            { completed: true },
            { new: true, useFindAndModify: false }
        );
        if (!updatedTask) {
            return res.status(404).json({ error: 'User not belong to task or Task not found' });
        }

        const completedTaskEvent = {
            eventType: 'TASK_COMPLETED',
            taskId: taskId,
            userId: userId,
            completedAt: new Date().toISOString()
        };
        try {
            await publishEvent('TASK_COMPLETED', JSON.stringify(completedTaskEvent));
        } catch (error) {
            console.error('Error publishing event:', error);
        }
        res.status(201).json({ success: true, message: 'Task marked as complete', task: updatedTask });

    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}