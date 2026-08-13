import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db/db";
import type { AuthRequest } from "../middleware/auth";
import type { CheckSignupAvailabilityInput, LoginInput, SignupInput } from "../schemas/authSchemas";
import { ConflictError, NotFoundError, UnauthorizedError } from "../errors";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function checkSignupAvailability(req: Request<Record<string, never>, any, CheckSignupAvailabilityInput>, res: Response): Promise<void> {
  const { username, email } = req.body;

  const [existingUser] = await db("users").where({ email }).orWhere({ username }).returning(["id", "username", "email"]);

  if (existingUser) {
    const isEmailMatch = existingUser.email === email;
    throw new ConflictError(
      isEmailMatch
        ? "Email already in use."
        : "Username already in use."
    );
  }

  res.status(200).json({
    message: "Username / email combo is available",
  });
};

export async function signup(req: Request<Record<string, never>, any, SignupInput>, res: Response): Promise<void> {
  const { username, email, password } = req.body;

  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const [newUser] = await db("users").insert({
    username,
    email,
    password_hash
  }).returning(["id", "username", "email"]);

  const token = jwt.sign({ userId: newUser!.id }, JWT_SECRET, { expiresIn: "24h" });

  res.status(201).json({
    message: "User created successfully!",
    token,
    user: newUser
  });
};

export async function login(req: Request<Record<string, never>, any, LoginInput>, res: Response): Promise<void> {
  const { email, password } = req.body;

  const user = await db("users").where({ email }).first();

  const genericBadSigninMessage = 'Invalid email or password.';
  if (!user) {
    throw new UnauthorizedError(genericBadSigninMessage);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new UnauthorizedError(genericBadSigninMessage);
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
    .where({ id: req.userId! })
    .first();

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  res.status(200).json({ user });
};
