import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { DeleteProjectDialog } from "./DeleteProjectDialog";
import { projects } from "../../mocks/fixtures";

const meta: Meta<typeof DeleteProjectDialog> = {
    component: DeleteProjectDialog,
    args: {
        open: true,
        onOpenChange: fn(),
        onConfirm: fn(),
        projectName: projects[0].name,
    },
};
export default meta;

type Story = StoryObj<typeof DeleteProjectDialog>;

export const Default: Story = {};
