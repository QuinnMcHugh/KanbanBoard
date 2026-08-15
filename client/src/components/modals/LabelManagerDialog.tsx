import { useState } from "react";
import { Checkbox, Dialog } from "radix-ui";
import type { Label } from "../../types/label";
import "./LabelManagerDialog.css";

const SWATCH_COLORS = [
    "#ef4444",
    "#f59e0b",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
];

function sameLabelIds(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    const setB = new Set(b);
    return a.every((id) => setB.has(id));
}

interface LabelManagerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    labels: Label[];
    checkedLabelIds: number[];
    onSave: (labelIds: number[]) => void;
    onDeleteLabel: (labelId: number) => void;
    onCreateLabel: (name: string, color: string) => void;
}

export function LabelManagerDialog({
    open,
    onOpenChange,
    labels,
    checkedLabelIds,
    onSave,
    onDeleteLabel,
    onCreateLabel,
}: LabelManagerDialogProps) {
    const [newName, setNewName] = useState("");
    const [selectedColor, setSelectedColor] = useState(SWATCH_COLORS[0]);
    const [checkedIds, setCheckedIds] = useState<number[]>(checkedLabelIds);

    const handleAdd = () => {
        const name = newName.trim();
        if (!name) return;
        onCreateLabel(name, selectedColor);
        setNewName("");
    };

    const handleToggleCheckbox = (labelId: number) => {
        setCheckedIds((prev) =>
            prev.includes(labelId)
                ? prev.filter((id) => id !== labelId)
                : [...prev, labelId],
        );
    };

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            // Drop any ids for labels deleted globally while this modal was open.
            const validIds = checkedIds.filter((id) =>
                labels.some((label) => label.id === id),
            );
            if (!sameLabelIds(validIds, checkedLabelIds)) {
                onSave(validIds);
            }
        }
        onOpenChange(next);
    };

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="modal-overlay" />
                <Dialog.Content className="modal-content label-manager-dialog">
                    <Dialog.Title className="modal-title">
                        Manage Labels
                    </Dialog.Title>
                    <Dialog.Description className="sr-only">
                        Toggle labels on this task, or create and delete labels
                        for the whole workspace.
                    </Dialog.Description>

                    <div className="label-manager-dialog__list">
                        {labels.map((label) => (
                            <div
                                key={label.id}
                                className="label-manager-dialog__row"
                            >
                                <Checkbox.Root
                                    className="label-manager-dialog__checkbox"
                                    checked={checkedIds.includes(label.id)}
                                    onCheckedChange={() =>
                                        handleToggleCheckbox(label.id)
                                    }
                                >
                                    <Checkbox.Indicator>✓</Checkbox.Indicator>
                                </Checkbox.Root>
                                <span
                                    className="label-manager-dialog__dot"
                                    style={{ background: label.color }}
                                />
                                <span className="label-manager-dialog__name">
                                    {label.name}
                                </span>
                                <button
                                    type="button"
                                    className="label-manager-dialog__delete"
                                    onClick={() => onDeleteLabel(label.id)}
                                    aria-label={`Delete ${label.name} label`}
                                >
                                    🗑
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="label-manager-dialog__create">
                        <label
                            className="task-detail-dialog__field-label"
                            htmlFor="new-label-name"
                        >
                            Create new label
                        </label>
                        <input
                            id="new-label-name"
                            placeholder="Label name"
                            value={newName}
                            onChange={(event) => setNewName(event.target.value)}
                        />
                        <div className="label-manager-dialog__swatches">
                            {SWATCH_COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className="label-manager-dialog__swatch"
                                    style={{
                                        background: color,
                                        boxShadow:
                                            color === selectedColor
                                                ? "0 0 0 2px #fff, 0 0 0 4px var(--color-accent)"
                                                : "none",
                                    }}
                                    onClick={() => setSelectedColor(color)}
                                    aria-label={`Use color ${color}`}
                                />
                            ))}
                        </div>
                        <div className="modal-actions">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleAdd}
                            >
                                + Add
                            </button>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <Dialog.Close asChild>
                            <button type="button" className="btn btn-secondary">
                                Save
                            </button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
