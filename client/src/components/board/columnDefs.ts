import type { TaskStatus } from "../../types/task"

export interface ColumnDef {
    status: TaskStatus
    label: string
    accentColor: string
}

export const COLUMN_DEFS: ColumnDef[] = [
    { status: "to_do", label: "To Do", accentColor: "oklch(65% 0.01 95)" },
    {
        status: "in_progress",
        label: "In Progress",
        accentColor: "oklch(70% 0.14 70)",
    },
    {
        status: "in_review",
        label: "In Review",
        accentColor: "oklch(60% 0.14 300)",
    },
    { status: "blocked", label: "Blocked", accentColor: "oklch(55% 0.19 25)" },
    { status: "done", label: "Done", accentColor: "oklch(62% 0.13 150)" },
]
