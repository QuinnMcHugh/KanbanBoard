import { apiRequest, HttpMethod } from "../lib/apiClient";
import type { Label } from "../types/label";

export function getLabels(): Promise<{ labels: Label[] }> {
    return apiRequest<{ labels: Label[] }>("/api/labels");
}

export function createLabel(
    name: string,
    color: string,
): Promise<{ label: Label }> {
    return apiRequest<{ label: Label }>("/api/labels", {
        method: HttpMethod.POST,
        body: JSON.stringify({ name, color }),
    });
}

export function deleteLabel(id: number): Promise<{ label: Label }> {
    return apiRequest<{ label: Label }>(`/api/labels/${id}`, {
        method: HttpMethod.DELETE,
    });
}
