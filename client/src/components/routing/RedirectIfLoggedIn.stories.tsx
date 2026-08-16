import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RedirectIfLoggedIn } from "./RedirectIfLoggedIn";
import { withMockAuth } from "../../mocks/decorators";
import { users } from "../../mocks/fixtures";

// Same nested-layout-route shape as it's actually used in App.tsx (wrapping /login, /signup).
const meta: Meta<typeof RedirectIfLoggedIn> = {
    component: RedirectIfLoggedIn,
    parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof RedirectIfLoggedIn>;

export const LoggedOut: Story = {
    decorators: [withMockAuth(null)],
    render: () => (
        <MemoryRouter initialEntries={["/login"]}>
            <Routes>
                <Route element={<RedirectIfLoggedIn toUrl="/projects" />}>
                    <Route
                        path="/login"
                        element={<div style={{ padding: 24 }}>Login form</div>}
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    ),
};

export const LoggedIn: Story = {
    decorators: [withMockAuth(users[0])],
    render: () => (
        <MemoryRouter initialEntries={["/login"]}>
            <Routes>
                <Route element={<RedirectIfLoggedIn toUrl="/projects" />}>
                    <Route
                        path="/login"
                        element={<div style={{ padding: 24 }}>Login form</div>}
                    />
                </Route>
                <Route
                    path="/projects"
                    element={
                        <div style={{ padding: 24 }}>
                            Redirected to /projects
                        </div>
                    }
                />
            </Routes>
        </MemoryRouter>
    ),
};
