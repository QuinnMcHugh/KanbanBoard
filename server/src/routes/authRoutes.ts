import { Router } from "express";
import { signup, login, getMe } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Public Routes (No token required)
router.post("/signup", signup);
router.post("/login", login);

// Protected Routes (Token required)
router.get("/me", authenticateToken, getMe);

export default router;
