import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { LabelBadge } from "./LabelBadge"
import { labels } from "../../mocks/fixtures"

const meta: Meta<typeof LabelBadge> = {
    component: LabelBadge,
}
export default meta

type Story = StoryObj<typeof LabelBadge>

export const Default: Story = {
    args: { label: labels[0] },
}

export const Removable: Story = {
    args: { label: labels[2], onRemove: fn() },
}
