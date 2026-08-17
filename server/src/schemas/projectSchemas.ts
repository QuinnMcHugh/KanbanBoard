import { z } from "zod"

export const createProjectSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, "Name is required.")
            .meta({ example: "Website Redesign" }),
        owner_id: z
            .number()
            .int()
            .positive("owner_id must be a positive integer.")
            .meta({
                description:
                    "id of the user who is the project's current point person.",
            }),
    })
    .meta({
        id: "CreateProjectRequest",
        description: "Body for creating a project.",
    })

export const updateProjectSchema = z
    .object({
        name: z.string().trim().min(1, "Name cannot be empty.").optional(),
        owner_id: z
            .number()
            .int()
            .positive("owner_id must be a positive integer.")
            .optional()
            .meta({
                description:
                    "Reassigns the project's point person. Any authenticated user may reassign any project.",
            }),
    })
    .refine((data) => data.name !== undefined || data.owner_id !== undefined, {
        message: "At least one of `name` or `owner_id` is required.",
    })
    .meta({
        id: "UpdateProjectRequest",
        description: "Partial update — at least one field is required.",
    })

export const projectIdParamSchema = z.object({
    id: z.coerce.number().int().positive("id must be a positive integer."),
})

export const projectSchema = z
    .object({
        id: z.number().int(),
        name: z.string(),
        created_at: z.string().meta({
            description: "ISO-ish timestamp string, as stored by SQLite.",
        }),
        owner: z
            .string()
            .meta({ description: "The current owner's username." }),
        owner_email: z.string(),
    })
    .meta({
        id: "Project",
        description: "A project, with its owner's info joined in.",
    })

export const projectResponseSchema = z
    .object({ project: projectSchema })
    .meta({ id: "ProjectResponse" })

export const projectListResponseSchema = z
    .object({ projects: z.array(projectSchema) })
    .meta({ id: "ProjectListResponse" })

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type ProjectRow = z.infer<typeof projectSchema>
