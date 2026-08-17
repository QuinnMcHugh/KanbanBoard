import type { Meta, StoryObj } from "@storybook/react-vite"
import { FullPageSpinner } from "./FullPageSpinner"

const meta: Meta<typeof FullPageSpinner> = {
    component: FullPageSpinner,
    parameters: {
        // Fills the canvas so the spinner's full-viewport centering is visible.
        layout: "fullscreen",
    },
}
export default meta

type Story = StoryObj<typeof FullPageSpinner>

export const Default: Story = {}
