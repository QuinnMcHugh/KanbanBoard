import type { Request, Response } from "express";
import db from "../db/db";

export async function getLabels(req: Request, res: Response): Promise<void> {
    const labels = await db("labels").select('*');

    res.status(200).json({
        labels,
    });
}

export async function getLabel(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (!id) {
        res.status(400).json({ error: 'id is required.' });
        return;
    }

    const label = await db("labels").where({ id }).first();

    if (!label) {
        res.status(404).json({ error: 'Label not found.' });
        return;
    }

    res.status(200).json({
        label,
    });
}

export async function createLabel(req: Request, res: Response): Promise<void> {
    const { name, color } = req.body;

    if (!name || !color) {
        res.status(400).json({ error: "Name and color are required." });
        return;
    }

    const createdLabel = await db("labels")
        .insert({ name, color })
        .returning(["id", "name", "color"]);

    res.status(201).json({
        label: createdLabel[0],
    });
}

export async function updateLabel(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const { name, color } = req.body;

    if (!id || (!name && !color)) {
        res.status(400).json({ error: 'id is required. At least one additional `label` property is also required.' });
        return;
    }

    const updatedLabel = await db("labels")
        .where({ id })
        .update({
            ...(name ? { name } : {}),
            ...(color ? { color } : {}),
        })
        .returning(["id", "name", "color"]);

    if (!updatedLabel.length) {
        res.status(404).json({ error: 'Label not found.' });
        return;
    }

    res.status(200).json({
        label: updatedLabel[0],
    });
}

export async function deleteLabel(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (!id) {
        res.status(400).json({ error: 'id is required.' });
        return;
    }

    const label = await db.transaction(async (trx) => {
        const found = await trx("labels").where({ id }).first();

        if (!found) {
            return null;
        }

        await trx("labels").where({ id }).delete();

        return found;
    });

    if (!label) {
        res.status(404).json({ error: 'Could not find label matching id.' });
        return;
    }

    res.status(200).json({
        label,
    });
}
