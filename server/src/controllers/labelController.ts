import type { Request, Response } from "express"
import db from "../db/db"
import type {
    CreateLabelInput,
    UpdateLabelInput,
} from "../schemas/labelSchemas"
import { NotFoundError } from "../errors"

export async function getLabels(req: Request, res: Response): Promise<void> {
    const labels = await db("labels").select("*")

    res.status(200).json({
        labels,
    })
}

export async function getLabel(
    req: Request<{ id: string }>,
    res: Response,
): Promise<void> {
    const id = Number(req.params.id)

    const label = await db("labels").where({ id }).first()

    if (!label) {
        throw new NotFoundError("Label not found.")
    }

    res.status(200).json({
        label,
    })
}

export async function createLabel(
    req: Request<Record<string, never>, unknown, CreateLabelInput>,
    res: Response,
): Promise<void> {
    const { name, color } = req.body

    const createdLabel = await db("labels")
        .insert({ name, color })
        .returning(["id", "name", "color"])

    res.status(201).json({
        label: createdLabel[0],
    })
}

export async function updateLabel(
    req: Request<{ id: string }, unknown, UpdateLabelInput>,
    res: Response,
): Promise<void> {
    const id = Number(req.params.id)
    const { name, color } = req.body

    const updatedLabel = await db("labels")
        .where({ id })
        .update({
            ...(name ? { name } : {}),
            ...(color ? { color } : {}),
        })
        .returning(["id", "name", "color"])

    if (!updatedLabel.length) {
        throw new NotFoundError("Label not found.")
    }

    res.status(200).json({
        label: updatedLabel[0],
    })
}

export async function deleteLabel(
    req: Request<{ id: string }>,
    res: Response,
): Promise<void> {
    const id = Number(req.params.id)

    const label = await db.transaction(async (trx) => {
        const found = await trx("labels").where({ id }).first()

        if (!found) {
            throw new NotFoundError("Could not find label matching id.")
        }

        await trx("labels").where({ id }).delete()

        return found
    })

    res.status(200).json({
        label,
    })
}
