import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "./auth/AuthLayout";
import { debounce } from "../lib/debounce";
import {
    checkAreCredentialsAvailable,
    type CheckSignUpResponse,
} from "../api/auth";
import { useSignup } from "../hooks/useSignup";
import type { ApiErrorResponse } from "../types/auth";

async function _checkAreCredentialsAvailable(
    username: string,
    email: string,
): Promise<Partial<CheckSignUpResponse & ApiErrorResponse>> {
    return await checkAreCredentialsAvailable(username, email);
}
const debouncedCheckCredentials = debounce(_checkAreCredentialsAvailable, 500);

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isCredentialsAvailable, setIsCredentialsAvailable] = useState(true);

    const { signup, isSubmitting, error, setError } = useSignup();

    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        // triggers navigation via App.tsx react-router on success
        signup(username, email, password);
    };

    const isUsernameEmailComboAvailable = useCallback(async () => {
        const response = await debouncedCheckCredentials(username, email);
        if (!response.error) {
            setError("");
            return true;
        } else {
            setError(response.error);
            return false;
        }
    }, [username, email, setError]);

    const isCreatePreconditionsEnabled =
        username &&
        email &&
        EMAIL_REGEX.test(email) &&
        hasMinLength &&
        hasNumber &&
        hasLetter;
    const isCreateEnabled =
        isCreatePreconditionsEnabled && isCredentialsAvailable;

    const lastUsernameEmailParamsRef = useRef<{
        username: string;
        email: string;
    }>({ username: "", email: "" });

    useEffect(() => {
        if (isCreatePreconditionsEnabled) {
            if (
                email !== lastUsernameEmailParamsRef.current.email ||
                username !== lastUsernameEmailParamsRef.current.username
            ) {
                isUsernameEmailComboAvailable()
                    .then((isAvailable) => {
                        if (isAvailable) {
                            lastUsernameEmailParamsRef.current = {
                                username,
                                email,
                            };
                            setIsCredentialsAvailable(true);
                        } else {
                            setIsCredentialsAvailable(false);
                        }
                    })
                    .catch((ex) => {
                        console.log(ex);
                        setIsCredentialsAvailable(false);
                    });
            }
        }
    }, [
        isCreatePreconditionsEnabled,
        username,
        email,
        isUsernameEmailComboAvailable,
    ]);

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Set up a workspace in seconds"
        >
            <form onSubmit={handleSubmit}>
                {error && <div className="error-banner">{error}</div>}
                <div className="field">
                    <label htmlFor="signup-username">Username</label>
                    <input
                        id="signup-username"
                        type="text"
                        placeholder="JohnSmith"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
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
                {password && (
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
                )}
                <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={!isCreateEnabled || isSubmitting}
                >
                    {isSubmitting ? "Creating account…" : "Create Account"}
                </button>
                <p className="auth-layout__footer-text">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </form>
        </AuthLayout>
    );
}
