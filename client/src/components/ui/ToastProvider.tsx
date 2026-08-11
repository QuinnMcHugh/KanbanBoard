import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Toast as RadixToast } from "radix-ui";
import { ToastContext, type ToastVariant } from "./toastContext";
import "./Toast.css";

interface ToastItem {
    id: string;
    variant: ToastVariant;
    message: string;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const addToast = useCallback((variant: ToastVariant, message: string) => {
        const id = crypto.randomUUID();
        setToasts((current) => [...current, { id, variant, message }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const value = useMemo(() => ({ addToast }), [addToast]);

    return (
        <ToastContext.Provider value={value}>
            <RadixToast.Provider swipeDirection="right" duration={3500}>
                {children}
                {toasts.map((toast) => (
                    <RadixToast.Root
                        key={toast.id}
                        className={`toast toast--${toast.variant}`}
                        onOpenChange={(open) => {
                            if (!open) removeToast(toast.id);
                        }}
                    >
                        <RadixToast.Description className="toast__message">
                            <span>{toast.variant === "error" ? "⚠" : "✓"}</span>{" "}
                            {toast.message}
                        </RadixToast.Description>
                    </RadixToast.Root>
                ))}
                <RadixToast.Viewport className="toast-viewport" />
            </RadixToast.Provider>
        </ToastContext.Provider>
    );
}
