import { DropdownMenu } from "radix-ui"
import type { Project } from "../../types/project"
import type { User } from "../../types/user"
import { Avatar } from "../ui/Avatar"
import "./AppHeader.css"

interface AppHeaderProps {
    projects: Project[]
    currentProject: Project | null
    onSelectProject: (id: number) => void
    onCreateProject: () => void
    onDeleteProject: () => void
    user: User | null
    onLogOut: () => void
}

export function AppHeader({
    projects,
    currentProject,
    onSelectProject,
    onCreateProject,
    onDeleteProject,
    user,
    onLogOut,
}: AppHeaderProps) {
    return (
        <header className="app-header">
            <div className="app-header__left">
                <div className="app-header__brand">
                    <div className="app-header__logo" />
                    <span className="app-header__brand-name">Kanban</span>
                </div>

                {projects.length > 0 && (
                    <>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <button
                                    type="button"
                                    className="app-header__project-switcher"
                                >
                                    {currentProject?.name}
                                    <span className="app-header__chevron">
                                        ▾
                                    </span>
                                </button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    className="app-header__project-menu"
                                    align="start"
                                    sideOffset={6}
                                >
                                    {projects.map((project) => (
                                        <DropdownMenu.Item
                                            key={project.id}
                                            className={
                                                project.id ===
                                                currentProject?.id
                                                    ? "app-header__project-menu-item app-header__project-menu-item--active"
                                                    : "app-header__project-menu-item"
                                            }
                                            onSelect={() =>
                                                onSelectProject(project.id)
                                            }
                                        >
                                            {project.name}
                                        </DropdownMenu.Item>
                                    ))}
                                    <DropdownMenu.Separator className="app-header__project-menu-separator" />
                                    <DropdownMenu.Item
                                        className="app-header__project-menu-item app-header__project-menu-item--accent"
                                        onSelect={onCreateProject}
                                    >
                                        + New Project
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                        <button
                            type="button"
                            className="app-header__icon-btn"
                            title="Delete project"
                            onClick={onDeleteProject}
                        >
                            🗑
                        </button>
                    </>
                )}
            </div>

            <div className="app-header__right">
                {user && (
                    <>
                        <div className="app-header__user">
                            <Avatar name={user.username} size="md" />
                            <span className="app-header__user-name">
                                {user.username}
                            </span>
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onLogOut}
                        >
                            Log Out
                        </button>
                    </>
                )}
            </div>
        </header>
    )
}
