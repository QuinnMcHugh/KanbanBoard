import { useEffect, useState } from "react";
import {
    createTask as createTaskRequest,
    deleteTask as deleteTaskRequest,
    getTasks,
    updateTask as updateTaskRequest,
    type CreateTaskBody,
    type UpdateTaskBody,
} from "../api/tasks";
import type { Task } from "../types/task";

export function useTasks(projectId: number | null) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            if (projectId === null) {
                setTasks([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const result = await getTasks(projectId);
                setTasks(result.tasks);
            } catch {
                setError("Unable to load tasks.");
            } finally {
                setIsLoading(false);
            }
        };

        void load();
    }, [projectId]);

    const createTask = async (body: CreateTaskBody) => {
        if (projectId === null) return null;
        const result = await createTaskRequest(projectId, body);
        setTasks((prev) => [...prev, result.task]);
        return result.task;
    };

    const updateTask = async (taskId: number, patch: UpdateTaskBody) => {
        if (projectId === null) return null;
        const result = await updateTaskRequest(projectId, taskId, patch);
        setTasks((prev) =>
            prev.map((task) => (task.id === taskId ? result.task : task)),
        );
        return result.task;
    };

    const deleteTask = async (taskId: number) => {
        if (projectId === null) return;
        await deleteTaskRequest(projectId, taskId);
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
    };

    return {
        tasks,
        setTasks,
        isLoading,
        error,
        createTask,
        updateTask,
        deleteTask,
    };
}
