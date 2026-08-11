import "./EmptyState.css";

interface EmptyStateProps {
    onCreateProject: () => void;
}

export function EmptyState({ onCreateProject }: EmptyStateProps) {
    return (
        <div className="empty-state">
            <div className="empty-state__content">
                <div className="empty-state__icon">📋</div>
                <h2 className="empty-state__title">No projects yet</h2>
                <p className="empty-state__subtitle">
                    Create your first project to start organizing tasks into
                    swim lanes.
                </p>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onCreateProject}
                >
                    + New Project
                </button>
            </div>
        </div>
    );
}
