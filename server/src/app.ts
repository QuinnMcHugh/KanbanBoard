import "./env";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { corsOptions } from "./corsOptions";
import { logger } from "./logger";
import authRoutes from "./routes/authRoutes";
import healthRoutes from "./routes/healthRoutes";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import labelRoutes from "./routes/labelRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(pinoHttp({ logger }));
app.use((req, res, next) => {
    res.setHeader("X-Request-Id", String(req.id));
    next();
});

app.use("/api/auth", authRoutes);

app.use("/api/health", healthRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/projects/:projectId", taskRoutes);

app.use("/api/labels", labelRoutes);

app.use(errorHandler);

export default app;
