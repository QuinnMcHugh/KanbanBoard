import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ToastProvider } from "./components/ui/ToastProvider";
import { LoginPage } from "./routes/LoginPage";
import { SignupPage } from "./routes/SignupPage";
import { BoardPage } from "./routes/BoardPage";

function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/login" replace />}
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/projects" element={<BoardPage />} />
                    <Route
                        path="/projects/:projectId"
                        element={<BoardPage />}
                    />
                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />
                </Routes>
            </ToastProvider>
        </AuthProvider>
    );
}

export default App;
