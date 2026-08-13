import { registry } from "./registry";
import { authResponseSchema, checkSignupAvailabilityResponseSchema, checkSignupAvailabilitySchema, loginSchema, meResponseSchema, signupSchema } from "../schemas/authSchemas";
import { authFailureResponses, notFoundResponse, validationFailureResponse } from "./shared";

const rateLimitedResponse = notFoundResponse(
    "Too many signup/login attempts from this IP — shared limiter, 10 per 15 minutes."
);

registry.registerPath({
    method: "post",
    path: "/api/auth/signup",
    tags: ["Auth"],
    summary: "Create a new account",
    request: {
        body: { content: { "application/json": { schema: signupSchema } } },
    },
    responses: {
        201: { description: "Account created.", content: { "application/json": { schema: authResponseSchema } } },
        400: validationFailureResponse,
        409: notFoundResponse("Username or email already in use."),
        429: rateLimitedResponse,
    },
});

registry.registerPath({
    method: "post",
    path: "/api/auth/checkSignup",
    tags: ["Auth"],
    summary: "Check if account sign-in is available",
    request: {
        body: { content: { "application/json": { schema: checkSignupAvailabilitySchema } } },
    },
    responses: {
        200: { description: "Username / email combo is available", content: { "application/json": { schema: checkSignupAvailabilityResponseSchema } } },
        400: validationFailureResponse,
        409: notFoundResponse("Username or email already in use."),
        429: rateLimitedResponse,
    },
});

registry.registerPath({
    method: "post",
    path: "/api/auth/login",
    tags: ["Auth"],
    summary: "Log in with an existing account",
    request: {
        body: { content: { "application/json": { schema: loginSchema } } },
    },
    responses: {
        200: { description: "Login succeeded.", content: { "application/json": { schema: authResponseSchema } } },
        400: validationFailureResponse,
        401: notFoundResponse("Invalid email or password."),
        429: rateLimitedResponse,
    },
});

registry.registerPath({
    method: "get",
    path: "/api/auth/me",
    tags: ["Auth"],
    summary: "Get the current authenticated user's profile",
    security: [{ bearerAuth: [] }],
    responses: {
        200: {
            description: "The authenticated user's profile.",
            content: { "application/json": { schema: meResponseSchema } },
        },
        ...authFailureResponses,
        404: notFoundResponse("User not found."),
    },
});
