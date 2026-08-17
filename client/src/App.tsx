import { lazy, Suspense } from "react"
import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthProvider"
import { UsersProvider } from "./context/UsersProvider"
import { ToastProvider } from "./components/ui/ToastProvider"
import { FullPageSpinner } from "./components/ui/FullPageSpinner"
import { RequireAuth } from "./components/routing/RequireAuth"
import { RedirectIfLoggedIn } from "./components/routing/RedirectIfLoggedIn"
import { LoginPage } from "./routes/LoginPage"
import { SignupPage } from "./routes/SignupPage"

const BoardPage = lazy(() =>
    import("./routes/BoardPage").then((m) => ({ default: m.BoardPage })),
)

function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <Suspense fallback={<FullPageSpinner />}>
                    <Routes>
                        <Route
                            element={<RedirectIfLoggedIn toUrl="/projects" />}
                        >
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                        </Route>

                        <Route element={<RequireAuth />}>
                            <Route
                                element={
                                    <UsersProvider>
                                        <Outlet />
                                    </UsersProvider>
                                }
                            >
                                <Route
                                    path="/projects"
                                    element={<BoardPage />}
                                />
                                <Route
                                    path="/projects/:projectId"
                                    element={<BoardPage />}
                                />
                            </Route>
                        </Route>

                        <Route
                            path="*"
                            element={<Navigate to="/login" replace />}
                        />
                    </Routes>
                </Suspense>
            </ToastProvider>
        </AuthProvider>
    )
}

export default App
