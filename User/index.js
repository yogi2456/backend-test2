import  express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import router from "./Routes/index.js";
import  {connect}  from "nats"
import bodyParser from "body-parser"



const app = express();

dotenv.config();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("welcome to backend yogesh")
})

app.use('/api/v1', router)


app.use(bodyParser.json());

mongoose.connect('mongodb+srv://yogeshsagaluri:E6Zw5fo12XI5e8v6@cluster0.2bajso6.mongodb.net/test2', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const natsOptions = {
    servers: ['nats://localhost:4222'],
  };
  
  const handleTaskCompletedEvent = (msg) => {
    const eventData = JSON.parse(msg.data);
    console.log(`User ${eventData.userId} completed task ${eventData.taskId} at ${eventData.completedAt}`);
  };
  
  const subscribeToTaskCompletedEvent = async () => {
    try {
      const nc = await connect(natsOptions);
      console.log('Connected to NATS server.');
      const subscription = nc.subscribe('TASK_COMPLETED', (err, msg) => {
        try {
          handleTaskCompletedEvent(msg);
          console.log('Received TASK_COMPLETED event');
        } catch (error) {
          console.error('Error handling TASK_COMPLETED event:', error);
        }
      });
      // subscription.unsubscribe();
    } catch (error) {
      console.error('Error connecting to NATS server:', error);
    }
  };
  
  subscribeToTaskCompletedEvent().catch((err) => {
    console.error('Error:', err.message);
  });
  

app.listen(8001, () => console.log("App is running on port 8001"))