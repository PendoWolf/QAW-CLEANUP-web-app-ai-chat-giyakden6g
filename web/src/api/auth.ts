import { apiRequest } from "./client";

/** A company that uses Tripwise. Every user belongs to one account. */
export interface Account {
  id: string;
  name: string;
  plan: "Starter" | "Business" | "Enterprise";
}

/** The signed-in person. */
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "member";
  /** The id of the account (company) the user belongs to. */
  accountId: string;
}

/** What signing in returns: the session's bearer token, the user and their account. */
export interface Session {
  token: string;
  user: User;
  account: Account;
}

export const authApi = {
  signIn: (email: string, password: string) =>
    apiRequest<Session>("/api/auth/login", { method: "POST", body: { email, password } }),
  me: () => apiRequest<Session>("/api/auth/me"),
  signOut: () => apiRequest<void>("/api/auth/logout", { method: "POST" }),
};
