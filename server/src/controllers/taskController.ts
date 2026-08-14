import type { Request, Response } from "express";
import db from "../db/db";
import type { Knex } from "knex";
import type { CreateTaskInput, UpdateTaskInput } from "../schemas/taskSchemas";
import { BadRequestError, NotFoundError } from "../errors";

function tasksWithLabels(queryBuilder: Knex | Knex.Transaction = db) {
    return queryBuilder("tasks")
        .select(
            "tasks.*",
            db.raw(`(
                SELECT COALESCE(json_group_array(json_object('id', labels.id, 'name', labels.name, 'color', labels.color)), '[]')
                FROM task_labels
                JOIN labels ON task_labels.label_id = labels.id
                WHERE task_labels.task_id = tasks.id
                ) as labels`
            )
        );
}

async function assertUserIdExists(queryBuilder: Knex | Knex.Transaction = db, assigned_to_user_id: number | null | undefined): Promise<void> {
    // verify the incoming assigned_to_user_id exists (if assigned)
    if (assigned_to_user_id) {
        const user = await queryBuilder("users")
            .where({ id: assigned_to_user_id })
            .select('id')
            .first();
        if (!user) {
            throw new NotFoundError('The user for this task could not be found.');
        }
    }
}

async function assertLabelIdsExist(queryBuilder: Knex | Knex.Transaction = db, labelIds: number[] | undefined): Promise<void> {
    // verify the incoming label id's exist
    if (labelIds?.length) {
        const labels = await queryBuilder('labels')
            .whereIn('id', labelIds)
            .select('id');

        if (labels.length !== labelIds.length) {
            const existingLabelsSet = new Set<number>(labels.map(({ id }) => id));
            const missingLabelsSet = new Set<number>();

            labelIds.forEach((labelId: number) => {
                if (!existingLabelsSet.has(labelId)) {
                    missingLabelsSet.add(labelId);
                }
            });

            throw new BadRequestError(`Labels with these id's not found: ${[...missingLabelsSet].join(', ')}`);
        }
    }
}

async function createTaskLabelsRecords(queryBuilder: Knex | Knex.Transaction = db, labelIds: number[] | undefined, newTaskId: number) {
    // lay down new entries in task_labels
    if (labelIds?.length) {
        const newTaskLabels = labelIds.map((label_id: number) => ({ task_id: newTaskId, label_id }));
        await queryBuilder("task_labels")
            .insert(newTaskLabels);
    }
}

async function assertProjectExists(req: Request): Promise<void> {
    const project_id = Number(req.params.projectId);

    const project = await db("projects")
        .where({ id: project_id })
        .select('id')
        .first();

    if (!project) {
        throw new NotFoundError('Project ID was not found.');
    }
}

export async function getTasks(req: Request<{ projectId: string }>, res: Response): Promise<void> {
    await assertProjectExists(req);
    const project_id = Number(req.params.projectId);

    const tasks = await tasksWithLabels()
        .where('tasks.project_id', project_id);

    tasks.forEach(task => {
        task.labels = JSON.parse(task.labels);
    });

    res.status(200).json({
        tasks,
    });
};

export async function getTask(req: Request<{ id: string; projectId: string }>, res: Response): Promise<void> {
    const taskId = Number(req.params.id);
    const projectId = Number(req.params.projectId);

    await assertProjectExists(req);

    const task = await tasksWithLabels()
        .where('tasks.id', taskId)
        .andWhere('tasks.project_id', projectId)
        .first();

    if (!task) {
        throw new NotFoundError('Could not find task.');
    }

    task.labels = JSON.parse(task.labels);

    res.status(200).json({
        task,
    });
}

export async function createTask(req: Request<{ projectId: string }, any, CreateTaskInput>, res: Response): Promise<void> {
    await assertProjectExists(req);

    const projectId = Number(req.params.projectId);
    const { name, description, status, assigned_to_user_id, labelIds } = req.body;

    const task = await db.transaction(async (trx) => {
        await assertUserIdExists(trx, assigned_to_user_id);
        await assertLabelIdsExist(trx, labelIds);

        const initialTask = await trx("tasks")
            .insert({
                name,
                description,
                status,
                project_id: projectId,
                assigned_to_user_id,
            }).returning(["id"]);
        const newTaskId = initialTask[0]!.id;

        await createTaskLabelsRecords(trx, labelIds, newTaskId);

        const result = await tasksWithLabels(trx)
            .where('tasks.id', newTaskId)
            .first();

        result.labels = JSON.parse(result.labels);
        return result;
    });

    res.status(201).json({
        task,
    });
}

export async function deleteTask(req: Request<{ id: string; projectId: string }>, res: Response): Promise<void> {
    await assertProjectExists(req);

    const projectId = Number(req.params.projectId);
    const taskId = Number(req.params.id);

    const task = await db.transaction(async (trx) => {
        const found = await tasksWithLabels(trx)
            .where('tasks.project_id', projectId)
            .andWhere('tasks.id', taskId)
            .first();

        if (!found) {
            throw new NotFoundError('Could not find task matching id.');
        }

        await trx("tasks").where({ id: taskId }).delete();

        return found;
    });

    task.labels = JSON.parse(task.labels);

    res.status(200).json({
        task,
    });
}

export async function updateTask(req: Request<{ id: string; projectId: string }, any, UpdateTaskInput>, res: Response): Promise<void> {
    await assertProjectExists(req);

    const projectId = Number(req.params.projectId);
    const taskId = Number(req.params.id);
    const { name, description, status, assigned_to_user_id, labelIds, project_id: projectIdBody } = req.body;

    const task = await db.transaction(async (trx) => {
        await assertUserIdExists(trx, assigned_to_user_id);
        await assertLabelIdsExist(trx, labelIds);

        const initialTask = await trx("tasks")
            .where({ id: taskId, project_id: projectId })
            .update({
                ...(name ? { name } : {}),
                ...(status ? { status } : {}),
                ...(typeof description === 'string' ? { description } : {}),
                ...(projectIdBody ? { project_id: projectIdBody } : {}),
                ...(assigned_to_user_id !== undefined ? { assigned_to_user_id } : {}),
                updated_at: trx.fn.now(),
            }).returning(["id"]);

        if (!initialTask.length) {
            throw new NotFoundError("Task not found.");
        }
        const newTaskId = initialTask[0]!.id;

        if (labelIds) {
            // remove existing task_labels
            await trx("task_labels")
                .where({ 'task_id': taskId })
                .delete();

            await createTaskLabelsRecords(trx, labelIds, newTaskId);
        }

        const result = await tasksWithLabels(trx)
            .where('tasks.id', newTaskId)
            .first();

        result.labels = JSON.parse(result.labels);
        return result;
    });

    res.status(200).json({
        task,
    });
}
