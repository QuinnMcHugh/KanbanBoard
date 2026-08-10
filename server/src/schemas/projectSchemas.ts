import { z } from "zod";

export const createProjectSchema = z.object({
    name: z.string().trim().min(1, "Name is required."),
    owner_id: z.number().int().positive("owner_id must be a positive integer."),
});

export const updateProjectSchema = z
    .object({
        name: z.string().trim().min(1, "Name cannot be empty.").optional(),
        owner_id: z.number().int().positive("owner_id must be a positive integer.").optional(),
    })
    .refine((data) => data.name !== undefined || data.owner_id !== undefined, {
        message: "At least one of `name` or `owner_id` is required.",
    });

export const projectIdParamSchema = z.object({
    id: z.coerce.number().int().positive("id must be a positive integer."),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
