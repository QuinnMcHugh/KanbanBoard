import type { ApiErrorResponse, AuthSuccessResponse } from "../types/auth"
import { apiUrl, HttpMethod } from "../lib/apiClient"
import { JWT_TOKEN_KEY } from "../lib/const"

export interface CheckSignUpResponse {
    message: string
}

export async function checkAreCredentialsAvailable(
    username: string,
    email: string,
): Promise<CheckSignUpResponse> {
    const response = await fetch(apiUrl("/api/auth/checkSignup"), {
        method: HttpMethod.POST,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username,
            email,
        }),
    })

    const jsonBody = (await response.json()) as Partial<
        CheckSignUpResponse & ApiErrorResponse
    >

    return jsonBody as CheckSignUpResponse
}

export async function signup(
    password: string,
    email: string,
    username: string,
) {
    const response = await fetch(apiUrl("/api/auth/signup"), {
        method: HttpMethod.POST,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            password,
            email,
            username,
        }),
    })
    return (await response.json()) as Partial<
        AuthSuccessResponse & ApiErrorResponse
    >
}

export async function login(password: string, email: string) {
    const response = await fetch(apiUrl("/api/auth/login"), {
        method: HttpMethod.POST,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, email }),
    })
    return (await response.json()) as Partial<
        AuthSuccessResponse & ApiErrorResponse
    >
}

export async function getMe() {
    const localStorageToken = window.localStorage.getItem(JWT_TOKEN_KEY)
    const response = await fetch(apiUrl("/api/auth/me"), {
        method: HttpMethod.GET,
        headers: {
            Authorization: `Bearer ${localStorageToken}`,
        },
    })
    return (await response.json()) as Partial<
        Pick<AuthSuccessResponse, "user"> & ApiErrorResponse
    >
}
