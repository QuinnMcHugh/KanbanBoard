import type { Project } from "../../types/project";
import type { Task } from "../../types/task";
import type { Label } from "../../types/label";

/**
 * Placeholder data so the board is visually verifiable before the real
 * projects/tasks/labels API calls are wired up.
 */

export const MOCK_LABELS: Label[] = [
    { id: 1, name: "Bug", color: "#ef4444" },
    { id: 2, name: "Feature", color: "#3b82f6" },
    { id: 3, name: "Urgent", color: "#f59e0b" },
];

export const MOCK_PROJECTS: Project[] = [
    {
        id: 1,
        name: "Website Redesign",
        created_at: new Date().toISOString(),
        owner: "you",
        owner_email: "you@example.com",
    },
];

export const MOCK_TASKS_BY_PROJECT: Record<number, Task[]> = {
    1: [
        {
            id: 1,
            name: "Set up design tokens",
            description:
                "Pull the color palette and type scale out of the mockup into CSS custom properties.",
            status: "to_do",
            project_id: 1,
            assigned_to_user_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            labels: [MOCK_LABELS[1]],
        },
        {
            id: 2,
            name: "Wire up drag and drop",
            description: "",
            status: "in_progress",
            project_id: 1,
            assigned_to_user_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            labels: [],
        },
        {
            id: 3,
            name: "Fix Safari flexbox bug",
            description: "Columns collapse to zero width in Safari 17.",
            status: "blocked",
            project_id: 1,
            assigned_to_user_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            labels: [MOCK_LABELS[0], MOCK_LABELS[2]],
        },
    ],
};
