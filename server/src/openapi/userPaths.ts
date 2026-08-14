import { registry } from "./registry";
import { userListResponseSchema } from "../schemas/authSchemas";
import { authFailureResponses } from "./shared";

registry.registerPath({
    method: "get",
    path: "/api/users",
    tags: ["Users"],
    summary: "List all users",
    description: "Used to populate assignee pickers. Never includes password_hash.",
    security: [{ bearerAuth: [] }],
    responses: {
        200: { description: "All users.", content: { "application/json": { schema: userListResponseSchema } } },
        ...authFailureResponses,
    },
});
