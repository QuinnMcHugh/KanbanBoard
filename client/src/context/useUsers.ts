import { useContext } from "react";
import { UsersContext, type UsersContextValue } from "./usersContext";

export function useUsers(): UsersContextValue {
    const ctx = useContext(UsersContext);
    if (!ctx) {
        throw new Error("useUsers must be used within a UsersProvider");
    }
    return ctx;
}
