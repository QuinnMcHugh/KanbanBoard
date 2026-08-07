import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth";

export async function serverHealthCheck(req: AuthRequest, res: Response): Promise<void> {
  res.status(200).json({ 
    status: "success", 
    message: "Kanban API server is running!" 
  });
};
