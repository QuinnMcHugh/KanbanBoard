import type { Task } from "../../types/task"
import { Avatar } from "../ui/Avatar"
import { LabelBadge } from "../ui/LabelBadge"
import "./TaskCard.css"

interface TaskCardProps {
    task: Task
    assigneeName?: string
    onOpen: () => void
    onOpenLabelPicker: () => void
    onRemoveLabel: (labelId: number) => void
}

export function TaskCard({
    task,
    assigneeName = "Unassigned",
    onOpen,
    onOpenLabelPicker,
    onRemoveLabel,
}: TaskCardProps) {
    return (
        <div className="task-card">
            <button type="button" className="task-card__title" onClick={onOpen}>
                {task.name}
            </button>
            {task.description && (
                <div className="task-card__description">{task.description}</div>
            )}
            <div className="task-card__labels">
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
            <div className="task-card__assignee">
                <Avatar name={assigneeName} size="sm" />
                <span className="task-card__assignee-name">{assigneeName}</span>
            </div>
        </div>
    )
}
