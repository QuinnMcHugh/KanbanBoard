import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { TaskDetailDialog } from "./TaskDetailDialog"
import { tasks, users } from "../../mocks/fixtures"

const assigneeOptions = users.map((user) => ({
    id: user.id,
    name: user.username,
}))

const meta: Meta<typeof TaskDetailDialog> = {
    component: TaskDetailDialog,
    args: {
        task: tasks[0],
        assigneeOptions,
        onOpenChange: fn(),
        onSave: fn(),
        onOpenLabelPicker: fn(),
        onRemoveLabel: fn(),
        onDelete: fn(),
    },
}
export default meta

type Story = StoryObj<typeof TaskDetailDialog>

export const Default: Story = {}

export const Unassigned: Story = {
    args: { task: tasks[2] },
}
