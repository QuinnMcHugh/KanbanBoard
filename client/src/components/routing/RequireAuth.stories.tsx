import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./RequireAuth";
import { withMockAuth } from "../../mocks/decorators";
import { users } from "../../mocks/fixtures";

// RequireAuth is a layout route (renders <Outlet/> or redirects), so it's shown here in the
// same nested-route shape it's actually used in (see App.tsx) rather than as a standalone leaf.
const meta: Meta<typeof RequireAuth> = {
    component: RequireAuth,
    parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof RequireAuth>;

export const Authenticated: Story = {
    decorators: [withMockAuth(users[0])],
    render: () => (
        <MemoryRouter initialEntries={["/projects"]}>
            <Routes>
                <Route element={<RequireAuth />}>
                    <Route
                        path="/projects"
                        element={
                            <div style={{ padding: 24 }}>Protected content</div>
                        }
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    ),
};

export const Unauthenticated: Story = {
    decorators: [withMockAuth(null)],
    render: () => (
        <MemoryRouter initialEntries={["/projects"]}>
            <Routes>
                <Route element={<RequireAuth />}>
                    <Route
                        path="/projects"
                        element={
                            <div style={{ padding: 24 }}>Protected content</div>
                        }
                    />
                </Route>
                <Route
                    path="/login"
                    element={
                        <div style={{ padding: 24 }}>Redirected to /login</div>
                    }
                />
            </Routes>
        </MemoryRouter>
    ),
};
