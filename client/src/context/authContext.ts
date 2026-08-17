import { createContext } from "react"
import type { User } from "../types/user"

export interface AuthContextValue {
    user: User | null
    token: string | null
    isInitializing: boolean
    setSession: (user: User, token: string) => void
    clearSession: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
