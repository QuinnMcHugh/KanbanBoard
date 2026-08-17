import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { AppHeader } from "./AppHeader"
import { projects, users } from "../../mocks/fixtures"

const meta: Meta<typeof AppHeader> = {
    component: AppHeader,
    args: {
        projects,
        currentProject: projects[0],
        onSelectProject: fn(),
        onCreateProject: fn(),
        onDeleteProject: fn(),
        user: users[0],
        onLogOut: fn(),
    },
}
export default meta

type Story = StoryObj<typeof AppHeader>

export const Default: Story = {}

export const NoProjectsYet: Story = {
    args: { projects: [], currentProject: null },
}
