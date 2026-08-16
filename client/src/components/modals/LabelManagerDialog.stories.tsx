import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { LabelManagerDialog } from "./LabelManagerDialog";
import { labels } from "../../mocks/fixtures";

const meta: Meta<typeof LabelManagerDialog> = {
    component: LabelManagerDialog,
    args: {
        open: true,
        onOpenChange: fn(),
        labels,
        checkedLabelIds: [labels[0].id, labels[2].id],
        onSave: fn(),
        onDeleteLabel: fn(),
        onCreateLabel: fn(),
    },
};
export default meta;

type Story = StoryObj<typeof LabelManagerDialog>;

export const Default: Story = {};
