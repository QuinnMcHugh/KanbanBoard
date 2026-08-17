import { Router } from "express"
import {
    signup,
    login,
    getMe,
    checkSignupAvailability,
} from "../controllers/authController"
import { authenticateToken } from "../middleware/auth"
import { validateBody } from "../middleware/validate"
import { authRateLimiter } from "../middleware/rateLimiter"
import {
    signupSchema,
    loginSchema,
    checkSignupAvailabilitySchema,
} from "../schemas/authSchemas"

const router = Router()

// Public Routes (No token required)
router.post("/signup", authRateLimiter, validateBody(signupSchema), signup)
router.post("/login", authRateLimiter, validateBody(loginSchema), login)
router.post(
    "/checkSignup",
    authRateLimiter,
    validateBody(checkSignupAvailabilitySchema),
    checkSignupAvailability,
)

// Protected Routes (Token required)
router.get("/me", authenticateToken, getMe)

export default router
