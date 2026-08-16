import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
    component: Avatar,
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
    args: { name: "Alice Admin", size: "md" },
};

export const Small: Story = {
    args: { name: "Bob Builder", size: "sm" },
};
