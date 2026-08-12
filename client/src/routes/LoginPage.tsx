import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "./auth/AuthLayout";
import { useAuth } from "../context/useAuth";

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error] = useState("");

    const { setSession } = useAuth();

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                password,
                email,
            }),
        }).then(async (response) => {
            if (response.ok) {
                const result = await response.json();
                // triggers navigation via App.tsx react-router
                setSession(result.user, result.token);
            }
        });
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
                <button type="submit" className="btn btn-primary btn-block">
                    Sign In
                </button>
                <p className="auth-layout__footer-text">
                    No account? <Link to="/signup">Create one</Link>
                </p>
            </form>
        </AuthLayout>
    );
}
