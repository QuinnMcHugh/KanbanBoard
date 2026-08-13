import { useState } from "react";
import { login as loginRequest } from "../api/auth";
import { useAuth } from "../context/useAuth";

export function useLogin() {
    const { setSession } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const login = async (email: string, password: string) => {
        setError("");
        setIsSubmitting(true);

        try {
            const result = await loginRequest(password, email);

            if (result.user && result.token) {
                setSession(result.user, result.token);
            } else if (result.error) {
                setError(result.error);
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return { login, isSubmitting, error, setError };
}
