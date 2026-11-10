import { ApiError } from "../api/client";

// Pendo Track Events. The Pendo agent attaches the visitor and account to every
// event, so the properties never include them.
type TrackProperties = Record<string, string | number | boolean | null>;

declare global {
  interface Window {
    pendo?: { track: (eventName: string, properties?: TrackProperties) => void };
  }
}

/** Sends a Pendo Track Event. Does nothing when the Pendo agent isn't loaded, and never throws. */
export function trackEvent(eventName: string, properties: TrackProperties = {}): void {
  try {
    window.pendo?.track(eventName, properties);
  } catch {
    // Tracking must never break the app.
  }
}

/** The HTTP status of a failed API call, or null when the call failed without one (e.g. a network error). */
export function errorStatus(e: unknown): number | null {
  return e instanceof ApiError ? e.status : null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days from one date to another; negative when `to` is earlier. */
function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / DAY_MS);
}

/** Parses a YYYY-MM-DD date as local midnight. */
function parseDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** A trip's length in days, counting both the start and end date. */
export function tripLengthDays(startDate: string, endDate: string): number {
  return daysBetween(parseDate(startDate), parseDate(endDate)) + 1;
}

/** Days from today until a trip starts; negative once it has started. */
export function daysUntilDeparture(startDate: string): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return daysBetween(today, parseDate(startDate));
}
