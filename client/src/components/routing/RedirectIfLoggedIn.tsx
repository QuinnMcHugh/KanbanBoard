import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../../context/useAuth"
import { FullPageSpinner } from "../ui/FullPageSpinner"

interface AuthLocationState {
    from?: { pathname: string }
}

interface IRedirectIfLoggedInProps {
    toUrl: string
}

export function RedirectIfLoggedIn({ toUrl }: IRedirectIfLoggedInProps) {
    const { user, token, isInitializing } = useAuth()
    const location = useLocation()
    const locationState = location.state as AuthLocationState | null

    if (isInitializing) {
        return <FullPageSpinner />
    }

    if (user || token) {
        return <Navigate to={locationState?.from?.pathname ?? toUrl} replace />
    }

    return <Outlet />
}
