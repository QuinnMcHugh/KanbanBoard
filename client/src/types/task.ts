import type { Label } from "./label";

export const TASK_STATUSES = [
    "to_do",
    "in_progress",
    "in_review",
    "blocked",
    "done",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
    id: number;
    name: string;
    description: string;
    status: TaskStatus;
    project_id: number;
    assigned_to_user_id: number | null;
    created_at: string;
    updated_at: string;
    labels: Label[];
}
