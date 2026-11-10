import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { daysUntilDeparture, trackEvent, tripLengthDays } from "../analytics/pendo";
import { tripsApi, type NewTrip } from "../api/trips";
import { TripForm } from "../components/TripForm";

/** Plans a new trip, then goes back to the trip list. */
export function NewTripPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const createTrip = async (trip: NewTrip) => {
    try {
      setError(null);
      const created = await tripsApi.create(trip);
      // The trip was created: the API accepted it.
      trackEvent("trip_created", {
        tripId: created.id,
        destination: created.destination,
        startDate: created.startDate,
        endDate: created.endDate,
        travelers: created.travelers,
        tripLengthDays: tripLengthDays(created.startDate, created.endDate),
        daysUntilDeparture: daysUntilDeparture(created.startDate),
      });
      navigate("/trips");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <>
      <TripForm heading="Plan a trip" submitLabel="Add trip" onSubmit={createTrip} />
      {error && <p className="error">{error}</p>}
    </>
  );
}
