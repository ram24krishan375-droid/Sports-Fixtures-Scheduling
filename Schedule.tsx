

import React, { useEffect, useRef, useState } from "react";
import "./Schedule.css";
import FixturePopup from "./FixturePopup";

interface BackendFixture {
  id: string;
  gameName: string;
  startTime: string;
  endTime: string;
}

interface FixtureBlock {
  id: string;
  startIndex: number;
  span: number;
}

const SLOT_WIDTH = 128;

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

const Schedule: React.FC<{ selectedDate: string }> = ({ selectedDate }) => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const [schedule, setSchedule] = useState<Record<string, FixtureBlock[]>>({});
  const [selectedFixture, setSelectedFixture] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/gantt/${selectedDate}`)
      .then((res) => res.json())
      .then((data: BackendFixture[]) => {
        const map: Record<string, FixtureBlock[]> = {};

        data.forEach((f) => {
          const startIndex = timeSlots.indexOf(f.startTime);
          const endIndex = timeSlots.indexOf(f.endTime);

          if (startIndex === -1 || endIndex === -1) return;

          const block: FixtureBlock = {
            id: f.id,
            startIndex,
            span: endIndex - startIndex,
          };

          if (!map[f.gameName]) map[f.gameName] = [];
          map[f.gameName].push(block);
        });

        setSchedule(map);
      });
  }, [selectedDate]);

  useEffect(() => {
    const l = leftRef.current;
    const r = rightRef.current;
    if (!l || !r) return;

    const syncLeft = () => {
      r.scrollTop = l.scrollTop;
    };

    const syncRight = () => {
      l.scrollTop = r.scrollTop;
    };

    l.addEventListener("scroll", syncLeft);
    r.addEventListener("scroll", syncRight);

    return () => {
      l.removeEventListener("scroll", syncLeft);
      r.removeEventListener("scroll", syncRight);
    };
  }, []);

  return (
    <>
      <div className="schedule-wrapper">
        <div className="schedule-container">
          <div className="left-column" ref={leftRef}>
            <div className="left-header">Games</div>
            {Object.keys(schedule).map((game) => (
              <div key={game} className="left-game">
                {game}
              </div>
            ))}
          </div>

          <div className="right-scroll" ref={rightRef}>
            <div
              className="time-row"
              style={{ width: `${timeSlots.length * SLOT_WIDTH}px` }}
            >
              {timeSlots.map((t) => (
                <div
                  key={t}
                  className="time-slot"
                  style={{
                    width: `${SLOT_WIDTH}px`,
                    minWidth: `${SLOT_WIDTH}px`,
                  }}
                >
                  {t}
                </div>
              ))}
            </div>

            {Object.entries(schedule).map(([game, blocks]) => (
              <div
                key={game}
                className="fixture-row"
                style={{ width: `${timeSlots.length * SLOT_WIDTH}px` }}
              >
                {timeSlots.map((_, i) => (
                  <div
                    key={i}
                    className="fixture-cell"
                    style={{
                      width: `${SLOT_WIDTH}px`,
                      minWidth: `${SLOT_WIDTH}px`,
                    }}
                  />
                ))}

                {blocks.map((b) => (
                  <div
                    key={b.id}
                    className="fixture-block"
                    style={{
                      left: `${b.startIndex * SLOT_WIDTH}px`,
                      width: `${b.span * SLOT_WIDTH}px`,
                    }}
                    onClick={() => setSelectedFixture(b.id)}
                  >
                    {game}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedFixture && (
        <FixturePopup
          fixtureId={selectedFixture}
          onClose={() => setSelectedFixture(null)}
        />
      )}
    </>
  );
};

export default Schedule;
