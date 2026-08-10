import { Router } from "express";
import { signup, login, getMe } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { signupSchema, loginSchema } from "../schemas/authSchemas";

const router = Router();

// Public Routes (No token required)
router.post("/signup", validateBody(signupSchema), signup);
router.post("/login", validateBody(loginSchema), login);

// Protected Routes (Token required)
router.get("/me", authenticateToken, getMe);

export default router;
