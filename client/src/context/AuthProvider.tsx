import { useMemo, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextValue } from "./authContext";
import type { User } from "../types/user";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            token,
            setSession: (nextUser: User, nextToken: string) => {
                setUser(nextUser);
                setToken(nextToken);
            },
            clearSession: () => {
                setUser(null);
                setToken(null);
            },
        }),
        [user, token],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
