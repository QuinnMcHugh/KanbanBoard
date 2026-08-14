import { useState } from "react";
import { Dialog, Select } from "radix-ui";
import type { Task } from "../../types/task";
import { LabelBadge } from "../ui/LabelBadge";
import "./TaskDetailDialog.css";

const UNASSIGNED = "unassigned";

interface AssigneeOption {
    id: number;
    name: string;
}

export interface TaskDetailPatch {
    name?: string;
    description?: string;
    assigned_to_user_id?: number | null;
}

interface TaskDetailDialogProps {
    task: Task | null;
    assigneeOptions: AssigneeOption[];
    onOpenChange: (open: boolean) => void;
    onSave: (patch: TaskDetailPatch) => void;
    onOpenLabelPicker: () => void;
    onRemoveLabel: (labelId: number) => void;
    onDelete: () => void;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    });
}

export function TaskDetailDialog({
    task,
    assigneeOptions,
    onOpenChange,
    onSave,
    onOpenLabelPicker,
    onRemoveLabel,
    onDelete,
}: TaskDetailDialogProps) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [name, setName] = useState(task?.name ?? "");
    const [description, setDescription] = useState(task?.description ?? "");
    const [assigneeId, setAssigneeId] = useState<number | null>(
        task?.assigned_to_user_id ?? null,
    );

    const handleOpenChange = (next: boolean) => {
        if (!next && task) {
            const patch: TaskDetailPatch = {};
            if (name !== task.name) patch.name = name;
            if (description !== task.description)
                patch.description = description;
            if (assigneeId !== task.assigned_to_user_id) {
                patch.assigned_to_user_id = assigneeId;
            }
            if (Object.keys(patch).length > 0) onSave(patch);
        }
        onOpenChange(next);
        if (!next) setConfirmingDelete(false);
    };

    const handleDeleteClick = () => {
        if (!confirmingDelete) {
            setConfirmingDelete(true);
            return;
        }
        onDelete();
        setConfirmingDelete(false);
    };

    return (
        <Dialog.Root open={task !== null} onOpenChange={handleOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="modal-overlay" />
                <Dialog.Content className="modal-content task-detail-dialog">
                    {task && (
                        <>
                            <Dialog.Title asChild>
                                <input
                                    className="task-detail-dialog__title-input"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                />
                            </Dialog.Title>
                            <div className="task-detail-dialog__meta">
                                Created {formatDate(task.created_at)} · Updated{" "}
                                {formatDate(task.updated_at)}
                            </div>

                            <label
                                className="task-detail-dialog__field-label"
                                htmlFor="task-description"
                            >
                                Description
                            </label>
                            <textarea
                                id="task-description"
                                rows={4}
                                placeholder="Add a description…"
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                            />

                            <span className="task-detail-dialog__field-label">
                                Assignee
                            </span>
                            <Select.Root
                                value={
                                    assigneeId !== null
                                        ? assigneeId.toString()
                                        : UNASSIGNED
                                }
                                onValueChange={(value) =>
                                    setAssigneeId(
                                        value === UNASSIGNED
                                            ? null
                                            : Number(value),
                                    )
                                }
                            >
                                <Select.Trigger className="task-detail-dialog__select-trigger">
                                    <Select.Value />
                                    <Select.Icon>▾</Select.Icon>
                                </Select.Trigger>
                                <Select.Portal>
                                    <Select.Content
                                        className="task-detail-dialog__select-content"
                                        position="popper"
                                        sideOffset={4}
                                    >
                                        <Select.Viewport>
                                            <Select.Item
                                                value={UNASSIGNED}
                                                className="task-detail-dialog__select-item"
                                            >
                                                <Select.ItemText>
                                                    Unassigned
                                                </Select.ItemText>
                                            </Select.Item>
                                            {assigneeOptions.map((option) => (
                                                <Select.Item
                                                    key={option.id}
                                                    value={option.id.toString()}
                                                    className="task-detail-dialog__select-item"
                                                >
                                                    <Select.ItemText>
                                                        {option.name}
                                                    </Select.ItemText>
                                                </Select.Item>
                                            ))}
                                        </Select.Viewport>
                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>

                            <span className="task-detail-dialog__field-label">
                                Labels
                            </span>
                            <div className="task-detail-dialog__labels">
                                {task.labels.map((label) => (
                                    <LabelBadge
                                        key={label.id}
                                        label={label}
                                        onRemove={() => onRemoveLabel(label.id)}
                                    />
                                ))}
                                <button
                                    type="button"
                                    className="task-card__add-label"
                                    onClick={onOpenLabelPicker}
                                >
                                    + Add label
                                </button>
                            </div>

                            <div className="task-detail-dialog__footer">
                                <button
                                    type="button"
                                    className={
                                        confirmingDelete
                                            ? "btn btn-danger"
                                            : "btn btn-ghost"
                                    }
                                    onClick={handleDeleteClick}
                                >
                                    {confirmingDelete
                                        ? "Confirm delete?"
                                        : "Delete Task"}
                                </button>
                                <Dialog.Close asChild>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                    >
                                        Done
                                    </button>
                                </Dialog.Close>
                            </div>
                        </>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
