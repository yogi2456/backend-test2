import { Router } from "express";
import taskRoutes from "./Task.routes.js"


const router = Router();

router.use('/task', taskRoutes)


export default router;