import { Link } from "react-router-dom";
import type { Trip } from "../api/trips";

export function TripList({ trips, onRemove }: { trips: Trip[]; onRemove: (trip: Trip) => void }) {
  if (trips.length === 0) {
    return (
      <p className="empty">
        No trips yet. <Link to="/trips/new">Plan one</Link>, or ask the assistant for ideas.
      </p>
    );
  }
  return (
    <ul className="trips">
      {trips.map((trip) => (
        <li key={trip.id} className="card trip">
          <div>
            <strong>{trip.destination}</strong>
            <span>
              {trip.startDate} → {trip.endDate} · {trip.travelers} traveler{trip.travelers === 1 ? "" : "s"}
            </span>
          </div>
          <div className="actions">
            <Link className="button secondary" to={`/trips/${encodeURIComponent(trip.id)}/edit`} aria-label={`Edit ${trip.destination}`}>
              Edit
            </Link>
            <button type="button" className="secondary" onClick={() => onRemove(trip)} aria-label={`Remove ${trip.destination}`}>
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
