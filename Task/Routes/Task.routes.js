import { Router } from "express";
import { CompleteTask } from "../Controllers/Task.controllers.js";


const router = Router();

router.post('/complete-task', CompleteTask)

export default router;