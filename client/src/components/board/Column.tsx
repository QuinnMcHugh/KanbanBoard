import { useState, type FormEvent } from "react"
import { useDroppable } from "@dnd-kit/core"
import type { Task } from "../../types/task"
import type { ColumnDef } from "./columnDefs"
import { DraggableTaskCard } from "./DraggableTaskCard"
import "./Column.css"

interface ColumnProps {
    def: ColumnDef
    tasks: Task[]
    isDragActive: boolean
    usersById: Record<number, string>
    onOpenTask: (taskId: number) => void
    onOpenLabelPicker: (taskId: number) => void
    onRemoveLabel: (taskId: number, labelId: number) => void
    onAddTask?: (name: string) => void
}

export function Column({
    def,
    tasks,
    isDragActive,
    usersById,
    onOpenTask,
    onOpenLabelPicker,
    onRemoveLabel,
    onAddTask,
}: ColumnProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [newTaskName, setNewTaskName] = useState("")

    const { setNodeRef, isOver } = useDroppable({ id: def.status })

    const cancelAdding = () => {
        setIsAdding(false)
        setNewTaskName("")
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        const name = newTaskName.trim()
        if (!name) {
            cancelAdding()
            return
        }
        onAddTask?.(name)
        cancelAdding()
    }

    const columnClassName = [
        "column",
        isDragActive && "column--drag-active",
        isOver && "column--drop-over",
    ]
        .filter(Boolean)
        .join(" ")

    return (
        <div ref={setNodeRef} className={columnClassName}>
            <div className="column__header">
                <span
                    className="column__dot"
                    style={{ background: def.accentColor }}
                />
                <span className="column__label">{def.label}</span>
                <span className="column__count">{tasks.length}</span>
            </div>

            {onAddTask && isAdding && (
                <form className="column__add-task-form" onSubmit={handleSubmit}>
                    <input
                        // This input only renders after the user clicks "+ Add
                        // Task", so moving focus into it is the expected/accessible
                        // response to that action, not a page-load autofocus.
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus
                        placeholder="Task title…"
                        value={newTaskName}
                        onChange={(event) => setNewTaskName(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Escape") cancelAdding()
                        }}
                    />
                    <div className="column__add-task-actions">
                        <button type="submit" className="btn btn-primary">
                            Add
                        </button>
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={cancelAdding}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="column__tasks">
                {tasks.map((task) => (
                    <DraggableTaskCard
                        key={task.id}
                        task={task}
                        assigneeName={
                            task.assigned_to_user_id !== null
                                ? usersById[task.assigned_to_user_id]
                                : undefined
                        }
                        onOpen={() => onOpenTask(task.id)}
                        onOpenLabelPicker={() => onOpenLabelPicker(task.id)}
                        onRemoveLabel={(labelId) =>
                            onRemoveLabel(task.id, labelId)
                        }
                    />
                ))}
            </div>

            {onAddTask && !isAdding && (
                <button
                    type="button"
                    className="btn btn-dashed column__add-task-btn"
                    onClick={() => setIsAdding(true)}
                >
                    + Add Task
                </button>
            )}
        </div>
    )
}
