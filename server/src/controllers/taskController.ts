import type { Request, Response } from "express";
import db from "../db/db";
import type { Knex } from "knex";

const TASK_STATUS = {
    TO_DO: 'to_do',
    DONE: 'done',
    IN_PROGRESS: 'in_progress',
    BLOCKED: 'blocked',
    IN_REVIEW: 'in_review',
};

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

async function getUserIdIssues(queryBuilder: Knex | Knex.Transaction = db, assigned_to_user_id: number) {
    // verify the incoming assigned_to_user_id exists (if assigned)
    if (assigned_to_user_id) {
        const user = await queryBuilder("users")
            .where({ id: assigned_to_user_id })
            .select('id')
            .first();
        if (!user) {
            return {
                success: false,
                message: 'The user for this task could not be found.',
                code: 404,
            };
        }
    }
    
    return null;
}

async function getLabelIdsIssues(queryBuilder: Knex | Knex.Transaction = db, labelIds: number[]) {
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

            return {
                success: false,
                message: `Labels with these id's not found: ${[...missingLabelsSet].join(', ')}`,
                code: 400,
            };
        }
    }

    return null;
}

async function createTaskLabelsRecords(queryBuilder: Knex | Knex.Transaction = db, labelIds: number[], newTaskId: number) {
    // lay down new entries in task_labels
    if (labelIds?.length) {
        const newTaskLabels = labelIds.map((label_id: number) => ({ task_id: newTaskId, label_id }));
        await queryBuilder("task_labels")
            .insert(newTaskLabels);
    }
}

async function rejectIfInvalidProjectId(req: Request, res: Response): Promise<boolean> {
    const project_id = Number(req.params.projectId);
    if (!project_id) {
        res.status(400).json({ error: 'Missing project id.' });
        return true;
    }

    const project = await db("projects")
        .where({ id: project_id })
        .select('id')
        .first();

    if (!project) {
        res.status(404).json({ error: 'Project ID was not found.' });
        return true;
    }

    return false;
}

export async function getTasks(req: Request, res: Response): Promise<void> {
    try {
        const project_id = Number(req.params.projectId);
        if (await rejectIfInvalidProjectId(req, res)) {
            return;
        }

        const tasks = await tasksWithLabels()
            .where('tasks.project_id', project_id);
        
        tasks.forEach(task => {
            task.labels = JSON.parse(task.labels);
        });

        res.status(200).json({
            tasks,
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Internal server error fetching tasks." });
    }
};

export async function getTask(req: Request, res: Response): Promise<void> {
    try {
        const taskId = Number(req.params.id);
        const projectId = Number(req.params.projectId);

        if (await rejectIfInvalidProjectId(req, res)) {
            return;
        }

        if (!taskId) {
            res.status(400).json({ error: 'No task id specified.' });
            return;
        }

        const task = await tasksWithLabels()
            .where({ 'tasks.id': taskId, 'tasks.project_id': projectId })
            .first();

        if (!task) {
            res.status(404).json({ error: 'Could not find task.' });
            return;
        }

        task.labels = JSON.parse(task.labels);

        res.status(200).json({
            task,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Internal server error fetching task." });
    } 
}

export async function createTask(req: Request, res: Response): Promise<void> {
    try {
        if (await rejectIfInvalidProjectId(req, res)) {
            return;
        }

        const projectId = Number(req.params.projectId);
        const { name, description, status, assigned_to_user_id, labelIds } = req.body;

        const invalidStatus = !status || 
            (
                status !== TASK_STATUS.BLOCKED &&
                status !== TASK_STATUS.DONE &&
                status !== TASK_STATUS.IN_PROGRESS && 
                status !== TASK_STATUS.IN_REVIEW && 
                status !== TASK_STATUS.TO_DO
            );

        if (!name) {
            res.status(400).json({ error: 'No task name provided.' });
            return;
        } else if (invalidStatus) {
            res.status(400).json({ error: 'Task status is invalid.' });
            return;
        }

        let result: {
            success: boolean,
            task?: Object,
            code?: number,
            message?: string,
        };

        result = await db.transaction(async (trx) => {
            const hasUserIdIssues = await getUserIdIssues(trx, assigned_to_user_id);
            if (hasUserIdIssues) {
                return hasUserIdIssues;
            }

            const hasLabelIdsIssues = await getLabelIdsIssues(trx, labelIds);
            if (hasLabelIdsIssues) {
                return hasLabelIdsIssues;
            }

            const initialTask = await trx("tasks")
                .insert({
                    name,
                    description,
                    status,
                    project_id: projectId,
                    assigned_to_user_id,
                }).returning(["id"]);
            const newTaskId = initialTask[0].id;

            await createTaskLabelsRecords(trx, labelIds, newTaskId);
            
            const task = await tasksWithLabels(trx)
                .where({ 'tasks.id': newTaskId })
                .first();
            
            task.labels = JSON.parse(task.labels);
            return {
                success: true,
                task,
            };
        });

        if (!result.success) {
            res.status(result.code!).json({ error: result.message });
            return;
        }

        res.status(201).json({
            task: result.task,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Internal server error creating task." });
    } 
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
    try {
        if (await rejectIfInvalidProjectId(req, res)) {
            return;
        }

        const projectId = Number(req.params.projectId);
        const taskId = Number(req.params.id);
        if (!taskId) {
            res.status(400).json({ error: 'id is required.' });
            return;
        }

        const task = await db.transaction(async (trx) => {
            const found = await tasksWithLabels(trx)
                .where({
                    'tasks.project_id': projectId,
                    'tasks.id': taskId,
                })
                .first();
            
            if (!found) {
                return null;
            }

            await trx("tasks").where({ id: taskId }).delete();

            return found;
        });
        
        if (!task) {
            res.status(404).json({ error: 'Could not find task matching id.' });
            return;
        }

        task.labels = JSON.parse(task.labels);

        res.status(200).json({
            task,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Internal server error deleting task." });
    }
}

export async function updateTask(req: Request, res: Response): Promise<void> {
    try {
        if (await rejectIfInvalidProjectId(req, res)) {
            return;
        }

        const projectId = Number(req.params.projectId);
        const taskId = Number(req.params.id);
        const { name, description, status, assigned_to_user_id, labelIds, project_id: projectIdBody } = req.body;

        const invalidStatus = status &&
            (
                status !== TASK_STATUS.BLOCKED &&
                status !== TASK_STATUS.DONE &&
                status !== TASK_STATUS.IN_PROGRESS && 
                status !== TASK_STATUS.IN_REVIEW && 
                status !== TASK_STATUS.TO_DO
            );
        const noBodyParamsProvided = !name && typeof description !== 'string' && !status && !assigned_to_user_id && !labelIds && !projectIdBody;

        if (!taskId) {
            res.status(400).json({ error: 'id is required.' });
            return;
        } else if (invalidStatus) {
            res.status(400).json({ error: 'Task status is invalid.' });
            return;
        } else if (noBodyParamsProvided) {
            res.status(400).json({ error: 'PATCH requires at least one valid property in JSON body.' });
            return;
        }

        let result: {
            success: boolean,
            task?: Object,
            code?: number,
            message?: string,
        };

        result = await db.transaction(async (trx) => {
            const hasUserIdIssues = await getUserIdIssues(trx, assigned_to_user_id);
            if (hasUserIdIssues) {
                return hasUserIdIssues;
            }

            const hasLabelIdsIssues = await getLabelIdsIssues(trx, labelIds);
            if (hasLabelIdsIssues) {
                return hasLabelIdsIssues;
            }

            const initialTask = await trx("tasks")
                .where({ id: taskId, project_id: projectId })
                .update({
                    ...(name ? { name } : {}),
                    ...(status ? { status } : {}),
                    ...(typeof description === 'string' ? { description } : {}),
                    ...(projectIdBody ? { project_id: projectIdBody } : {}),
                    ...(assigned_to_user_id ? { assigned_to_user_id } : {}),
                    updated_at: trx.fn.now(),
                }).returning(["id"]);

            if (!initialTask.length) {
                return {
                    success: false,
                    message: "Task not found.",
                    code: 404,
                };
            }
            const newTaskId = initialTask[0].id;

            if (labelIds) {
                // remove existing task_labels
                await trx("task_labels")
                    .where({ 'task_id': taskId })
                    .delete();

                await createTaskLabelsRecords(trx, labelIds, newTaskId);
            }
            
            const task = await tasksWithLabels(trx)
                .where({ 'tasks.id': newTaskId })
                .first();
            
            task.labels = JSON.parse(task.labels);
            return {
                success: true,
                task,
            };
        });
        
        if (!result.success) {
            res.status(result.code!).json({ error: result.message });
            return;
        }

        res.status(200).json({
            task: result.task,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Internal server error updating task." });
    }
}
