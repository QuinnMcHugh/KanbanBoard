import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { Board } from "./Board"
import { tasks, users } from "../../mocks/fixtures"
import { withMockUsers } from "../../mocks/decorators"

const meta: Meta<typeof Board> = {
    component: Board,
    parameters: { layout: "fullscreen" },
    decorators: [withMockUsers(users)],
    args: {
        tasks,
        onOpenTask: fn(),
        onOpenLabelPicker: fn(),
        onRemoveLabel: fn(),
        onAddTask: fn(),
        onMoveTask: fn(),
    },
}
export default meta

type Story = StoryObj<typeof Board>

export const Default: Story = {}
