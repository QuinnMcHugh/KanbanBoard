import { createContext } from "react"
import type { User } from "../types/user"

export interface UsersContextValue {
    users: User[]
    usersById: Record<number, string>
    isLoading: boolean
    error: string
}

export const UsersContext = createContext<UsersContextValue | null>(null)
