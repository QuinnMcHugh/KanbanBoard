import { Router } from "express";
import { createProject, deleteProject, getProject, getProjects, updateProject } from "../controllers/projectController";
import { authenticateToken } from "../middleware/auth";
import { validateBody, validateParams } from "../middleware/validate";
import { createProjectSchema, projectIdParamSchema, updateProjectSchema } from "../schemas/projectSchemas";

const router = Router();

// Protected Routes (Token required)
router.get("/", authenticateToken, getProjects);
router.get("/:id", authenticateToken, validateParams(projectIdParamSchema), getProject);
router.post("/", authenticateToken, validateBody(createProjectSchema), createProject);
router.patch("/:id", authenticateToken, validateParams(projectIdParamSchema), validateBody(updateProjectSchema), updateProject);
router.delete("/:id", authenticateToken, validateParams(projectIdParamSchema), deleteProject)

export default router;
