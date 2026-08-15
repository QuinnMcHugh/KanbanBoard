import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useToast } from "../components/ui/useToast";
import { FullPageSpinner } from "../components/ui/FullPageSpinner";
import { AppHeader } from "../components/layout/AppHeader";
import { Board } from "../components/board/Board";
import { EmptyState } from "../components/board/EmptyState";
import { CreateProjectDialog } from "../components/modals/CreateProjectDialog";
import { DeleteProjectDialog } from "../components/modals/DeleteProjectDialog";
import { TaskDetailDialog } from "../components/modals/TaskDetailDialog";
import { LabelManagerDialog } from "../components/modals/LabelManagerDialog";
import { useProjects } from "../hooks/useProjects";
import { useTasks } from "../hooks/useTasks";
import { useLabels } from "../hooks/useLabels";
import { useUsers } from "../context/useUsers";
import type { TaskStatus } from "../types/task";
import "./BoardPage.css";

export function BoardPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user, clearSession } = useAuth();
    const { addToast } = useToast();

    const {
        projects,
        isLoading: projectsLoading,
        error: projectsError,
        createProject,
        deleteProject,
    } = useProjects();
    const {
        labels,
        isLoading: labelsLoading,
        error: labelsError,
        createLabel,
        deleteLabel,
    } = useLabels();
    const { users, isLoading: usersLoading, error: usersError } = useUsers();

    const [showCreateProject, setShowCreateProject] = useState(false);
    const [showDeleteProject, setShowDeleteProject] = useState(false);
    const [openTaskId, setOpenTaskId] = useState<number | null>(null);
    const [labelPickerTaskId, setLabelPickerTaskId] = useState<number | null>(
        null,
    );

    const currentProjectId = projectId ? Number(projectId) : null;
    const currentProject =
        projects.find((project) => project.id === currentProjectId) ?? null;

    const { tasks, setTasks, createTask, updateTask, deleteTask } =
        useTasks(currentProjectId);

    const openTask = tasks.find((task) => task.id === openTaskId) ?? null;
    const labelPickerTask =
        tasks.find((task) => task.id === labelPickerTaskId) ?? null;

    useEffect(() => {
        if (!projectsLoading && !projectId && projects.length > 0) {
            void navigate(`/projects/${projects[0].id}`, { replace: true });
        }
    }, [projectId, projects, projectsLoading, navigate]);

    useEffect(() => {
        const loadError = projectsError || labelsError || usersError;
        if (loadError) addToast("error", loadError);
    }, [projectsError, labelsError, usersError, addToast]);

    if (projectsLoading || labelsLoading || usersLoading) {
        return <FullPageSpinner />;
    }

    const handleCreateProject = async (name: string) => {
        if (!user) return;
        try {
            const project = await createProject(name, user.id);
            setShowCreateProject(false);
            void navigate(`/projects/${project.id}`);
        } catch {
            addToast("error", "Unable to create project.");
        }
    };

    const handleConfirmDeleteProject = async () => {
        if (!currentProject) return;
        try {
            await deleteProject(currentProject.id);
            setShowDeleteProject(false);
            addToast("success", "Project deleted.");
            const remaining = projects.filter(
                (project) => project.id !== currentProject.id,
            );
            void navigate(
                remaining[0] ? `/projects/${remaining[0].id}` : "/projects",
                { replace: true },
            );
        } catch {
            addToast("error", "Unable to delete project.");
        }
    };

    const handleAddTask = async (name: string) => {
        try {
            await createTask({
                name,
                description: "No description yet.",
                status: "to_do",
            });
        } catch {
            addToast("error", "Unable to create task.");
        }
    };

    const patchOpenTask = async (patch: Parameters<typeof updateTask>[1]) => {
        if (openTaskId === null) return;
        try {
            await updateTask(openTaskId, patch);
        } catch {
            addToast("error", "Unable to update task.");
        }
    };

    const handleRemoveLabelFromTask = async (
        taskId: number,
        labelId: number,
    ) => {
        const task = tasks.find((candidate) => candidate.id === taskId);
        if (!task) return;
        const labelIds = task.labels
            .filter((label) => label.id !== labelId)
            .map((label) => label.id);
        try {
            await updateTask(taskId, { labelIds });
        } catch {
            addToast("error", "Unable to remove label.");
        }
    };

    const handleDeleteOpenTask = async () => {
        if (openTaskId === null) return;
        try {
            await deleteTask(openTaskId);
            setOpenTaskId(null);
            addToast("success", "Task deleted.");
        } catch {
            addToast("error", "Unable to delete task.");
        }
    };

    const handleSaveTaskLabels = async (labelIds: number[]) => {
        if (labelPickerTaskId === null) return;
        try {
            await updateTask(labelPickerTaskId, { labelIds });
        } catch {
            addToast("error", "Unable to update labels.");
        }
    };

    const handleMoveTask = async (taskId: number, newStatus: TaskStatus) => {
        const task = tasks.find((candidate) => candidate.id === taskId);
        if (!task || task.status === newStatus) return;

        const previousTasks = tasks;
        setTasks((prev) =>
            prev.map((candidate) =>
                candidate.id === taskId
                    ? { ...candidate, status: newStatus }
                    : candidate,
            ),
        );

        try {
            await updateTask(taskId, { status: newStatus });
        } catch {
            setTasks(previousTasks);
            addToast("error", "Unable to move task.");
        }
    };

    const handleDeleteGlobalLabel = async (labelId: number) => {
        try {
            await deleteLabel(labelId);
            setTasks((prev) =>
                prev.map((task) => ({
                    ...task,
                    labels: task.labels.filter((label) => label.id !== labelId),
                })),
            );
        } catch {
            addToast("error", "Unable to delete label.");
        }
    };

    const handleCreateLabel = async (name: string, color: string) => {
        try {
            await createLabel(name, color);
        } catch {
            addToast("error", "Unable to create label.");
        }
    };

    const assigneeOptions = users.map((candidate) => ({
        id: candidate.id,
        name: candidate.username,
    }));

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
                    onRemoveLabel={(taskId, labelId) =>
                        void handleRemoveLabelFromTask(taskId, labelId)
                    }
                    onAddTask={(name) => void handleAddTask(name)}
                    onMoveTask={(taskId, status) =>
                        void handleMoveTask(taskId, status)
                    }
                />
            )}

            <CreateProjectDialog
                open={showCreateProject}
                onOpenChange={setShowCreateProject}
                onCreate={(name) => void handleCreateProject(name)}
            />

            {currentProject && (
                <DeleteProjectDialog
                    open={showDeleteProject}
                    onOpenChange={setShowDeleteProject}
                    projectName={currentProject.name}
                    onConfirm={() => void handleConfirmDeleteProject()}
                />
            )}

            <TaskDetailDialog
                key={openTask?.id ?? "closed"}
                task={openTask}
                assigneeOptions={assigneeOptions}
                onOpenChange={(open) => {
                    if (!open) setOpenTaskId(null);
                }}
                onSave={(patch) => void patchOpenTask(patch)}
                onOpenLabelPicker={() => {
                    if (openTaskId !== null) setLabelPickerTaskId(openTaskId);
                }}
                onRemoveLabel={(labelId) => {
                    if (openTaskId !== null)
                        void handleRemoveLabelFromTask(openTaskId, labelId);
                }}
                onDelete={() => void handleDeleteOpenTask()}
            />

            <LabelManagerDialog
                key={labelPickerTaskId ?? "closed"}
                open={labelPickerTaskId !== null}
                onOpenChange={(open) => {
                    if (!open) setLabelPickerTaskId(null);
                }}
                labels={labels}
                checkedLabelIds={
                    labelPickerTask?.labels.map((label) => label.id) ?? []
                }
                onSave={(labelIds) => void handleSaveTaskLabels(labelIds)}
                onDeleteLabel={(labelId) =>
                    void handleDeleteGlobalLabel(labelId)
                }
                onCreateLabel={(name, color) =>
                    void handleCreateLabel(name, color)
                }
            />
        </div>
    );
}
