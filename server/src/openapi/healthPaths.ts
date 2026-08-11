import { z } from "zod";
import { registry } from "./registry";

const healthResponseSchema = z
    .object({
        status: z.literal("success"),
        message: z.string(),
    })
    .meta({ id: "HealthResponse" });

registry.registerPath({
    method: "get",
    path: "/api/health/check",
    tags: ["Health"],
    summary: "Check whether the server is up",
    responses: {
        200: {
            description: "The server is running.",
            content: { "application/json": { schema: healthResponseSchema } },
        },
    },
});
