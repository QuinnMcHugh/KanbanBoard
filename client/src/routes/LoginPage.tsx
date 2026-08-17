import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { AuthLayout } from "./auth/AuthLayout"
import { useLogin } from "../hooks/useLogin"

export function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login, isSubmitting, error } = useLogin()

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        // triggers navigation via App.tsx react-router on success
        login(email, password)
    }

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
    )
}
