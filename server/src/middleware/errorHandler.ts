import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err: any, req, res, next) => {
    if (typeof err?.status === "number" && err.status < 500) {
        res.status(err.status).json({ error: err.message || "Malformed request." });
        return;
    }

    if (err?.code === "SQLITE_CONSTRAINT" && typeof err.message === "string") {
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
