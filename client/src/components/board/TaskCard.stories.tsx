import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TaskCard } from "./TaskCard";
import { tasks } from "../../mocks/fixtures";

const meta: Meta<typeof TaskCard> = {
    component: TaskCard,
    args: {
        onOpen: fn(),
        onOpenLabelPicker: fn(),
        onRemoveLabel: fn(),
    },
};
export default meta;

type Story = StoryObj<typeof TaskCard>;

export const Default: Story = {
    args: { task: tasks[0], assigneeName: "alice_admin" },
};

export const Unassigned: Story = {
    args: { task: tasks[2] },
};
