import type { Session } from "../api/auth";

// The signed-in session is kept in localStorage, so a reload stays signed in.
const SESSION_KEY = "tripwise.session";

export function readSession(): Session | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? (JSON.parse(stored) as Session) : null;
  } catch {
    return null;
  }
}

export function readSessionToken(): string | null {
  return readSession()?.token ?? null;
}

export function saveSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
