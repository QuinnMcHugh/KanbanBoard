import type { Task } from "../../types/task";
import { COLUMN_DEFS } from "./columnDefs";
import { Column } from "./Column";
import "./Board.css";

interface BoardProps {
    tasks: Task[];
    onOpenTask: (taskId: number) => void;
    onOpenLabelPicker: (taskId: number) => void;
    onRemoveLabel: (taskId: number, labelId: number) => void;
    onAddTask: (name: string) => void;
}

export function Board({
    tasks,
    onOpenTask,
    onOpenLabelPicker,
    onRemoveLabel,
    onAddTask,
}: BoardProps) {
    return (
        <div className="board">
            <div className="board__columns">
                {COLUMN_DEFS.map((def) => (
                    <Column
                        key={def.status}
                        def={def}
                        tasks={tasks.filter(
                            (task) => task.status === def.status,
                        )}
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
    );
}
