import { apiRequest } from "./client";

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
}

export type NewTrip = Omit<Trip, "id">;

export const tripsApi = {
  list: () => apiRequest<Trip[]>("/api/trips"),
  get: (id: string) => apiRequest<Trip>(`/api/trips/${encodeURIComponent(id)}`),
  create: (trip: NewTrip) => apiRequest<Trip>("/api/trips", { method: "POST", body: trip }),
  update: (id: string, trip: NewTrip) =>
    apiRequest<Trip>(`/api/trips/${encodeURIComponent(id)}`, { method: "PUT", body: trip }),
  remove: (id: string) =>
    apiRequest<void>(`/api/trips/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
