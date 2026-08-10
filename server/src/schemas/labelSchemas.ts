import { z } from "zod";

export const createLabelSchema = z
    .object({
        name: z.string().trim().min(1, "Name is required.").max(24, "Name max length exceeded."),
        color: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Color must be a hex code like #ff0000."),
    });

export const updateLabelSchema = z
    .object({
        name: z.string().trim().min(1, "Name is required.").max(24, "Name max length exceeded.").optional(),
        color: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Color must be a hex code like #ff0000.").optional(),
    })
    .refine((data) => Boolean(data.name) || Boolean(data.color), {
        message: "At least one of `name` or `color` is required.",
    });

export const labelIdParamSchema = z.object({
    id: z.coerce.number().int().positive("id must be a positive integer."),
});

export type CreateLabelInput = z.infer<typeof createLabelSchema>;
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>;
