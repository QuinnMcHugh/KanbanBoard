import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { CreateProjectDialog } from "./CreateProjectDialog";

const meta: Meta<typeof CreateProjectDialog> = {
    component: CreateProjectDialog,
    args: {
        open: true,
        onOpenChange: fn(),
        onCreate: fn(),
    },
};
export default meta;

type Story = StoryObj<typeof CreateProjectDialog>;

export const Default: Story = {};
