import type { Meta, StoryObj } from "@storybook/react-vite";
import { SignupPage } from "./SignupPage";
import { withMockAuth, withRouter } from "../mocks/decorators";

// Same reasoning as LoginPage.stories.tsx: useSignup() needs AuthContext to render at all.
// The debounced live-availability check only fires once every field is validly filled, so
// an empty initial render never touches the network.
const meta: Meta<typeof SignupPage> = {
    component: SignupPage,
    parameters: { layout: "fullscreen" },
    decorators: [withMockAuth(null), withRouter("/signup")],
};
export default meta;

type Story = StoryObj<typeof SignupPage>;

export const Default: Story = {};
