import type { Decorator } from "@storybook/react-vite"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { AuthContext, type AuthContextValue } from "../context/authContext"
import { UsersContext, type UsersContextValue } from "../context/usersContext"
import type { User } from "../types/user"

const noop = () => {}

/**
 * Supplies AuthContext directly with a static value, bypassing the real
 * AuthProvider's own getMe() fetch entirely — simpler than mocking that
 * fetch when a story just needs *some* auth context to render.
 */
export function withMockAuth(user: User | null): Decorator {
    const value: AuthContextValue = {
        user,
        token: user ? "mock-token" : null,
        isInitializing: false,
        setSession: noop,
        clearSession: noop,
    }

    return (Story) => (
        <AuthContext.Provider value={value}>
            <Story />
        </AuthContext.Provider>
    )
}

/** Same idea as withMockAuth, for UsersContext — bypasses UsersProvider's getUsers() fetch. */
export function withMockUsers(users: User[]): Decorator {
    const value: UsersContextValue = {
        users,
        usersById: Object.fromEntries(users.map((u) => [u.id, u.username])),
        isLoading: false,
        error: "",
    }

    return (Story) => (
        <UsersContext.Provider value={value}>
            <Story />
        </UsersContext.Provider>
    )
}

/**
 * Wraps a story in a MemoryRouter. Pass `routePath` (e.g. "/projects/:projectId")
 * for components that read route params via useParams — the story is rendered
 * as the matched route's element so those params actually resolve.
 */
export function withRouter(initialPath: string, routePath?: string): Decorator {
    return (Story) => (
        <MemoryRouter initialEntries={[initialPath]}>
            {routePath ? (
                <Routes>
                    <Route path={routePath} element={<Story />} />
                </Routes>
            ) : (
                <Story />
            )}
        </MemoryRouter>
    )
}
