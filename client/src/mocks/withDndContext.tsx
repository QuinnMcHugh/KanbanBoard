import type { Decorator } from "@storybook/react-vite"
import { DndContext } from "@dnd-kit/core"

/**
 * Minimal DndContext ancestor for stories of components that call dnd-kit
 * hooks directly (useDraggable/useDroppable) outside of a full Board, which
 * otherwise owns the DndContext itself.
 */
export const withDndContext: Decorator = (Story) => (
    <DndContext>
        <Story />
    </DndContext>
)
