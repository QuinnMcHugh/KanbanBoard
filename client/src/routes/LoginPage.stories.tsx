import type { Meta, StoryObj } from "@storybook/react-vite"
import { LoginPage } from "./LoginPage"
import { withMockAuth, withRouter } from "../mocks/decorators"

// useLogin() calls useAuth() internally even before a real submit, so AuthContext must be
// present to render at all — no fetch mock needed just to show the form (only submitting
// would hit the network, which isn't required for a visual showcase).
const meta: Meta<typeof LoginPage> = {
    component: LoginPage,
    parameters: { layout: "fullscreen" },
    decorators: [withMockAuth(null), withRouter("/login")],
}
export default meta

type Story = StoryObj<typeof LoginPage>

export const Default: Story = {}
