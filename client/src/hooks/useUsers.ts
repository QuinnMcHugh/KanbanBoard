import { useEffect, useMemo, useState } from "react";
import { getUsers } from "../api/users";
import type { User } from "../types/user";

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const usersById: { [userId: number]: string } = useMemo(
        () =>
            users.reduce(
                (prev, curr) => ({
                    ...prev,
                    [curr.id]: curr.username,
                }),
                {},
            ),
        [users],
    );

    useEffect(() => {
        const load = async () => {
            try {
                const result = await getUsers();
                setUsers(result.users);
            } catch {
                setError("Unable to load users.");
            } finally {
                setIsLoading(false);
            }
        };

        void load();
    }, []);

    return { users, isLoading, error, usersById };
}
