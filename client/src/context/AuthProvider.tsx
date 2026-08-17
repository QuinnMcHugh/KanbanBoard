import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react"
import { AuthContext, type AuthContextValue } from "./authContext"
import type { User } from "../types/user"
import { getMe } from "../api/auth"
import { JWT_TOKEN_KEY } from "../lib/const"

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, _setToken] = useState<string | null>(null)
    const [isInitializing, setIsInitializing] = useState<boolean>(true)

    const setToken = useCallback((_token: string | null) => {
        _setToken(_token)
        window.localStorage.setItem(JWT_TOKEN_KEY, String(_token))
    }, [])

    useEffect(() => {
        const localStorageToken = window.localStorage.getItem(JWT_TOKEN_KEY)
        if (localStorageToken) {
            try {
                getMe().then((result) => {
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
                setUser(nextUser)
                setToken(nextToken)
            },
            clearSession: () => {
                setUser(null)
                setToken(null)
                window.localStorage.removeItem(JWT_TOKEN_KEY)
            },
        }),
        [user, token, isInitializing],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
