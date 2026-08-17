import { JWT_TOKEN_KEY } from "./const"

// Unset in dev: requests stay relative and are proxied by Vite (see vite.config.ts).
// Set at build time for any deploy where the client isn't served same-origin with the API.
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "")

export function apiUrl(path: string): string {
    return `${API_BASE_URL}${path}`
}

export const HttpMethod = {
    GET: "GET",
    POST: "POST",
    PATCH: "PATCH",
    DELETE: "DELETE",
} as const

export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod]

interface MaybeErrorBody {
    error?: unknown
}

export async function apiRequest<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const token = window.localStorage.getItem(JWT_TOKEN_KEY)

    const response = await fetch(apiUrl(path), {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    })

    const body: unknown = await response.json().catch(() => null)

    if (!response.ok) {
        const errorBody = body as MaybeErrorBody | null
        const message =
            typeof errorBody?.error === "string"
                ? errorBody.error
                : "Request failed."
        throw new Error(message)
    }

    return body as T
}
