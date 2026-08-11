import { useState, type FormEvent } from "react";
import type { Task } from "../../types/task";
import type { ColumnDef } from "./columnDefs";
import { TaskCard } from "./TaskCard";
import "./Column.css";

interface ColumnProps {
    def: ColumnDef;
    tasks: Task[];
    onOpenTask: (taskId: number) => void;
    onOpenLabelPicker: (taskId: number) => void;
    onRemoveLabel: (taskId: number, labelId: number) => void;
    onAddTask?: (name: string) => void;
}

export function Column({
    def,
    tasks,
    onOpenTask,
    onOpenLabelPicker,
    onRemoveLabel,
    onAddTask,
}: ColumnProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskName, setNewTaskName] = useState("");

    const cancelAdding = () => {
        setIsAdding(false);
        setNewTaskName("");
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const name = newTaskName.trim();
        if (!name) {
            cancelAdding();
            return;
        }
        onAddTask?.(name);
        cancelAdding();
    };

    return (
        <div className="column">
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
                        autoFocus
                        placeholder="Task title…"
                        value={newTaskName}
                        onChange={(event) => setNewTaskName(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Escape") cancelAdding();
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
                    <TaskCard
                        key={task.id}
                        task={task}
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
    );
}
