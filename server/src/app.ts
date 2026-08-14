import "./env";
import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { apiReference } from "@scalar/express-api-reference";
import { corsOptions } from "./corsOptions";
import { logger } from "./logger";
import { generateOpenApiDocument } from "./openapi/document";
import authRoutes from "./routes/authRoutes";
import healthRoutes from "./routes/healthRoutes";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import labelRoutes from "./routes/labelRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use((req, res, next) => {
    // A fresh nonce per request, so /docs (the one page that needs a CDN-hosted
    // script) can be allowed under an otherwise-strict 'self' CSP without loosening
    // script-src for the whole app. See helmet's own README for this exact pattern.
    res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
    next();
});
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                scriptSrc: ["'self'", (req, res: any) => `'nonce-${res.locals.cspNonce}'`],
            },
        },
    })
);
app.use(cors(corsOptions));
app.use(express.json());
app.use(pinoHttp({ logger }));
app.use((req, res, next) => {
    res.setHeader("X-Request-Id", String(req.id));
    next();
});

const openApiDocument = generateOpenApiDocument();

app.get("/openapi.json", (req, res) => {
    res.json(openApiDocument);
});

app.get("/docs", (req, res, next) => {
    const handler = apiReference({
        url: "/openapi.json",
        pageTitle: "Kanban API Reference",
        nonce: res.locals.cspNonce,
    }) as unknown as express.RequestHandler;
    handler(req, res, next);
});

app.use("/api/auth", authRoutes);

app.use("/api/health", healthRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/projects/:projectId", taskRoutes);

app.use("/api/labels", labelRoutes);

app.use("/api/users", userRoutes);

app.use(errorHandler);

export default app;
