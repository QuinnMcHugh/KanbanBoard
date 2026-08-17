import "./FullPageSpinner.css"

export function FullPageSpinner() {
    return (
        <div className="full-page-spinner" role="status" aria-live="polite">
            <div className="full-page-spinner__ring" />
            <span className="sr-only">Loading…</span>
        </div>
    )
}
