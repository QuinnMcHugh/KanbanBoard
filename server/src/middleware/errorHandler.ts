import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors";

// Errors reaching this handler can come from anywhere (Express itself, body-parser,
// the sqlite3 driver, a thrown string, ...) — there's no single typed class for them,
// so `err` is narrowed with local type guards instead of trusted at face value.
function hasNumericStatus(err: unknown): err is { status: number; message?: unknown } {
    return (
        typeof err === "object" &&
        err !== null &&
        "status" in err &&
        typeof err.status === "number"
    );
}

function isSqliteConstraintError(err: unknown): err is { code: string; message: string } {
    return (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        err.code === "SQLITE_CONSTRAINT" &&
        "message" in err &&
        typeof err.message === "string"
    );
}

export const errorHandler: ErrorRequestHandler = (err: unknown, req, res, _next) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }

    if (hasNumericStatus(err) && err.status < 500) {
        const message = typeof err.message === "string" ? err.message : "Malformed request.";
        res.status(err.status).json({ error: message });
        return;
    }

    if (isSqliteConstraintError(err)) {
        const uniqueMatch = err.message.match(/UNIQUE constraint failed: \w+\.(\w+)/);
        if (uniqueMatch) {
            res.status(409).json({ error: `A record with this ${uniqueMatch[1]} already exists.` });
            return;
        }

        if (err.message.includes("FOREIGN KEY constraint failed")) {
            res.status(400).json({ error: "A referenced record does not exist." });
            return;
        }
    }

    req.log.error({ err }, "Unhandled error");
    res.status(500).json({ error: "Internal server error." });
};
