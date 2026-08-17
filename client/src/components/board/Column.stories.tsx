import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { Column } from "./Column"
import { COLUMN_DEFS } from "./columnDefs"
import { tasks, users } from "../../mocks/fixtures"
import { withDndContext } from "../../mocks/withDndContext"

const usersById = Object.fromEntries(users.map((u) => [u.id, u.username]))

const meta: Meta<typeof Column> = {
    component: Column,
    decorators: [withDndContext],
    args: {
        isDragActive: false,
        usersById,
        onOpenTask: fn(),
        onOpenLabelPicker: fn(),
        onRemoveLabel: fn(),
    },
}
export default meta

type Story = StoryObj<typeof Column>

export const ToDoWithAddTask: Story = {
    args: {
        def: COLUMN_DEFS[0],
        tasks: tasks.filter((task) => task.status === "to_do"),
        onAddTask: fn(),
    },
}

export const Empty: Story = {
    args: {
        def: COLUMN_DEFS[4],
        tasks: [],
    },
}
