import { useState, type FormEvent } from "react";
import type { NewTrip } from "../api/trips";

const EMPTY_TRIP: NewTrip = { destination: "", startDate: "", endDate: "", travelers: 1 };

/** The trip form, for planning a new trip and for editing one. */
export function TripForm({
  heading,
  submitLabel,
  initialTrip = EMPTY_TRIP,
  onSubmit,
}: {
  heading: string;
  submitLabel: string;
  initialTrip?: NewTrip;
  onSubmit: (trip: NewTrip) => Promise<void>;
}) {
  const [destination, setDestination] = useState(initialTrip.destination);
  const [startDate, setStartDate] = useState(initialTrip.startDate);
  const [endDate, setEndDate] = useState(initialTrip.endDate);
  const [travelers, setTravelers] = useState(initialTrip.travelers);
  const [saving, setSaving] = useState(false);

  const canSubmit =
    destination.trim() !== "" && startDate !== "" && endDate !== "" && endDate >= startDate && !saving;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      await onSubmit({ destination: destination.trim(), startDate, endDate, travelers });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card" aria-labelledby="trip-form-heading" onSubmit={submit}>
      <h2 id="trip-form-heading">{heading}</h2>
      <label>
        Destination
        <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Lisbon" />
      </label>
      <div className="row">
        <label>
          Start date
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          End date
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <label>
          Travelers
          <input
            type="number"
            min={1}
            max={12}
            value={travelers}
            onChange={(e) => setTravelers(Number(e.target.value))}
          />
        </label>
      </div>
      <button type="submit" disabled={!canSubmit}>
        {saving ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
