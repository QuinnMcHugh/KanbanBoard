import { Router } from "express";
import { createLabel, deleteLabel, getLabel, getLabels, updateLabel } from "../controllers/labelController";
import { authenticateToken } from "../middleware/auth";
import { validateBody, validateParams } from "../middleware/validate";
import { createLabelSchema, labelIdParamSchema, updateLabelSchema } from "../schemas/labelSchemas";

const router = Router();

// Protected Routes (Token required)
router.get("/", authenticateToken, getLabels);
router.get("/:id", authenticateToken, validateParams(labelIdParamSchema), getLabel);
router.post("/", authenticateToken, validateBody(createLabelSchema), createLabel);
router.patch("/:id", authenticateToken, validateParams(labelIdParamSchema), validateBody(updateLabelSchema), updateLabel);
router.delete("/:id", authenticateToken, validateParams(labelIdParamSchema), deleteLabel);

export default router;
