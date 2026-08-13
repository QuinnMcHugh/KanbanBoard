import type { ApiErrorResponse } from "../types/auth";

interface CheckSignUpResponse {
    message: string;
}

export async function checkAreCredentialsAvailable(
    username: string,
    email: string,
): Promise<CheckSignUpResponse> {
    const response = await fetch("/api/auth/checkSignup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username,
            email,
        }),
    });

    const jsonBody = (await response.json()) as Partial<
        CheckSignUpResponse & ApiErrorResponse
    >;

    if (!response.ok) {
        throw new Error(jsonBody.error ?? "Unable to check availability.");
    }

    return jsonBody as CheckSignUpResponse;
}
