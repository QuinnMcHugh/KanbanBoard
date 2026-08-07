import { Router } from "express";
import { serverHealthCheck } from "../controllers/healthController";

const router = Router();

router.get("/check", serverHealthCheck);

export default router;
