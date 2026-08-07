import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db/db";
import type { AuthRequest } from "../middleware/auth";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function signup(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: "Username, email, and password are required." });
    return;
  }

  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const [newUser] = await db("users").insert({
    username,
    email,
    password_hash
  }).returning(["id", "username", "email"]);

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: "24h" });

  res.status(201).json({
    message: "User created successfully!",
    token,
    user: newUser
  });
};

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const user = await db("users").where({ email }).first();

  const genericBadSigninMessage = 'Invalid email or password.';
  if (!user) {
    res.status(401).json({ error: genericBadSigninMessage });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    res.status(401).json({ error: genericBadSigninMessage });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" });

  res.status(200).json({
    message: "Logged in successfully!",
    token,
    user: { id: user.id, username: user.username, email: user.email }
  });
};

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  const user = await db("users")
    .select("id", "username", "email")
    .where({ id: req.userId })
    .first();

  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  res.status(200).json({ user });
};
