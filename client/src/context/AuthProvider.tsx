import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextValue } from "./authContext";
import type { User } from "../types/user";

export const JWT_TOKEN_KEY = 'jwt_token';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, _setToken] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState<boolean>(true);

    const setToken = useCallback((_token) => {
        _setToken(_token)
        window.localStorage.setItem(JWT_TOKEN_KEY, _token)
    }, [])

    useEffect(() => {
        const localStorageToken = window.localStorage.getItem(JWT_TOKEN_KEY)
        if (localStorageToken) {
            try {
                fetch('/api/auth/me', {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${localStorageToken}`,
                    },
                }).then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                    return null
                }).then((result) => {
                    if (result && result.user) {
                        setToken(localStorageToken)
                        setUser(result.user)
                    }
                    setIsInitializing(false)
                })
            } catch (ex) {
                console.log(ex)
                window.localStorage.removeItem(JWT_TOKEN_KEY)
                setIsInitializing(false)
            }
        } else {
            window.localStorage.removeItem(JWT_TOKEN_KEY)
            setIsInitializing(false)
        }
    }, [])

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            token,
            isInitializing,
            setSession: (nextUser: User, nextToken: string) => {
                setUser(nextUser);
                setToken(nextToken);
            },
            clearSession: () => {
                setUser(null);
                setToken(null);
                window.localStorage.removeItem(JWT_TOKEN_KEY)
            },
        }),
        [user, token, isInitializing],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
