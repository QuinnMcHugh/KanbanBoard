import type { Request, Response } from "express"
import db from "../db/db"
import type { Knex } from "knex"
import type {
    CreateProjectInput,
    ProjectRow,
    UpdateProjectInput,
} from "../schemas/projectSchemas"
import { NotFoundError } from "../errors"

function projectsJoinedWithUsers(queryBuilder: Knex | Knex.Transaction = db) {
    return (
        queryBuilder("projects")
            // Aliased columns ("x as y") aren't inferrable from the Tables type, so the result
            // shape is given explicitly — it matches projectSchema exactly (see projectSchemas.ts).
            .select<ProjectRow[]>(
                "email as owner_email",
                "username as owner",
                "projects.id",
                "name",
                "created_at",
            )
            .leftJoin("users", "projects.owner_id", "users.id")
    )
}

export async function getProjects(req: Request, res: Response): Promise<void> {
    const projects = await projectsJoinedWithUsers()

    res.status(200).json({
        projects,
    })
}

export async function getProject(
    req: Request<{ id: string }>,
    res: Response,
): Promise<void> {
    const project = await projectsJoinedWithUsers()
        .where("projects.id", Number(req.params.id))
        .first()

    if (!project) {
        throw new NotFoundError("Project not found.")
    }

    res.status(200).json({
        project,
    })
}

export async function createProject(
    req: Request<Record<string, never>, unknown, CreateProjectInput>,
    res: Response,
): Promise<void> {
    const { name, owner_id } = req.body

    const createdProject = await db("projects")
        .insert({
            name,
            owner_id,
        })
        .returning(["id"])

    const project = await projectsJoinedWithUsers()
        .where("projects.id", createdProject[0]!.id)
        .first()

    res.status(201).json({
        project,
    })
}

export async function updateProject(
    req: Request<{ id: string }, unknown, UpdateProjectInput>,
    res: Response,
): Promise<void> {
    const id = Number(req.params.id)
    const { name, owner_id } = req.body

    const updatedProject = await db("projects")
        .where({ id })
        .update({
            ...(name ? { name } : {}),
            ...(owner_id ? { owner_id } : {}),
        })
        .returning("id")

    if (!updatedProject.length) {
        throw new NotFoundError("Project not found.")
    }

    const project = await projectsJoinedWithUsers()
        .where("projects.id", updatedProject[0]!.id)
        .first()

    res.status(200).json({
        project,
    })
}

export async function deleteProject(
    req: Request<{ id: string }>,
    res: Response,
): Promise<void> {
    const id = Number(req.params.id)

    const project = await db.transaction(async (trx) => {
        const found = await projectsJoinedWithUsers(trx)
            .where("projects.id", id)
            .first()

        if (!found) {
            throw new NotFoundError("Could not find project matching id.")
        }

        await trx("projects").where({ id }).delete()

        return found
    })

    res.status(200).json({
        project,
    })
}
