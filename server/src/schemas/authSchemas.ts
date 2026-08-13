import { z } from "zod";

const usernameEmailCombo = {
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters.")
        .max(32, "Username max length exceeded.")
        .meta({ description: "Public display name, 3-32 characters.", example: "alice_admin" }),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("A valid email is required.")
        .meta({ description: "Normalized to lowercase before storage/lookup.", example: "alice@example.com" }),
};

export const signupSchema = z
    .object({
        ...usernameEmailCombo,
        password: z
            .string()
            .min(8, "Password must be at least 8 characters.")
            .meta({ description: "Minimum 8 characters. Never returned in any response." }),
    })
    .meta({ id: "SignupRequest", description: "Body for creating a new user account." });

export const checkSignupAvailabilitySchema = z
    .object({
        ...usernameEmailCombo,
    })
    .meta({ id: "CheckSignupAvailabilityRequest", description: "Body for checking if a new user account username/email combo is valid." });

export const loginSchema = z
    .object({
        email: z.string().trim().toLowerCase().email("A valid email is required.").meta({ example: "alice@example.com" }),
        password: z.string().min(1, "Password is required."),
    })
    .meta({ id: "LoginRequest", description: "Credentials for an existing account." });

export const userSchema = z
    .object({
        id: z.number().int().meta({ description: "Primary key." }),
        username: z.string(),
        email: z.string(),
    })
    .meta({ id: "User", description: "A user account, as returned by the API (never includes password_hash)." });

export const authResponseSchema = z
    .object({
        message: z.string(),
        token: z.string().meta({ description: "JWT bearer token, valid for 24h. Send as `Authorization: Bearer <token>`." }),
        user: userSchema,
    })
    .meta({ id: "AuthResponse", description: "Returned by both signup and login on success." });

export const meResponseSchema = z
    .object({ user: userSchema })
    .meta({ id: "MeResponse", description: "The currently authenticated user's profile." });

export const checkSignupAvailabilityResponseSchema = z
    .object({ message: z.string() })
    .meta({ id: "CheckSignupAvailabilityResponse", description: "Availability of the a credentials sign-in." });

export type SignupInput = z.infer<typeof signupSchema>;
export type CheckSignupAvailabilityInput = z.infer<typeof checkSignupAvailabilitySchema>;
export type LoginInput = z.infer<typeof loginSchema>;
