import { useState } from "react";
import { signup as signupRequest } from "../api/auth";
import { useAuth } from "../context/useAuth";

export function useSignup() {
    const { setSession } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const signup = async (
        username: string,
        email: string,
        password: string,
    ) => {
        setError("");
        setIsSubmitting(true);

        try {
            const result = await signupRequest(password, email, username);

            if (result.user && result.token) {
                setSession(result.user, result.token);
            } else if (result.error) {
                setError(result.error);
            }
        } catch {
            setError("Sign up failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return { signup, isSubmitting, error, setError };
}
