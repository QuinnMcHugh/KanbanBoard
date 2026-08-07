import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "../controllers/taskController";

const router = Router({ mergeParams: true });

// Protected Routes (Token required)
router.get("/tasks", authenticateToken, getTasks);
router.get("/tasks/:id", authenticateToken, getTask);
router.post("/tasks", authenticateToken, createTask);
router.delete("/tasks/:id", authenticateToken, deleteTask);
router.patch("/tasks/:id", authenticateToken, updateTask);

export default router;
