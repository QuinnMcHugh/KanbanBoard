import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "./auth/AuthLayout";

function PasswordRequirement({
    met,
    children,
}: {
    met: boolean;
    children: ReactNode;
}) {
    const className = met
        ? "auth-layout__password-requirement auth-layout__password-requirement--met"
        : "auth-layout__password-requirement";
    return (
        <div className={className}>
            <span>{met ? "✓" : "○"}</span> {children}
        </div>
    );
}

export function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error] = useState("");

    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        // TODO: wire up to POST /api/auth/signup
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Set up a workspace in seconds"
        >
            <form onSubmit={handleSubmit}>
                {error && <div className="error-banner">{error}</div>}
                <div className="field">
                    <label htmlFor="signup-name">Name</label>
                    <input
                        id="signup-name"
                        type="text"
                        placeholder="Jordan Lee"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>
                <div className="field">
                    <label htmlFor="signup-email">Email</label>
                    <input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="field">
                    <label htmlFor="signup-password">Password</label>
                    <input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <div className="auth-layout__password-checklist">
                    <PasswordRequirement met={hasMinLength}>
                        At least 8 characters
                    </PasswordRequirement>
                    <PasswordRequirement met={hasNumber}>
                        At least one number
                    </PasswordRequirement>
                    <PasswordRequirement met={hasLetter}>
                        At least one letter
                    </PasswordRequirement>
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                    Create Account
                </button>
                <p className="auth-layout__footer-text">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </form>
        </AuthLayout>
    );
}
