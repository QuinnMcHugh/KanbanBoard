import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export function validateBody(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                error: result.error.issues.map((issue) => issue.message).join(" "),
            });
            return;
        }

        req.body = result.data;
        next();
    };
}

export function validateParams(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.params);

        if (!result.success) {
            res.status(400).json({
                error: result.error.issues.map((issue) => issue.message).join(" "),
            });
            return;
        }

        next();
    };
}
