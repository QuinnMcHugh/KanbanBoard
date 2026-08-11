import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export const registry = new OpenAPIRegistry();

// authenticateToken expects `Authorization: Bearer <token>` — every protected
// route's registerPath() references this by name via `security: [{ bearerAuth: [] }]`.
registry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
});
