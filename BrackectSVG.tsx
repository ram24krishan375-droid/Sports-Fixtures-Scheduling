import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import type { Fixture } from "./Knockout";
import "./Knockout.css";

interface Props {
  fixtures: Fixture[];
  fetchFixtures: () => void;
}

const boxW = 190;
const boxH = 60;
const gapX = 70;
const headerY = 60;
const topPadding = 100;
const bottomPadding = 80;
const leftPadding = 50;
const rightPadding = 50;

export default function BracketSVG({ fixtures, fetchFixtures }: Props) {
  const [popup, setPopup] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalize = (r: string) => r?.trim().toLowerCase();

  const roundPriority: Record<string, number> = {
    "preliminary round": 0,
    "round of 32": 1,
    "round of 16": 2,
    "quarter final": 3,
    "semi final": 4,
    final: 5,
  };

  const rounds = Array.from(new Set(fixtures.map((f) => f.round))).sort(
    (a, b) =>
      (roundPriority[normalize(a)] ?? 99) - (roundPriority[normalize(b)] ?? 99),
  );

  const roundsData = rounds.map((r) => fixtures.filter((f) => f.round === r));
  const totalRounds = roundsData.length;

  const maxMatchesInRound = Math.max(
    ...roundsData.map((round) => round.length),
    1,
  );

  // Dynamic height based on number of matches
  const rowHeight = 90;
  const dynamicHeight =
    maxMatchesInRound * rowHeight + topPadding + bottomPadding;
  const svgHeight = Math.max(dynamicHeight, 600);

  // Dynamic width based on number of rounds
  const dynamicWidth =
    totalRounds * boxW + (totalRounds - 1) * gapX + leftPadding + rightPadding;
  const svgWidth = Math.max(dynamicWidth, 1200);

  const startX = leftPadding;

  const centerY = (r: number, m: number) => {
    const matchesInRound = roundsData[r]?.length || 1;
    const availableHeight = svgHeight - topPadding - bottomPadding;
    const spacing = availableHeight / matchesInRound;
    return topPadding + m * spacing + spacing / 2;
  };

  const short = (t?: string) =>
    t && t.length > 22 ? t.slice(0, 22) + "..." : t || "TBD";

  const getIconColor = (team?: string, winner?: string, team1?: string) => {
    const value = team?.trim().toLowerCase();

    if (
      !team ||
      value === "" ||
      value === "tbd" ||
      value === "-" ||
      value === "null"
    ) {
      return "#94a3b8";
    }

    if (!winner) {
      return team === team1 ? "#2563eb" : "#64748b";
    }

    return team === winner ? "#16a34a" : "#dc2626";
  };

  const setWinner = async (id: string, team: string) => {
    try {
      await axios.put(
        `http://localhost:8080/api/fixtures/update-winner/${id}`,
        null,
        { params: { winnerTeam: team } },
      );
      setPopup(null);
      fetchFixtures();
    } catch (err) {
      console.error(err);
    }
  };

  const getMatchCountText = (round: string, matchCount: number) => {
    const normalizedRound = normalize(round);

    if (normalizedRound === "final") {
      return `${matchCount} Match`;
    }

    return `${matchCount} Matches`;
  };

  // Build exact position map for every match using backend data
  const matchPositionMap = new Map<
    string,
    { roundIndex: number; matchIndex: number; fixture: Fixture }
  >();

  roundsData.forEach((round, r) => {
    round.forEach((match, m) => {
      matchPositionMap.set(match.id, {
        roundIndex: r,
        matchIndex: m,
        fixture: match,
      });
    });
  });

  // Adjust popup position based on container scroll
  useEffect(() => {
    if (popup && containerRef.current) {
      const container = containerRef.current;
      const popupElement = document.querySelector(
        ".winner-popup",
      ) as HTMLElement;

      if (popupElement) {
        const containerRect = container.getBoundingClientRect();
        const popupRect = popupElement.getBoundingClientRect();

        if (popupRect.right > containerRect.right) {
          popupElement.style.left = `${
            parseFloat(popupElement.style.left) -
            (popupRect.right - containerRect.right) -
            10
          }px`;
        }
        if (popupRect.left < containerRect.left) {
          popupElement.style.left = `${
            parseFloat(popupElement.style.left) +
            (containerRect.left - popupRect.left) +
            10
          }px`;
        }
        if (popupRect.bottom > containerRect.bottom) {
          popupElement.style.top = `${
            parseFloat(popupElement.style.top) -
            (popupRect.bottom - containerRect.bottom) -
            10
          }px`;
        }
        if (popupRect.top < containerRect.top) {
          popupElement.style.top = `${
            parseFloat(popupElement.style.top) +
            (containerRect.top - popupRect.top) +
            10
          }px`;
        }
      }
    }
  }, [popup]);

  return (
    <div className="bracket-container">
      <div
        className="bracket-scroll"
        onClick={() => setPopup(null)}
        ref={containerRef}
      >
        <div
          className="bracket-wrapper"
          style={{
            width: `${svgWidth}px`,
            height: `${svgHeight}px`,
            position: "relative",
          }}
        >
          <svg
            id="bracket-svg"
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          >
            {/* ROUND TITLES */}
            {rounds.map((r, i) => {
              const matchCount = roundsData[i]?.length || 0;
              const matchCountText = getMatchCountText(r, matchCount);

              return (
                <g key={r}>
                  <text
                    x={startX + i * (boxW + gapX) + boxW / 2}
                    y={headerY - 15}
                    textAnchor="middle"
                    className="round-title"
                  >
                    {r}
                  </text>
                  <text
                    x={startX + i * (boxW + gapX) + boxW / 2}
                    y={headerY + 10}
                    textAnchor="middle"
                    className="round-match-count"
                  >
                    {matchCountText}
                  </text>
                </g>
              );
            })}

            {/* CONNECTORS - BACKEND DRIVEN USING nextMatchId */}
            {fixtures.map((match) => {
              if (!match.nextMatchId) return null;

              const currentPos = matchPositionMap.get(match.id);
              const nextPos = matchPositionMap.get(match.nextMatchId);

              if (!currentPos || !nextPos) return null;

              const { roundIndex: r1, matchIndex: m1 } = currentPos;
              const { roundIndex: r2, matchIndex: m2 } = nextPos;

              // Only draw left-to-right forward connections
              if (r2 <= r1) return null;

              const x1 = startX + r1 * (boxW + gapX) + boxW;
              const y1 = centerY(r1, m1);

              const nextBoxX = startX + r2 * (boxW + gapX);
              const y2 = centerY(r2, m2);

              // Connect to TEAM1(top) or TEAM2(bottom) slot visually
              const slotOffset =
                match.nextSlot === "TEAM2" ? boxH * 0.25 : -boxH * 0.25;
              const targetY = y2 + slotOffset;

              const midX = x1 + Math.min(40, (nextBoxX - x1) / 2);
              const endX = nextBoxX - 12;

              return (
                <path
                  key={`connector-${match.id}-${match.nextMatchId}`}
                  d={`M${x1} ${y1} L${midX} ${y1} L${midX} ${targetY} L${endX} ${targetY}`}
                  fill="none"
                  className="connector-line"
                />
              );
            })}

            {/* MATCH BOXES */}
            {roundsData.map((round, r) =>
              round.map((m, i) => {
                const x = startX + r * (boxW + gapX);
                const y = centerY(r, i) - boxH / 2;

                return (
                  <g
                    key={m.id}
                    className="match-box"
                    onClick={(e) => {
                      e.stopPropagation();

                      const popupWidth = 220;
                      let popupX = x + boxW + 10;
                      let popupY = centerY(r, i) - 40;

                      if (popupX + popupWidth > svgWidth) {
                        popupX = x - popupWidth - 10;
                      }

                      if (popupY + 100 > svgHeight) {
                        popupY = svgHeight - 110;
                      }
                      if (popupY < 0) {
                        popupY = 10;
                      }

                      setPopup({
                        x: popupX,
                        y: popupY,
                        ...m,
                      });
                    }}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={boxW}
                      height={boxH}
                      rx={14}
                      className="normal-box"
                    />

                    {/* TEAM 1 */}
                    <foreignObject
                      x={x + 10}
                      y={y + 7}
                      width={boxW - 20}
                      height={24}
                    >
                      <div className="team-row">
                        <FaUser
                          size={14}
                          style={{
                            color: getIconColor(m.team1, m.winner, m.team1),
                          }}
                        />
                        <span className="team-name">{short(m.team1)}</span>
                      </div>
                    </foreignObject>

                    {/* TEAM 2 */}
                    <foreignObject
                      x={x + 10}
                      y={y + 31}
                      width={boxW - 20}
                      height={24}
                    >
                      <div className="team-row">
                        <FaUser
                          size={14}
                          style={{
                            color: getIconColor(m.team2, m.winner, m.team1),
                          }}
                        />
                        <span className="team-name">{short(m.team2)}</span>
                      </div>
                    </foreignObject>
                  </g>
                );
              }),
            )}
          </svg>

          {/* WINNER POPUP */}
          {popup && (
            <div
              className="winner-popup"
              style={{
                left: popup.x,
                top: popup.y,
                position: "absolute",
              }}
            >
              {popup.team1 &&
                popup.team1.trim() !== "" &&
                popup.team1 !== "TBD" && (
                  <label>
                    <input
                      type="radio"
                      name={`winner-${popup.id}`}
                      checked={popup.winner === popup.team1}
                      onChange={() => setWinner(popup.id, popup.team1)}
                    />
                    {popup.team1}
                  </label>
                )}

              {popup.team2 &&
                popup.team2.trim() !== "" &&
                popup.team2 !== "TBD" && (
                  <label>
                    <input
                      type="radio"
                      name={`winner-${popup.id}`}
                      checked={popup.winner === popup.team2}
                      onChange={() => setWinner(popup.id, popup.team2)}
                    />
                    {popup.team2}
                  </label>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
