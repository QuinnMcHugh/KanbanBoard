import "./env";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import healthRoutes from "./routes/healthRoutes";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import labelRoutes from "./routes/labelRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/health", healthRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/projects/:projectId", taskRoutes);

app.use("/api/labels", labelRoutes);

export default app;
