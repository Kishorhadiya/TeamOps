import { Router } from "express";
import { createTask, getAllTasks, updateTaskStatus } from "../controller/task.controller.js";

const TaskRouter = Router();

TaskRouter.post("/createTask", createTask);
TaskRouter.get("/allTasks", getAllTasks);
TaskRouter.post("/updateStatus", updateTaskStatus);

export default TaskRouter;