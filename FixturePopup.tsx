import React, { useEffect, useState } from "react";
import "./Popup.css";

interface FixtureDTO {
  id: string;
  gameName: string;
  venue: string;
  totalTeams: number;
  date: string;
  startTime: string;
  endTime: string;
}

const FixturePopup: React.FC<{
  fixtureId: string;
  onClose: () => void;
}> = ({ fixtureId, onClose }) => {
  const [fixture, setFixture] = useState<FixtureDTO | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/gantt/popup/${fixtureId}`)
      .then((res) => res.json())
      .then(setFixture);
  }, [fixtureId]);

  if (!fixture) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h3>{fixture.gameName}</h3>

        <p>
          <b>Venue:</b> {fixture.venue}
        </p>
        <p>
          <b>Total Teams:</b> {fixture.totalTeams}
        </p>
        <p>
          <b>Date:</b> {fixture.date}
        </p>
        <p>
          <b>Time:</b> {fixture.startTime} - {fixture.endTime}
        </p>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default FixturePopup;
