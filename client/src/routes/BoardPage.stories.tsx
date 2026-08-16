import type { Meta, StoryObj } from "@storybook/react-vite";
import { BoardPage } from "./BoardPage";
import { withMockAuth, withMockUsers, withRouter } from "../mocks/decorators";
import { withMockFetch } from "../mocks/withMockFetch";
import { ToastProvider } from "../components/ui/ToastProvider";
import { projects, tasks, labels, users } from "../mocks/fixtures";

// The aggregation point: needs auth + users context, a router with :projectId resolved,
// ToastProvider (BoardPage calls useToast() directly), and its 3 real fetch-backed hooks
// (useProjects/useTasks/useLabels) stubbed at the network layer — those aren't Context-based,
// so withMockFetch is the only lever available for them (see withMockAuth/withMockUsers for
// the Context-based dependencies, which are handled differently, by design).
const meta: Meta<typeof BoardPage> = {
    component: BoardPage,
    parameters: { layout: "fullscreen" },
    decorators: [
        withMockAuth(users[0]),
        withMockUsers(users),
        (Story) => (
            <ToastProvider>
                <Story />
            </ToastProvider>
        ),
        withRouter("/projects/1", "/projects/:projectId"),
        withMockFetch({
            "/api/projects": { projects },
            "/api/projects/1/tasks": { tasks },
            "/api/labels": { labels },
        }),
    ],
};
export default meta;

type Story = StoryObj<typeof BoardPage>;

export const Default: Story = {};
