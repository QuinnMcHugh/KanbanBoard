import { apiRequest, HttpMethod } from "../lib/apiClient"
import type { Task, TaskStatus } from "../types/task"

export interface CreateTaskBody {
    name: string
    description: string
    status: TaskStatus
    assigned_to_user_id?: number
    labelIds?: number[]
}

export interface UpdateTaskBody {
    name?: string
    description?: string
    status?: TaskStatus
    assigned_to_user_id?: number | null
    labelIds?: number[]
}

export function getTasks(projectId: number): Promise<{ tasks: Task[] }> {
    return apiRequest<{ tasks: Task[] }>(`/api/projects/${projectId}/tasks`)
}

export function createTask(
    projectId: number,
    body: CreateTaskBody,
): Promise<{ task: Task }> {
    return apiRequest<{ task: Task }>(`/api/projects/${projectId}/tasks`, {
        method: HttpMethod.POST,
        body: JSON.stringify(body),
    })
}

export function updateTask(
    projectId: number,
    taskId: number,
    patch: UpdateTaskBody,
): Promise<{ task: Task }> {
    return apiRequest<{ task: Task }>(
        `/api/projects/${projectId}/tasks/${taskId}`,
        {
            method: HttpMethod.PATCH,
            body: JSON.stringify(patch),
        },
    )
}

export function deleteTask(
    projectId: number,
    taskId: number,
): Promise<{ task: Task }> {
    return apiRequest<{ task: Task }>(
        `/api/projects/${projectId}/tasks/${taskId}`,
        { method: HttpMethod.DELETE },
    )
}
