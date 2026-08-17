import { z } from "zod"
import { labelSchema } from "./labelSchemas"

export const TASK_STATUSES = [
    "to_do",
    "in_progress",
    "done",
    "in_review",
    "blocked",
] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]

const labelIdsSchema = z
    .array(
        z.number().int().positive("Each labelId must be a positive integer."),
    )
    .meta({
        description:
            "ids of existing labels to attach. Must already exist — this endpoint never creates new labels.",
    })

export const createTaskSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, "Name is required.")
            .meta({ example: "Fix login crash" }),
        description: z.string().min(1, "Description is required."),
        status: z
            .enum(TASK_STATUSES, "Task status is invalid.")
            .meta({ example: "to_do" }),
        assigned_to_user_id: z
            .number()
            .int()
            .positive("assigned_to_user_id must be a positive integer.")
            .optional()
            .meta({
                description:
                    "id of the user this task is assigned to. Omit to leave unassigned.",
            }),
        labelIds: labelIdsSchema.optional(),
    })
    .meta({
        id: "CreateTaskRequest",
        description:
            "Body for creating a task. project_id comes from the URL, not the body.",
    })

export const updateTaskSchema = z
    .object({
        name: z.string().trim().min(1, "Name cannot be empty.").optional(),
        description: z
            .string()
            .min(1, "Description cannot be empty.")
            .optional(),
        status: z.enum(TASK_STATUSES, "Task status is invalid.").optional(),
        assigned_to_user_id: z
            .number()
            .int()
            .positive("assigned_to_user_id must be a positive integer.")
            .nullable()
            .optional()
            .meta({
                description:
                    "Set to null to unassign the task. Omit to leave it unchanged.",
            }),
        labelIds: labelIdsSchema.optional().meta({
            description:
                "Replaces the task's entire label set. Omit to leave labels untouched; send [] to clear them.",
        }),
        project_id: z
            .number()
            .int()
            .positive("project_id must be a positive integer.")
            .optional()
            .meta({
                description:
                    "Moves the task to a different project. Must be sent explicitly — the URL's :projectId is only used to locate the task, never to move it implicitly.",
            }),
    })
    .refine(
        (data) => Object.values(data).some((value) => value !== undefined),
        {
            message: "PATCH requires at least one valid property in JSON body.",
        },
    )
    .meta({
        id: "UpdateTaskRequest",
        description: "Partial update — at least one field is required.",
    })

export const projectIdParentParamSchema = z.object({
    projectId: z.coerce
        .number()
        .int()
        .positive("projectId must be a positive integer."),
})

export const taskIdParamSchema = z.object({
    projectId: z.coerce
        .number()
        .int()
        .positive("projectId must be a positive integer."),
    id: z.coerce.number().int().positive("id must be a positive integer."),
})

export const taskSchema = z
    .object({
        id: z.number().int(),
        name: z.string(),
        description: z.string(),
        status: z.enum(TASK_STATUSES),
        project_id: z.number().int(),
        assigned_to_user_id: z
            .number()
            .int()
            .nullable()
            .meta({ description: "null when the task is unassigned." }),
        created_at: z.string(),
        updated_at: z.string().meta({
            description:
                "Bumped on every PATCH, regardless of which fields changed.",
        }),
        labels: z.array(labelSchema),
    })
    .meta({
        id: "Task",
        description:
            "A task, with its attached labels resolved and parsed as a real array.",
    })

export const taskResponseSchema = z
    .object({ task: taskSchema })
    .meta({ id: "TaskResponse" })

export const taskListResponseSchema = z
    .object({ tasks: z.array(taskSchema) })
    .meta({ id: "TaskListResponse" })

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type Task = z.infer<typeof taskSchema>
