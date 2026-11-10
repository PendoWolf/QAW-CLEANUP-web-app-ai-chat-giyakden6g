import type { User } from "./auth";
import { apiRequest } from "./client";

export type UserChanges = Partial<Pick<User, "name" | "email">>;

export const usersApi = {
  update: (id: string, changes: UserChanges) =>
    apiRequest<User>(`/api/users/${encodeURIComponent(id)}`, { method: "PUT", body: changes }),
};
