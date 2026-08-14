import type { Request, Response } from "express";
import db from "../db/db";

export async function getUsers(req: Request, res: Response): Promise<void> {
  const users = await db("users").select("id", "username", "email");

  res.status(200).json({
    users,
  });
};
