import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useToast } from "../components/ui/useToast";
import { AppHeader } from "../components/layout/AppHeader";
import { Board } from "../components/board/Board";
import { EmptyState } from "../components/board/EmptyState";
import { CreateProjectDialog } from "../components/modals/CreateProjectDialog";
import { DeleteProjectDialog } from "../components/modals/DeleteProjectDialog";
import { TaskDetailDialog } from "../components/modals/TaskDetailDialog";
import { LabelManagerDialog } from "../components/modals/LabelManagerDialog";
import type { Project } from "../types/project";
import type { Task } from "../types/task";
import type { Label } from "../types/label";
import {
    MOCK_LABELS,
    MOCK_PROJECTS,
    MOCK_TASKS_BY_PROJECT,
} from "./board/mockBoardData";
import "./BoardPage.css";

export function BoardPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user, clearSession } = useAuth();
    const { addToast } = useToast();

    // Placeholder local state — replace with real API calls (projects/tasks/labels)
    // once the client is wired up to the backend.
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
    const [tasksByProject, setTasksByProject] = useState<
        Record<number, Task[]>
    >(MOCK_TASKS_BY_PROJECT);
    const [labels, setLabels] = useState<Label[]>(MOCK_LABELS);

    const [showCreateProject, setShowCreateProject] = useState(false);
    const [showDeleteProject, setShowDeleteProject] = useState(false);
    const [openTaskId, setOpenTaskId] = useState<number | null>(null);
    const [labelPickerTaskId, setLabelPickerTaskId] = useState<number | null>(
        null,
    );

    const currentProjectId = projectId ? Number(projectId) : null;
    const currentProject =
        projects.find((project) => project.id === currentProjectId) ?? null;
    const tasks = currentProjectId
        ? (tasksByProject[currentProjectId] ?? [])
        : [];
    const openTask = tasks.find((task) => task.id === openTaskId) ?? null;
    const labelPickerTask =
        tasks.find((task) => task.id === labelPickerTaskId) ?? null;

    useEffect(() => {
        if (!projectId && projects.length > 0) {
            void navigate(`/projects/${projects[0].id}`, { replace: true });
        }
    }, [projectId, projects, navigate]);

    const updateCurrentProjectTasks = (updater: (tasks: Task[]) => Task[]) => {
        if (!currentProjectId) return;
        setTasksByProject((prev) => ({
            ...prev,
            [currentProjectId]: updater(prev[currentProjectId] ?? []),
        }));
    };

    const handleCreateProject = (name: string) => {
        const nextId =
            Math.max(0, ...projects.map((project) => project.id)) + 1;
        const newProject: Project = {
            id: nextId,
            name,
            created_at: new Date().toISOString(),
            owner: user?.username ?? "you",
            owner_email: user?.email ?? "",
        };
        setProjects((prev) => [...prev, newProject]);
        setTasksByProject((prev) => ({ ...prev, [nextId]: [] }));
        setShowCreateProject(false);
        void navigate(`/projects/${nextId}`);
    };

    const handleConfirmDeleteProject = () => {
        if (!currentProject) return;
        const remaining = projects.filter(
            (project) => project.id !== currentProject.id,
        );
        setProjects(remaining);
        setShowDeleteProject(false);
        addToast("success", "Project deleted.");
        void navigate(
            remaining[0] ? `/projects/${remaining[0].id}` : "/projects",
            { replace: true },
        );
    };

    const handleAddTask = (name: string) => {
        if (!currentProjectId) return;
        const allTasks = Object.values(tasksByProject).flat();
        const nextId = Math.max(0, ...allTasks.map((task) => task.id)) + 1;
        const now = new Date().toISOString();
        const newTask: Task = {
            id: nextId,
            name,
            description: "",
            status: "to_do",
            project_id: currentProjectId,
            assigned_to_user_id: null,
            created_at: now,
            updated_at: now,
            labels: [],
        };
        updateCurrentProjectTasks((current) => [...current, newTask]);
    };

    const patchOpenTask = (patch: Partial<Task>) => {
        if (openTaskId === null) return;
        updateCurrentProjectTasks((current) =>
            current.map((task) =>
                task.id === openTaskId
                    ? {
                          ...task,
                          ...patch,
                          updated_at: new Date().toISOString(),
                      }
                    : task,
            ),
        );
    };

    const handleRemoveLabelFromTask = (taskId: number, labelId: number) => {
        updateCurrentProjectTasks((current) =>
            current.map((task) =>
                task.id === taskId
                    ? {
                          ...task,
                          labels: task.labels.filter(
                              (label) => label.id !== labelId,
                          ),
                      }
                    : task,
            ),
        );
    };

    const handleDeleteOpenTask = () => {
        if (openTaskId === null) return;
        updateCurrentProjectTasks((current) =>
            current.filter((task) => task.id !== openTaskId),
        );
        setOpenTaskId(null);
        addToast("success", "Task deleted.");
    };

    const handleToggleLabelOnPickerTask = (labelId: number) => {
        if (labelPickerTaskId === null) return;
        updateCurrentProjectTasks((current) =>
            current.map((task) => {
                if (task.id !== labelPickerTaskId) return task;
                const alreadyHas = task.labels.some(
                    (label) => label.id === labelId,
                );
                if (alreadyHas) {
                    return {
                        ...task,
                        labels: task.labels.filter(
                            (label) => label.id !== labelId,
                        ),
                    };
                }
                const label = labels.find(
                    (candidate) => candidate.id === labelId,
                );
                return label
                    ? { ...task, labels: [...task.labels, label] }
                    : task;
            }),
        );
    };

    const handleDeleteGlobalLabel = (labelId: number) => {
        setLabels((prev) => prev.filter((label) => label.id !== labelId));
        setTasksByProject((prev) =>
            Object.fromEntries(
                Object.entries(prev).map(([id, projectTasks]) => [
                    id,
                    projectTasks.map((task) => ({
                        ...task,
                        labels: task.labels.filter(
                            (label) => label.id !== labelId,
                        ),
                    })),
                ]),
            ),
        );
    };

    const handleCreateLabel = (name: string, color: string) => {
        const nextId = Math.max(0, ...labels.map((label) => label.id)) + 1;
        setLabels((prev) => [...prev, { id: nextId, name, color }]);
    };

    const assigneeOptions = user ? [{ id: user.id, name: user.username }] : [];

    return (
        <div className="board-page">
            <AppHeader
                projects={projects}
                currentProject={currentProject}
                onSelectProject={(id) => void navigate(`/projects/${id}`)}
                onCreateProject={() => setShowCreateProject(true)}
                onDeleteProject={() => setShowDeleteProject(true)}
                user={user}
                onLogOut={() => {
                    clearSession();
                    void navigate("/login");
                }}
            />

            {projects.length === 0 ? (
                <EmptyState
                    onCreateProject={() => setShowCreateProject(true)}
                />
            ) : (
                <Board
                    tasks={tasks}
                    onOpenTask={setOpenTaskId}
                    onOpenLabelPicker={setLabelPickerTaskId}
                    onRemoveLabel={handleRemoveLabelFromTask}
                    onAddTask={handleAddTask}
                />
            )}

            <CreateProjectDialog
                open={showCreateProject}
                onOpenChange={setShowCreateProject}
                onCreate={handleCreateProject}
            />

            {currentProject && (
                <DeleteProjectDialog
                    open={showDeleteProject}
                    onOpenChange={setShowDeleteProject}
                    projectName={currentProject.name}
                    onConfirm={handleConfirmDeleteProject}
                />
            )}

            <TaskDetailDialog
                task={openTask}
                assigneeOptions={assigneeOptions}
                onOpenChange={(open) => {
                    if (!open) setOpenTaskId(null);
                }}
                onNameChange={(name) => patchOpenTask({ name })}
                onDescriptionChange={(description) =>
                    patchOpenTask({ description })
                }
                onAssigneeChange={(assigneeId) =>
                    patchOpenTask({ assigned_to_user_id: assigneeId })
                }
                onOpenLabelPicker={() => {
                    if (openTaskId !== null) setLabelPickerTaskId(openTaskId);
                }}
                onRemoveLabel={(labelId) => {
                    if (openTaskId !== null)
                        handleRemoveLabelFromTask(openTaskId, labelId);
                }}
                onDelete={handleDeleteOpenTask}
            />

            <LabelManagerDialog
                open={labelPickerTaskId !== null}
                onOpenChange={(open) => {
                    if (!open) setLabelPickerTaskId(null);
                }}
                labels={labels}
                checkedLabelIds={
                    labelPickerTask?.labels.map((label) => label.id) ?? []
                }
                onToggleLabel={handleToggleLabelOnPickerTask}
                onDeleteLabel={handleDeleteGlobalLabel}
                onCreateLabel={handleCreateLabel}
            />
        </div>
    );
}
