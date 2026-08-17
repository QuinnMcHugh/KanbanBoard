import { Avatar as RadixAvatar } from "radix-ui"
import { colorForName, initials } from "../../lib/identity"
import "./Avatar.css"

interface AvatarProps {
    name: string
    size?: "sm" | "md"
}

export function Avatar({ name, size = "sm" }: AvatarProps) {
    return (
        <RadixAvatar.Root
            className={`avatar avatar--${size}`}
            style={{ background: colorForName(name) }}
        >
            <RadixAvatar.Fallback className="avatar__fallback">
                {initials(name)}
            </RadixAvatar.Fallback>
        </RadixAvatar.Root>
    )
}
