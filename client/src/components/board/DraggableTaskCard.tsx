import { useDraggable } from "@dnd-kit/core"
import type { Task } from "../../types/task"
import { TaskCard } from "./TaskCard"
import "./DraggableTaskCard.css"

interface DraggableTaskCardProps {
    task: Task
    assigneeName?: string
    onOpen: () => void
    onOpenLabelPicker: () => void
    onRemoveLabel: (labelId: number) => void
}

export function DraggableTaskCard({ task, ...rest }: DraggableTaskCardProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: task.id,
    })

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={
                isDragging
                    ? "draggable-task-card draggable-task-card--dragging"
                    : "draggable-task-card"
            }
        >
            <TaskCard task={task} {...rest} />
        </div>
    )
}
