import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { DraggableTaskCard } from "./DraggableTaskCard";
import { tasks } from "../../mocks/fixtures";
import { withDndContext } from "../../mocks/withDndContext";

const meta: Meta<typeof DraggableTaskCard> = {
    component: DraggableTaskCard,
    decorators: [withDndContext],
    args: {
        task: tasks[0],
        assigneeName: "alice_admin",
        onOpen: fn(),
        onOpenLabelPicker: fn(),
        onRemoveLabel: fn(),
    },
};
export default meta;

type Story = StoryObj<typeof DraggableTaskCard>;

export const Default: Story = {};
