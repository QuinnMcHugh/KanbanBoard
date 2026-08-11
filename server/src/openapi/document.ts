import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry";

import "./healthPaths";
import "./authPaths";
import "./projectPaths";
import "./labelPaths";
import "./taskPaths";

export function generateOpenApiDocument() {
    const generator = new OpenApiGeneratorV31(registry.definitions);

    return generator.generateDocument({
        openapi: "3.1.0",
        info: {
            title: "Kanban API",
            version: "1.0.0",
            description:
                "REST API for a tenant-wide Kanban board — any authenticated user can read/edit/delete any project, task, or label. Auth is via a JWT bearer token returned from signup/login.",
        },
        servers: [{ url: "/", description: "Current server" }],
    });
}
