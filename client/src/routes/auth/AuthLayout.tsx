import type { ReactNode } from "react"
import "./AuthLayout.css"

interface AuthLayoutProps {
    title: string
    subtitle: string
    children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
    return (
        <div className="auth-layout">
            <div className="auth-layout__container">
                <div className="auth-layout__header">
                    <div className="auth-layout__logo">
                        <div className="auth-layout__logo-mark" />
                    </div>
                    <h1 className="auth-layout__title">{title}</h1>
                    <p className="auth-layout__subtitle">{subtitle}</p>
                </div>
                <div className="auth-layout__card">{children}</div>
            </div>
        </div>
    )
}
