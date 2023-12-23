import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import router from "./Routes/index.js";
import bodyParser from "body-parser";


const app = express();
dotenv.config();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());


mongoose.connect('mongodb+srv://yogeshsagaluri:E6Zw5fo12XI5e8v6@cluster0.2bajso6.mongodb.net/test2', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/api/v1', router)


//mongoose.connect(process.env.MONGOURL).then(() => console.log("Database Connected.."))

app.listen(8000, () => console.log("App is running on port 8000.."))