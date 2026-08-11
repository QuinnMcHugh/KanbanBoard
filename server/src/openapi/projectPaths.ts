import { registry } from "./registry";
import {
    createProjectSchema,
    projectIdParamSchema,
    projectListResponseSchema,
    projectResponseSchema,
    updateProjectSchema,
} from "../schemas/projectSchemas";
import { authFailureResponses, notFoundResponse, validationFailureResponse } from "./shared";

registry.registerPath({
    method: "get",
    path: "/api/projects",
    tags: ["Projects"],
    summary: "List all projects",
    security: [{ bearerAuth: [] }],
    responses: {
        200: { description: "All projects.", content: { "application/json": { schema: projectListResponseSchema } } },
        ...authFailureResponses,
    },
});

registry.registerPath({
    method: "get",
    path: "/api/projects/{id}",
    tags: ["Projects"],
    summary: "Get a single project",
    security: [{ bearerAuth: [] }],
    request: { params: projectIdParamSchema },
    responses: {
        200: { description: "The project.", content: { "application/json": { schema: projectResponseSchema } } },
        400: validationFailureResponse,
        ...authFailureResponses,
        404: notFoundResponse("Project not found."),
    },
});

registry.registerPath({
    method: "post",
    path: "/api/projects",
    tags: ["Projects"],
    summary: "Create a project",
    security: [{ bearerAuth: [] }],
    request: {
        body: { content: { "application/json": { schema: createProjectSchema } } },
    },
    responses: {
        201: { description: "The created project.", content: { "application/json": { schema: projectResponseSchema } } },
        400: validationFailureResponse,
        ...authFailureResponses,
    },
});

registry.registerPath({
    method: "patch",
    path: "/api/projects/{id}",
    tags: ["Projects"],
    summary: "Update a project",
    description: "Partial update. Any authenticated user may rename or reassign any project — there is no per-owner access restriction in this API.",
    security: [{ bearerAuth: [] }],
    request: {
        params: projectIdParamSchema,
        body: { content: { "application/json": { schema: updateProjectSchema } } },
    },
    responses: {
        200: { description: "The updated project.", content: { "application/json": { schema: projectResponseSchema } } },
        400: validationFailureResponse,
        ...authFailureResponses,
        404: notFoundResponse("Project not found."),
    },
});

registry.registerPath({
    method: "delete",
    path: "/api/projects/{id}",
    tags: ["Projects"],
    summary: "Delete a project",
    description: "Cascades — also deletes every task under this project (and each task's label associations).",
    security: [{ bearerAuth: [] }],
    request: { params: projectIdParamSchema },
    responses: {
        200: { description: "The deleted project.", content: { "application/json": { schema: projectResponseSchema } } },
        400: validationFailureResponse,
        ...authFailureResponses,
        404: notFoundResponse("Could not find project matching id."),
    },
});
