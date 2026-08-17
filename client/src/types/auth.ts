import type { User } from "./user"

export interface AuthSuccessResponse {
    message: string
    token: string
    user: User
}

export interface ApiErrorResponse {
    error: string
}
