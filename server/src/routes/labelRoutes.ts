import { Router } from "express";
import { createLabel, deleteLabel, getLabel, getLabels, updateLabel } from "../controllers/labelController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Protected Routes (Token required)
router.get("/", authenticateToken, getLabels);
router.get("/:id", authenticateToken, getLabel);
router.post("/", authenticateToken, createLabel);
router.patch("/:id", authenticateToken, updateLabel);
router.delete("/:id", authenticateToken, deleteLabel);

export default router;
