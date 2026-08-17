import { Router } from "express"
import { authenticateToken } from "../middleware/auth"
import { validateBody, validateParams } from "../middleware/validate"
import {
    createTaskSchema,
    projectIdParentParamSchema,
    taskIdParamSchema,
    updateTaskSchema,
} from "../schemas/taskSchemas"
import {
    createTask,
    deleteTask,
    getTask,
    getTasks,
    updateTask,
} from "../controllers/taskController"

const router = Router({ mergeParams: true })

// Protected Routes (Token required)
router.get(
    "/tasks",
    authenticateToken,
    validateParams(projectIdParentParamSchema),
    getTasks,
)
router.get(
    "/tasks/:id",
    authenticateToken,
    validateParams(taskIdParamSchema),
    getTask,
)
router.post(
    "/tasks",
    authenticateToken,
    validateParams(projectIdParentParamSchema),
    validateBody(createTaskSchema),
    createTask,
)
router.delete(
    "/tasks/:id",
    authenticateToken,
    validateParams(taskIdParamSchema),
    deleteTask,
)
router.patch(
    "/tasks/:id",
    authenticateToken,
    validateParams(taskIdParamSchema),
    validateBody(updateTaskSchema),
    updateTask,
)

export default router
