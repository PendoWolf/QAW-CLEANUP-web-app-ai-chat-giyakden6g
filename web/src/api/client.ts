import { readSessionToken } from "../auth/session";

// Every request goes to the Tripwise API, a separate backend service. Its base URL
// comes from VITE_API_URL at build time and defaults to the local backend.
export const API_BASE_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:3001";

/** Thrown when the API answers with an error status. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export async function apiRequest<T>(
  path: string,
  init: { method?: "GET" | "POST" | "PUT" | "DELETE"; body?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (init.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  // The signed-in session's bearer token, which every route but sign-in needs.
  const token = readSessionToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: init.method ?? "GET",
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  if (!response.ok) {
    throw new ApiError(`${init.method ?? "GET"} ${path} failed: ${response.status}`, response.status);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}
