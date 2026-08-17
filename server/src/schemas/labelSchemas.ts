import { z } from "zod"

export const createLabelSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, "Name is required.")
            .max(24, "Name max length exceeded.")
            .meta({
                description: "Must be unique across all labels.",
                example: "Frontend",
            }),
        color: z
            .string()
            .trim()
            .regex(
                /^#[0-9a-fA-F]{6}$/,
                "Color must be a hex code like #ff0000.",
            )
            .meta({
                description: "6-digit hex color code.",
                example: "#3b82f6",
            }),
    })
    .meta({
        id: "CreateLabelRequest",
        description: "Body for creating a label.",
    })

export const updateLabelSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, "Name is required.")
            .max(24, "Name max length exceeded.")
            .optional(),
        color: z
            .string()
            .trim()
            .regex(
                /^#[0-9a-fA-F]{6}$/,
                "Color must be a hex code like #ff0000.",
            )
            .optional(),
    })
    .refine((data) => Boolean(data.name) || Boolean(data.color), {
        message: "At least one of `name` or `color` is required.",
    })
    .meta({
        id: "UpdateLabelRequest",
        description: "Partial update — at least one field is required.",
    })

export const labelIdParamSchema = z.object({
    id: z.coerce.number().int().positive("id must be a positive integer."),
})

export const labelSchema = z
    .object({
        id: z.number().int(),
        name: z.string(),
        color: z.string(),
    })
    .meta({
        id: "Label",
        description: "A global label, attachable to any task.",
    })

export const labelResponseSchema = z
    .object({ label: labelSchema })
    .meta({ id: "LabelResponse" })

export const labelListResponseSchema = z
    .object({ labels: z.array(labelSchema) })
    .meta({ id: "LabelListResponse" })

export type CreateLabelInput = z.infer<typeof createLabelSchema>
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>
export type Label = z.infer<typeof labelSchema>
