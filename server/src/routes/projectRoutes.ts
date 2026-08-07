import { Router } from "express";
import { createProject, deleteProject, getProject, getProjects, updateProject } from "../controllers/projectController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Protected Routes (Token required)
router.get("/", authenticateToken, getProjects);
router.get("/:id", authenticateToken, getProject);
router.post("/", authenticateToken, createProject);
router.patch("/:id", authenticateToken, updateProject);
router.delete("/:id", authenticateToken, deleteProject)

export default router;
