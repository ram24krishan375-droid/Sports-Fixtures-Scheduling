import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./FixtureDetails.css";

interface Venue {
  id: string;
  name: string;
  location?: string;
}

const FixtureDetails: React.FC = () => {
  const { game } = useParams<{ game: string }>();

  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState("");

  // 🔥 Load venues from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("venues");
    if (saved) {
      setVenues(JSON.parse(saved));
    }
  }, []);

  const totalTeams = 6;

  const matchTimes: Record<string, { start: string; end: string }> = {
    Football: { start: "9:00", end: "11:00" },
    Cricket: { start: "12:00", end: "3:00" },
    Hockey: { start: "11:00", end: "12:00" },
  };

  const start = matchTimes[game!]?.start;
  const end = matchTimes[game!]?.end;

  const calcDuration = () => {
    if (!start || !end) return "-";
    const s = parseInt(start);
    const e = parseInt(end);
    return `${e - s} Hours`;
  };

  return (
    <div className="fixture-details-wrapper">
      <div className="fixture-card">
        <h2>{game} Fixture Details</h2>

        <p>
          <strong>Total Teams:</strong> {totalTeams}
        </p>
        <p>
          <strong>Match Duration:</strong> {calcDuration()}
        </p>

        {/* 🔥 Venue Dropdown Dynamic From VENUES.tsx */}
        <div className="dropdown-section">
          <label>Select Venue</label>

          {venues.length === 0 ? (
            <p className="no-venues-text">
              No venues created. Go to **Venues page** and add!
            </p>
          ) : (
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
            >
              <option value="">Choose Venue</option>
              {venues.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name} {v.location ? `- ${v.location}` : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        <button className="save-btn">Save Fixture</button>
      </div>
    </div>
  );
};

export default FixtureDetails;
