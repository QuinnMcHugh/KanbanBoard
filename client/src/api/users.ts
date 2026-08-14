import { apiRequest } from "../lib/apiClient";
import type { User } from "../types/user";

export function getUsers(): Promise<{ users: User[] }> {
    return apiRequest<{ users: User[] }>("/api/users");
}
