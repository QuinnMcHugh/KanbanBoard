import { createContext } from "react";

export type ToastVariant = "success" | "error";

export interface ToastContextValue {
    addToast: (variant: ToastVariant, message: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
