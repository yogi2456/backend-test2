import { Router } from "express";
import { CompleteTask, CreateTask, UpdateTask, SortSearch, ReadOwnTasks, MarkTaskAsComplete, AssignTaskToUser } from "../Controllers/Task.controllers.js";


const router = Router();

app.post('/createTask', CreateTask);

app.post('/updateTask', UpdateTask);

app.post('/sortSearch', SortSearch)

app.post('/readOwnTasks', ReadOwnTasks);

app.post('/markTaskAsComplete', MarkTaskAsComplete);

app.post('/assignTaskToUser', AssignTaskToUser);

app.post('/tasks/complete', CompleteTask);

export default router;