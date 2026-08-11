import { z } from "zod";

export const errorResponseSchema = z
    .object({
        error: z.string().meta({ description: "Human-readable description of what went wrong." }),
    })
    .meta({
        id: "ErrorResponse",
        description: "Standard error shape returned by every endpoint on failure.",
    });
