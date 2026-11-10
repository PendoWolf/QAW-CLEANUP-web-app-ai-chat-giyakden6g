import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi, type Account, type User } from "../api/auth";
import { clearSession, readSession, saveSession } from "./session";

interface AuthState {
  user: User | null;
  account: Account | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Replaces the signed-in user's details, after they edit their profile. */
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthState | null>(null);

/** Holds the signed-in user and their account (company), and signs in and out against the Tripwise API. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(readSession);
  const user = session?.user ?? null;
  const account = session?.account ?? null;

  // Identify the signed-in user to Pendo on sign-in, on a reload that restores a stored
  // session, and whenever their profile changes.
  useEffect(() => {
    if (!user || !account) return;
    pendo.identify({
      visitor: {
        id: user.id,
        email: user.email,
        full_name: user.name,
        role: user.role,
        accountId: user.accountId,
      },
      account: {
        id: account.id,
        name: account.name,
        plan: account.plan,
      },
    });
  }, [user, account]);

  const signIn = useCallback(async (email: string, password: string) => {
    const signedIn = await authApi.signIn(email, password);
    saveSession(signedIn);
    setSession(signedIn);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authApi.signOut();
    } finally {
      clearSession();
      setSession(null);
      // Reset Pendo to a fresh anonymous visitor. clearSession is not stubbed by the
      // install snippet, so it is only available once the Pendo agent has loaded.
      pendo.clearSession?.();
    }
  }, []);

  const updateUser = useCallback((user: User) => {
    setSession((current) => {
      if (!current) return current;
      const updated = { ...current, user };
      saveSession(updated);
      return updated;
    });
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      account,
      signIn,
      signOut,
      updateUser,
    }),
    [user, account, signIn, signOut, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return auth;
}
