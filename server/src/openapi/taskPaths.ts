import { registry } from "./registry";
import {
    createTaskSchema,
    projectIdParentParamSchema,
    taskIdParamSchema,
    taskListResponseSchema,
    taskResponseSchema,
    updateTaskSchema,
} from "../schemas/taskSchemas";
import { authFailureResponses, notFoundResponse, validationFailureResponse } from "./shared";

const projectNotFoundResponse = notFoundResponse("Project ID was not found.");

registry.registerPath({
    method: "get",
    path: "/api/projects/{projectId}/tasks",
    tags: ["Tasks"],
    summary: "List tasks in a project",
    security: [{ bearerAuth: [] }],
    request: { params: projectIdParentParamSchema },
    responses: {
        200: { description: "Tasks in the project.", content: { "application/json": { schema: taskListResponseSchema } } },
        400: validationFailureResponse,
        ...authFailureResponses,
        404: projectNotFoundResponse,
    },
});

registry.registerPath({
    method: "get",
    path: "/api/projects/{projectId}/tasks/{id}",
    tags: ["Tasks"],
    summary: "Get a single task",
    description: "404s if the task exists but belongs to a different project than :projectId.",
    security: [{ bearerAuth: [] }],
    request: { params: taskIdParamSchema },
    responses: {
        200: { description: "The task.", content: { "application/json": { schema: taskResponseSchema } } },
        400: validationFailureResponse,
        ...authFailureResponses,
        404: notFoundResponse("Project not found, or task not found, or task belongs to a different project."),
    },
});

registry.registerPath({
    method: "post",
    path: "/api/projects/{projectId}/tasks",
    tags: ["Tasks"],
    summary: "Create a task",
    description: "project_id comes from the URL. Creating a task with an invalid assigned_to_user_id or labelIds rolls back the whole operation — no task is created.",
    security: [{ bearerAuth: [] }],
    request: {
        params: projectIdParentParamSchema,
        body: { content: { "application/json": { schema: createTaskSchema } } },
    },
    responses: {
        201: { description: "The created task.", content: { "application/json": { schema: taskResponseSchema } } },
        400: validationFailureResponse,
        ...authFailureResponses,
        404: notFoundResponse("Project not found, or assigned_to_user_id does not reference an existing user."),
    },
});

registry.registerPath({
    method: "patch",
    path: "/api/projects/{projectId}/tasks/{id}",
    tags: ["Tasks"],
    summary: "Update a task",
    description: "Partial update. Omitting labelIds leaves existing labels untouched; sending [] clears them; sending ids replaces the whole set. project_id in the body (not the URL) is what actually moves a task between projects.",
    security: [{ bearerAuth: [] }],
    request: {
        params: taskIdParamSchema,
        body: { content: { "application/json": { schema: updateTaskSchema } } },
    },
    responses: {
        200: { description: "The updated task.", content: { "application/json": { schema: taskResponseSchema } } },
        400: validationFailureResponse,
        ...authFailureResponses,
        404: notFoundResponse("Project not found, task not found, or task belongs to a different project."),
    },
});

registry.registerPath({
    method: "delete",
    path: "/api/projects/{projectId}/tasks/{id}",
    tags: ["Tasks"],
    summary: "Delete a task",
    description: "Cascades — also removes the task's label associations.",
    security: [{ bearerAuth: [] }],
    request: { params: taskIdParamSchema },
    responses: {
        200: { description: "The deleted task.", content: { "application/json": { schema: taskResponseSchema } } },
        400: validationFailureResponse,
        ...authFailureResponses,
        404: notFoundResponse("Project not found, task not found, or task belongs to a different project."),
    },
});
