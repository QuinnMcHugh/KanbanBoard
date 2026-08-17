import type { Knex } from "knex"

export async function seed(knex: Knex): Promise<void> {
    // 1. Delete existing entries (in reverse order of dependencies to respect Foreign Keys)
    await knex("task_labels").del()
    await knex("tasks").del()
    await knex("labels").del()
    await knex("projects").del()
    await knex("users").del()

    // 2. Insert Users
    await knex("users").insert([
        {
            id: 1,
            username: "alice_admin",
            email: "alice@example.com",
            password_hash: "$2b$10$FakeHashForAlice12345",
        },
        {
            id: 2,
            username: "bob_builder",
            email: "bob@example.com",
            password_hash: "$2b$10$FakeHashForBob67890",
        },
    ])

    // 3. Insert Projects
    await knex("projects").insert([
        { id: 1, name: "Website Redesign", owner_id: 1 },
        { id: 2, name: "Mobile App Launch", owner_id: 1 },
        { id: 3, name: "Internal Tools", owner_id: 2 },
    ])

    // 4. Insert Labels
    await knex("labels").insert([
        { id: 1, name: "Frontend", color: "#3b82f6" },
        { id: 2, name: "Backend", color: "#10b981" },
        { id: 3, name: "Bug", color: "#ef4444" },
        { id: 4, name: "Design", color: "#8b5cf6" },
        { id: 5, name: "Urgent", color: "#f59e0b" },
    ])

    // 5. Insert Tasks
    await knex("tasks").insert([
        {
            id: 1,
            name: "Create wireframes",
            description: "Draft the initial homepage layout in Figma.",
            status: "done",
            assigned_to_user_id: 1,
            project_id: 1,
        },
        {
            id: 2,
            name: "Setup React repo",
            description:
                "Initialize Vite + React project and install Tailwind.",
            status: "in_progress",
            assigned_to_user_id: 2,
            project_id: 1,
        },
        {
            id: 3,
            name: "Design system review",
            description: "Review the color palette with the marketing team.",
            status: "in_review",
            assigned_to_user_id: 1,
            project_id: 1,
        },
        {
            id: 4,
            name: "Implement Auth context",
            description: "Create the JWT authentication wrapper.",
            status: "to_do",
            assigned_to_user_id: 2,
            project_id: 1,
        },
        {
            id: 5,
            name: "Fix login crash",
            description: "App crashes on iOS 17 when hitting submit.",
            status: "blocked",
            assigned_to_user_id: 2,
            project_id: 2,
        },
        {
            id: 6,
            name: "App Store assets",
            description: "Generate screenshots for the app store listing.",
            status: "to_do",
            assigned_to_user_id: 1,
            project_id: 2,
        },
        {
            id: 7,
            name: "Database migration",
            description: "Move from SQLite to Postgres on Render.",
            status: "in_progress",
            assigned_to_user_id: 2,
            project_id: 3,
        },
    ])

    // 6. Insert Task Labels (The Many-to-Many Junction)
    await knex("task_labels").insert([
        { task_id: 2, label_id: 1 },
        { task_id: 4, label_id: 1 },
        { task_id: 4, label_id: 2 },
        { task_id: 5, label_id: 3 },
        { task_id: 5, label_id: 5 },
        { task_id: 7, label_id: 2 },
    ])
}
