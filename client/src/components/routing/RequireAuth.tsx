import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../../context/useAuth"
import { FullPageSpinner } from "../ui/FullPageSpinner"

export function RequireAuth() {
    const { user, token, isInitializing } = useAuth()
    const location = useLocation()

    if (isInitializing) {
        return <FullPageSpinner />
    }

    if (!user || !token) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    return <Outlet />
}
