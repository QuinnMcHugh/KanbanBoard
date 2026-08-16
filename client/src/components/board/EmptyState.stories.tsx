import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
    component: EmptyState,
    parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
    args: { onCreateProject: fn() },
};
