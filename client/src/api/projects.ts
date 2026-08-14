import { apiRequest, HttpMethod } from "../lib/apiClient";
import type { Project } from "../types/project";

export function getProjects(): Promise<{ projects: Project[] }> {
    return apiRequest<{ projects: Project[] }>("/api/projects");
}

export function createProject(
    name: string,
    ownerId: number,
): Promise<{ project: Project }> {
    return apiRequest<{ project: Project }>("/api/projects", {
        method: HttpMethod.POST,
        body: JSON.stringify({ name, owner_id: ownerId }),
    });
}

export function deleteProject(id: number): Promise<{ project: Project }> {
    return apiRequest<{ project: Project }>(`/api/projects/${id}`, {
        method: HttpMethod.DELETE,
    });
}
