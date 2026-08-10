import { z } from "zod";

export const TASK_STATUSES = ["to_do", "in_progress", "done", "in_review", "blocked"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

const labelIdsSchema = z.array(z.number().int().positive("Each labelId must be a positive integer."));

export const createTaskSchema = z.object({
    name: z.string().trim().min(1, "Name is required."),
    description: z.string().min(1, "Description is required."),
    status: z.enum(TASK_STATUSES, "Task status is invalid."),
    assigned_to_user_id: z.number().int().positive("assigned_to_user_id must be a positive integer.").optional(),
    labelIds: labelIdsSchema.optional(),
});

export const updateTaskSchema = z
    .object({
        name: z.string().trim().min(1, "Name cannot be empty.").optional(),
        description: z.string().min(1, "Description cannot be empty.").optional(),
        status: z.enum(TASK_STATUSES, "Task status is invalid.").optional(),
        assigned_to_user_id: z.number().int().positive("assigned_to_user_id must be a positive integer.").optional(),
        labelIds: labelIdsSchema.optional(),
        project_id: z.number().int().positive("project_id must be a positive integer.").optional(),
    })
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
        message: "PATCH requires at least one valid property in JSON body.",
    });

export const projectIdParentParamSchema = z.object({
    projectId: z.coerce.number().int().positive("projectId must be a positive integer."),
});

export const taskIdParamSchema = z.object({
    projectId: z.coerce.number().int().positive("projectId must be a positive integer."),
    id: z.coerce.number().int().positive("id must be a positive integer."),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
