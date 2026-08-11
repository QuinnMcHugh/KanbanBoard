import { createContext } from "react";
import type { User } from "../types/user";

export interface AuthContextValue {
    user: User | null;
    token: string | null;
    setSession: (user: User, token: string) => void;
    clearSession: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
