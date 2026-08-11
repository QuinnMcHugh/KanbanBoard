import { AlertDialog } from "radix-ui";

interface DeleteProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectName: string;
    onConfirm: () => void;
}

export function DeleteProjectDialog({
    open,
    onOpenChange,
    projectName,
    onConfirm,
}: DeleteProjectDialogProps) {
    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="modal-overlay" />
                <AlertDialog.Content
                    className="modal-content"
                    style={{ width: 360 }}
                >
                    <AlertDialog.Title className="modal-title">
                        Delete project?
                    </AlertDialog.Title>
                    <AlertDialog.Description className="modal-description">
                        This will permanently delete{" "}
                        <strong>{projectName}</strong> and all of its tasks.
                        This can&apos;t be undone.
                    </AlertDialog.Description>
                    <div className="modal-actions">
                        <AlertDialog.Cancel asChild>
                            <button type="button" className="btn btn-ghost">
                                Cancel
                            </button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={onConfirm}
                            >
                                Delete
                            </button>
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}
