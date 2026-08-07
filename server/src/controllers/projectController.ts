import type { Request, Response } from "express";
import db from "../db/db";
import type { Knex } from "knex";

function projectsJoinedWithUsers(queryBuilder: Knex | Knex.Transaction = db) {
    return queryBuilder("projects")
        .select(
            'email as owner_email',
            'username as owner',
            'projects.id',
            'name',
            'created_at'
        ).leftJoin('users', 'projects.owner_id', 'users.id');
}

export async function getProjects(req: Request, res: Response): Promise<void> {
    const projects = await projectsJoinedWithUsers();

    res.status(200).json({
        projects,
    });
};

export async function getProject(req: Request, res: Response): Promise<void> {
    const project = await projectsJoinedWithUsers()
        .where('projects.id', Number(req.params.id))
        .first();

    if (!project) {
        res.status(404).json({
            error: "Project not found.",
        });
        return;
    }

    res.status(200).json({
        project,
    });
};

export async function createProject(req: Request, res: Response): Promise<void> {
    const { name, owner_id } = req.body;

    if (!name || !owner_id) {
        res.status(400).json({ error: "Name and owner_id are required." });
        return;
    }

    const createdProject = await db("projects")
        .insert({
            name,
            owner_id,
        }).returning(["id"]);

    const project = await projectsJoinedWithUsers()
        .where('projects.id', createdProject[0]!.id)
        .first();

    res.status(201).json({
        project,
    });
}

export async function updateProject(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const { name, owner_id } = req.body;

    if (!id || (!name && !owner_id)) {
        res.status(400).json({ error: 'id is required. At least one additional `project` property is also required.' });
        return;
    }

    const updatedProject = await db("projects")
        .where({ id })
        .update({
            ...(name ? { name } : {}),
            ...(owner_id ? { owner_id } : {}),
        }).returning('id');

    if (!updatedProject.length) {
        res.status(404).json({
            error: "Project not found.",
        });
        return;
    }

    const project = await projectsJoinedWithUsers()
        .where('projects.id', updatedProject[0]!.id)
        .first();

    res.status(200).json({
        project,
    });
}

export async function deleteProject(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (!id) {
        res.status(400).json({ error: 'id is required.' });
        return;
    }

    const project = await db.transaction(async (trx) => {
        const found = await projectsJoinedWithUsers(trx)
            .where('projects.id', id)
            .first();

        if (!found) {
            return null;
        }

        await trx("projects").where({ id }).delete();

        return found;
    });

    if (!project) {
        res.status(404).json({ error: 'Could not find project matching id.' });
        return;
    }

    res.status(200).json({
        project,
    });
}
