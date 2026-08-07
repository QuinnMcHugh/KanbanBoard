import type { Knex } from "knex";

export type TaskStatus = "to_do" | "in_progress" | "done" | "in_review" | "blocked";

interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
}

interface Project {
    id: number;
    name: string;
    owner_id: number;
    created_at: string;
}

interface Label {
    id: number;
    name: string;
    color: string;
}

interface Task {
    id: number;
    name: string;
    description: string;
    status: TaskStatus;
    project_id: number;
    assigned_to_user_id: number | null;
    created_at: string;
    updated_at: string;
}

interface TaskLabel {
    task_id: number;
    label_id: number;
}

declare module "knex/types/tables" {
    interface Tables {
        // id is auto-generated, so it's optional (not required) on insert — SQLite still
        // allows explicitly setting it, which the seed file deliberately does for fixed,
        // known ids. created_at is also DB-generated (defaultTo(knex.fn.now())).
        users: Knex.CompositeTableType<
            User,
            Omit<User, "id"> & { id?: number },
            Partial<Omit<User, "id">>
        >;

        projects: Knex.CompositeTableType<
            Project,
            Omit<Project, "id" | "created_at"> & { id?: number },
            Partial<Omit<Project, "id" | "created_at">>
        >;

        labels: Knex.CompositeTableType<
            Label,
            Omit<Label, "id"> & { id?: number },
            Partial<Omit<Label, "id">>
        >;

        tasks: Knex.CompositeTableType<
            Task,
            Omit<Task, "id" | "created_at" | "updated_at" | "status"> & { id?: number; status?: TaskStatus },
            // updated_at is set via trx.fn.now() (a Knex.Raw), never a plain string, in practice.
            Partial<Omit<Task, "id" | "created_at" | "updated_at">> & { updated_at?: string | Knex.Raw }
        >;

        task_labels: Knex.CompositeTableType<
            TaskLabel,
            TaskLabel,
            Partial<TaskLabel>
        >;
    }
}
