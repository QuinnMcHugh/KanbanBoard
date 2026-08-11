import { registry } from "./registry";
import {
    createLabelSchema,
    labelIdParamSchema,
    labelListResponseSchema,
    labelResponseSchema,
    updateLabelSchema,
} from "../schemas/labelSchemas";
import { authFailureResponses, notFoundResponse, validationFailureResponse } from "./shared";

registry.registerPath({
    method: "get",
    path: "/api/labels",
    tags: ["Labels"],
    summary: "List all labels",
    description: "Labels are global — not scoped to a project or task.",
    security: [{ bearerAuth: [] }],
    responses: {
        200: { description: "All labels.", content: { "application/json": { schema: labelListResponseSchema } } },
        ...authFailureResponses,
    },
});

registry.registerPath({
    method: "get",
    path: "/api/labels/{id}",
    tags: ["Labels"],
    summary: "Get a single label",
    security: [{ bearerAuth: [] }],
    request: { params: labelIdParamSchema },
    responses: {
        200: { description: "The label.", content: { "application/json": { schema: labelResponseSchema } } },
        400: validationFailureResponse,
        ...authFailureResponses,
        404: notFoundResponse("Label not found."),
    },
});

registry.registerPath({
    method: "post",
    path: "/api/labels",
    tags: ["Labels"],
    summary: "Create a label",
    security: [{ bearerAuth: [] }],
    request: {
        body: { content: { "application/json": { schema: createLabelSchema } } },
    },
    responses: {
        201: { description: "The created label.", content: { "application/json": { schema: labelResponseSchema } } },
        400: validationFailureResponse,
        ...authFailureResponses,
        409: notFoundResponse("A label with this name already exists."),
    },
});

registry.registerPath({
    method: "patch",
    path: "/api/labels/{id}",
    tags: ["Labels"],
    summary: "Update a label",
    security: [{ bearerAuth: [] }],
    request: {
        params: labelIdParamSchema,
        body: { content: { "application/json": { schema: updateLabelSchema } } },
    },
    responses: {
        200: { description: "The updated label.", content: { "application/json": { schema: labelResponseSchema } } },
        400: validationFailureResponse,
        ...authFailureResponses,
        404: notFoundResponse("Label not found."),
        409: notFoundResponse("A label with this name already exists."),
    },
});

registry.registerPath({
    method: "delete",
    path: "/api/labels/{id}",
    tags: ["Labels"],
    summary: "Delete a label",
    description: "Cascades — removes this label from every task it was attached to.",
    security: [{ bearerAuth: [] }],
    request: { params: labelIdParamSchema },
    responses: {
        200: { description: "The deleted label.", content: { "application/json": { schema: labelResponseSchema } } },
        400: validationFailureResponse,
        ...authFailureResponses,
        404: notFoundResponse("Could not find label matching id."),
    },
});
