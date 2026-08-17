import type { Meta, StoryObj } from "@storybook/react-vite"
import { AuthLayout } from "./AuthLayout"

const meta: Meta<typeof AuthLayout> = {
    component: AuthLayout,
    parameters: { layout: "fullscreen" },
    args: {
        title: "Welcome back",
        subtitle: "Sign in to your kanban workspace",
        children: (
            <p
                style={{
                    textAlign: "center",
                    color: "var(--color-text-muted)",
                }}
            >
                (form content goes here)
            </p>
        ),
    },
}
export default meta

type Story = StoryObj<typeof AuthLayout>

export const Default: Story = {}
