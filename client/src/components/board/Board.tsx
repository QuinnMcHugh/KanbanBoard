import { useState } from "react"
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    pointerWithin,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core"
import type { Task, TaskStatus } from "../../types/task"
import { useUsers } from "../../context/useUsers"
import { COLUMN_DEFS } from "./columnDefs"
import { Column } from "./Column"
import { TaskCard } from "./TaskCard"
import "./Board.css"

interface BoardProps {
    tasks: Task[]
    onOpenTask: (taskId: number) => void
    onOpenLabelPicker: (taskId: number) => void
    onRemoveLabel: (taskId: number, labelId: number) => void
    onAddTask: (name: string) => void
    onMoveTask: (taskId: number, newStatus: TaskStatus) => void
}

export function Board({
    tasks,
    onOpenTask,
    onOpenLabelPicker,
    onRemoveLabel,
    onAddTask,
    onMoveTask,
}: BoardProps) {
    const { usersById } = useUsers()
    const [activeTask, setActiveTask] = useState<Task | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 4 },
        }),
    )

    const handleDragStart = (event: DragStartEvent) => {
        const task =
            tasks.find((candidate) => candidate.id === event.active.id) ?? null
        setActiveTask(task)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveTask(null)
        if (!over) return
        onMoveTask(Number(active.id), over.id as TaskStatus)
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveTask(null)}
        >
            <div className="board">
                <div className="board__columns">
                    {COLUMN_DEFS.map((def) => (
                        <Column
                            key={def.status}
                            def={def}
                            tasks={tasks.filter(
                                (task) => task.status === def.status,
                            )}
                            isDragActive={activeTask !== null}
                            usersById={usersById}
                            onOpenTask={onOpenTask}
                            onOpenLabelPicker={onOpenLabelPicker}
                            onRemoveLabel={onRemoveLabel}
                            onAddTask={
                                def.status === "to_do" ? onAddTask : undefined
                            }
                        />
                    ))}
                </div>
            </div>
            <DragOverlay>
                {activeTask && (
                    <div className="task-card-overlay">
                        <TaskCard
                            task={activeTask}
                            assigneeName={
                                activeTask.assigned_to_user_id !== null
                                    ? usersById[activeTask.assigned_to_user_id]
                                    : undefined
                            }
                            onOpen={() => {}}
                            onOpenLabelPicker={() => {}}
                            onRemoveLabel={() => {}}
                        />
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    )
}
