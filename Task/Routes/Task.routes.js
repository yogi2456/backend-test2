import { Router } from "express";
import { CompleteTask, CreateTask, UpdateTask, SortSearch, ReadOwnTasks, MarkTaskAsComplete, AssignTaskToUser } from "../Controllers/Task.controllers.js";


const router = Router();

router.post('/createTask', CreateTask);

router.post('/updateTask', UpdateTask);

router.post('/sortSearch', SortSearch)

router.post('/readOwnTasks', ReadOwnTasks);

router.post('/markTaskAsComplete', MarkTaskAsComplete);

router.post('/assignTaskToUser', AssignTaskToUser);

router.post('/tasks/complete', CompleteTask);

export default router;