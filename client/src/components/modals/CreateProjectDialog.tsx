import { useState, type FormEvent } from "react"
import { Dialog } from "radix-ui"

interface CreateProjectDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreate: (name: string) => void
}

export function CreateProjectDialog({
    open,
    onOpenChange,
    onCreate,
}: CreateProjectDialogProps) {
    const [name, setName] = useState("")
    const [error, setError] = useState("")

    const reset = () => {
        setName("")
        setError("")
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        const trimmed = name.trim()
        if (trimmed.length < 3) {
            setError("Project name must be at least 3 characters.")
            return
        }
        onCreate(trimmed)
        reset()
    }

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(next) => {
                onOpenChange(next)
                if (!next) reset()
            }}
        >
            <Dialog.Portal>
                <Dialog.Overlay className="modal-overlay" />
                <Dialog.Content
                    className="modal-content"
                    style={{ width: 380 }}
                >
                    <Dialog.Title className="modal-title">
                        New Project
                    </Dialog.Title>
                    <Dialog.Description className="sr-only">
                        Create a new project to organize tasks into.
                    </Dialog.Description>
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label htmlFor="new-project-name">
                                Project name
                            </label>
                            <input
                                id="new-project-name"
                                // This dialog only opens in response to a user
                                // clicking "New Project", so focusing its one field
                                // is the expected response, not a page-load autofocus.
                                // eslint-disable-next-line jsx-a11y/no-autofocus
                                autoFocus
                                placeholder="e.g. Marketing Site Relaunch"
                                value={name}
                                onChange={(event) => {
                                    setName(event.target.value)
                                    setError("")
                                }}
                            />
                        </div>
                        {error && <div className="error-banner">{error}</div>}
                        <div className="modal-actions">
                            <Dialog.Close asChild>
                                <button type="button" className="btn btn-ghost">
                                    Cancel
                                </button>
                            </Dialog.Close>
                            <button type="submit" className="btn btn-primary">
                                Create
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
