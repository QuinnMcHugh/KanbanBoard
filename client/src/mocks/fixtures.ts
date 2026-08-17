import type { User } from "../types/user"
import type { Project } from "../types/project"
import type { Label } from "../types/label"
import type { Task } from "../types/task"

// Static, dev/Storybook-only fixture data — never imported by real app code.
export const users: User[] = [
    { id: 1, username: "alice_admin", email: "alice@example.com" },
    { id: 2, username: "bob_builder", email: "bob@example.com" },
    { id: 3, username: "quinn_the_eskimo", email: "quinn@example.com" },
]

export const projects: Project[] = [
    {
        id: 1,
        name: "Marketing Site Relaunch",
        created_at: "2026-07-01T12:00:00.000Z",
        owner: users[0].username,
        owner_email: users[0].email,
    },
    {
        id: 2,
        name: "Mobile App v2",
        created_at: "2026-07-15T09:30:00.000Z",
        owner: users[1].username,
        owner_email: users[1].email,
    },
]

export const labels: Label[] = [
    { id: 1, name: "Frontend", color: "#3b82f6" },
    { id: 2, name: "Backend", color: "#22c55e" },
    { id: 3, name: "Urgent", color: "#ef4444" },
    { id: 4, name: "Design", color: "#8b5cf6" },
]

export const tasks: Task[] = [
    {
        id: 1,
        name: "Fix login crash on Safari",
        description:
            "Users report the login form crashes on Safari 17 when submitting with autofill.",
        status: "to_do",
        project_id: 1,
        assigned_to_user_id: users[0].id,
        created_at: "2026-07-02T10:00:00.000Z",
        updated_at: "2026-07-02T10:00:00.000Z",
        labels: [labels[0], labels[2]],
    },
    {
        id: 2,
        name: "Design new pricing page",
        description: "Mock up 3 pricing tiers with the new brand colors.",
        status: "in_progress",
        project_id: 1,
        assigned_to_user_id: users[2].id,
        created_at: "2026-07-03T10:00:00.000Z",
        updated_at: "2026-07-05T14:00:00.000Z",
        labels: [labels[3]],
    },
    {
        id: 3,
        name: "Migrate API to new auth middleware",
        description: "",
        status: "in_review",
        project_id: 1,
        assigned_to_user_id: null,
        created_at: "2026-07-04T10:00:00.000Z",
        updated_at: "2026-07-06T11:00:00.000Z",
        labels: [labels[1]],
    },
    {
        id: 4,
        name: "Set up CI pipeline",
        description: "Blocked on infra team provisioning a runner.",
        status: "blocked",
        project_id: 1,
        assigned_to_user_id: users[1].id,
        created_at: "2026-07-01T10:00:00.000Z",
        updated_at: "2026-07-06T09:00:00.000Z",
        labels: [],
    },
    {
        id: 5,
        name: "Write onboarding docs",
        description: "First draft is done and reviewed.",
        status: "done",
        project_id: 1,
        assigned_to_user_id: users[0].id,
        created_at: "2026-06-28T10:00:00.000Z",
        updated_at: "2026-07-01T16:00:00.000Z",
        labels: [labels[3]],
    },
]
