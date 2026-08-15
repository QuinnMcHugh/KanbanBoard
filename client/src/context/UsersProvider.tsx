import { useEffect, useMemo, useState, type ReactNode } from "react";
import { UsersContext, type UsersContextValue } from "./usersContext";
import { getUsers } from "../api/users";
import type { User } from "../types/user";

export function UsersProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

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

    const usersById = useMemo<Record<number, string>>(
        () =>
            users.reduce<Record<number, string>>((acc, user) => {
                acc[user.id] = user.username;
                return acc;
            }, {}),
        [users],
    );

    const value = useMemo<UsersContextValue>(
        () => ({ users, usersById, isLoading, error }),
        [users, usersById, isLoading, error],
    );

    return (
        <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
    );
}
