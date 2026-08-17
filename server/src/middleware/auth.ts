import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { UnauthorizedError, ForbiddenError } from "../errors"

const JWT_SECRET = process.env.JWT_SECRET!

// Extend the default Express Request interface for our custom types
export interface AuthRequest extends Request {
    userId?: number
}

export const authenticateToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): void => {
    const authHeader = req.headers["authorization"]

    // Parse <token> out of "Bearer <token>"
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        next(new UnauthorizedError("Access denied. No token provided."))
        return
    }

    // jwt.verify's callback runs outside Express's own call stack (it's invoked by
    // jsonwebtoken internally, not awaited by this function) — a `throw` in here
    // would NOT be caught by Express and could crash the process. next(err) is the
    // universally-correct way to forward an error regardless of sync/async/callback
    // context, so it's used for both branches in this function for consistency.
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (
            err ||
            typeof decoded !== "object" ||
            decoded === null ||
            !("userId" in decoded)
        ) {
            next(new ForbiddenError("Invalid or expired token."))
            return
        }

        req.userId = (decoded as { userId: number }).userId
        next()
    })
}
