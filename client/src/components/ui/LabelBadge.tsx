import type { CSSProperties } from "react";
import type { Label } from "../../types/label";
import "./LabelBadge.css";

interface LabelBadgeProps {
    label: Label;
    onRemove?: () => void;
}

export function LabelBadge({ label, onRemove }: LabelBadgeProps) {
    const style = { "--label-color": label.color } as CSSProperties;

    return (
        <span className="label-badge" style={style}>
            {label.name}
            {onRemove && (
                <button
                    type="button"
                    className="label-badge__remove"
                    onClick={onRemove}
                    aria-label={`Remove ${label.name} label`}
                >
                    ×
                </button>
            )}
        </span>
    );
}
