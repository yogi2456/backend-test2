import  express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import router from "./Routes/index.js";



const app = express();

dotenv.config();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("welcome to backend yogesh")
})

app.use('/api/v1', router)


mongoose.connect(process.env.MONGOURL).then(() => console.log("Database Connected.."))

app.listen(8001, () => console.log("App is running on port 8001"))