import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "./auth/AuthLayout";
import { useAuth } from "../context/useAuth";
import type { ApiErrorResponse, AuthSuccessResponse } from "../types/auth";

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { setSession } = useAuth();

    const submitLogin = async () => {
        setError("");
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, email }),
            });
            const result = (await response.json()) as Partial<
                AuthSuccessResponse & ApiErrorResponse
            >;

            if (result.user && result.token) {
                // triggers navigation via App.tsx react-router
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

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        submitLogin();
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your kanban workspace"
        >
            <form onSubmit={handleSubmit}>
                {error && <div className="error-banner">{error}</div>}
                <div className="field">
                    <label htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="field">
                    <label htmlFor="login-password">Password</label>
                    <input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Signing in…" : "Sign In"}
                </button>
                <p className="auth-layout__footer-text">
                    No account? <Link to="/signup">Create one</Link>
                </p>
            </form>
        </AuthLayout>
    );
}
