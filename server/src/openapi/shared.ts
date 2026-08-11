import { errorResponseSchema } from "../schemas/commonSchemas";

export const authFailureResponses = {
    401: { description: "No token provided.", content: { "application/json": { schema: errorResponseSchema } } },
    403: { description: "Token is invalid or expired.", content: { "application/json": { schema: errorResponseSchema } } },
} as const;

export const validationFailureResponse = {
    description: "Validation failed.",
    content: { "application/json": { schema: errorResponseSchema } },
} as const;

export const notFoundResponse = (description: string) => ({
    description,
    content: { "application/json": { schema: errorResponseSchema } },
});
