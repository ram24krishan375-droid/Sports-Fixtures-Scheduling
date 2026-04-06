import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import ClearDataButton from "./ClearDataButton";
import "./ExcelDetails.css";

interface Fixture {
  id: string;
  date: string;
  gameName: string;
  teamName: string;
  status: string | null;
  venue: string | null;
  startTime: string | null;
}

interface Venue {
  id: string;
  venueName: string;
}

interface Props {
  onClose?: () => void;
}

const BASE_URL = "http://localhost:8080/api/excelDetails";
const VENUE_API = "http://localhost:8080/api/venues";

const FixturesModal: React.FC<Props> = ({ onClose }) => {
  const navigate = useNavigate();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [allFixtures, setAllFixtures] = useState<Fixture[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Fixture>>({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [venueDropdownId, setVenueDropdownId] = useState<string | null>(null);
  const [timeDropdownId, setTimeDropdownId] = useState<string | null>(null);
  const [venueList, setVenueList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nextError, setNextError] = useState<string>("");

  const timeSlots = [
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
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "20:00",
  ];

  const calendarRef = useRef<HTMLDivElement>(null);
  const venueDropdownRef = useRef<HTMLDivElement>(null);
  const timeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAllFixtures();
    fetchVenues();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (calendarRef.current && !calendarRef.current.contains(target)) {
        setShowCalendar(false);
      }

      if (
        venueDropdownRef.current &&
        !venueDropdownRef.current.contains(target)
      ) {
        setVenueDropdownId(null);
      }

      if (
        timeDropdownRef.current &&
        !timeDropdownRef.current.contains(target)
      ) {
        setTimeDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchVenues = async () => {
    try {
      const res = await axios.get<Venue[]>(VENUE_API);
      setVenueList(res.data.map((v) => v.venueName));
    } catch (err) {
      console.error("Failed to fetch venues", err);
    }
  };

  const fetchAllFixtures = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get<Fixture[]>(BASE_URL);
      setAllFixtures(res.data);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const futureDates = res.data
        .map((f) => f.date)
        .filter((d) => {
          const fixtureDate = new Date(d);
          fixtureDate.setHours(0, 0, 0, 0);
          return fixtureDate >= today;
        })
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      const nearestDate = futureDates[0] || res.data[0]?.date;

      if (nearestDate) {
        await handleDateClick(nearestDate);
      }
    } catch (err) {
      console.error("Error fetching fixtures", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFixturesByDate = async (date: string) => {
    setIsLoading(true);
    try {
      const res = await axios.get<Fixture[]>(`${BASE_URL}/by-date/${date}`);
      setFixtures(res.data);
      setSelectedGame(null);
      setEditId(null);
    } catch (err) {
      console.error("Failed to fetch fixtures", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateClick = async (date: string) => {
    setSelectedDate(date);
    setNextError("");
    await fetchFixturesByDate(date);
    setShowCalendar(false);
  };

  const handleEdit = (fixture: Fixture) => {
    setEditId(fixture.id);
    setEditData({ ...fixture });
    setVenueDropdownId(null);
    setTimeDropdownId(null);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const handleUpdateSingleFixture = async (id: string) => {
    setIsLoading(true);
    try {
      await axios.put(`${BASE_URL}/${id}`, editData);
      setEditId(null);
      setEditData({});
      setNextError("");

      if (selectedDate) {
        await fetchFixturesByDate(selectedDate);
      }

      const allRes = await axios.get<Fixture[]>(BASE_URL);
      setAllFixtures(allRes.data);
    } catch (err) {
      console.error("Failed to update fixture", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGameTime = async (
    date: string,
    gameName: string,
    time: string,
  ) => {
    setIsLoading(true);
    try {
      await axios.put(`${BASE_URL}/game/time`, null, {
        params: { date, gameName, time },
      });

      setNextError("");

      if (selectedDate) {
        await fetchFixturesByDate(selectedDate);
      }

      const allRes = await axios.get<Fixture[]>(BASE_URL);
      setAllFixtures(allRes.data);

      setTimeDropdownId(null);
    } catch (err) {
      console.error("Failed to update game time", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGameVenue = async (
    date: string,
    gameName: string,
    venue: string,
  ) => {
    setIsLoading(true);
    try {
      await axios.put(`${BASE_URL}/game/venue`, null, {
        params: { date, gameName, venue },
      });

      if (selectedDate) {
        await fetchFixturesByDate(selectedDate);
      }

      const allRes = await axios.get<Fixture[]>(BASE_URL);
      setAllFixtures(allRes.data);

      setVenueDropdownId(null);
    } catch (err) {
      console.error("Failed to update game venue", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const fixtureToDelete = fixtures.find((f) => f.id === id);

    if (
      !fixtureToDelete ||
      !window.confirm(`Delete ${fixtureToDelete.teamName}?`)
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await axios.delete(`${BASE_URL}/${id}`);

      if (selectedDate) {
        await fetchFixturesByDate(selectedDate);
      }

      const allRes = await axios.get<Fixture[]>(BASE_URL);
      setAllFixtures(allRes.data);
    } catch (err) {
      console.error("Failed to delete fixture", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = () => {
    setNextError("");
    if (selectedDate) fetchFixturesByDate(selectedDate);
  };

  const handleNext = async () => {
    setIsLoading(true);

    try {
      const res = await axios.get<Fixture[]>(BASE_URL);
      const latestFixtures = res.data;

      const hasMissingTime = latestFixtures.some(
        (f) => !f.startTime || f.startTime.trim() === "",
      );

      if (hasMissingTime) {
        setNextError(
          "Please set time for all fixtures in all dates before moving to next page.",
        );
        return;
      }

      setNextError("");
      onClose ? onClose() : navigate("/Ganttchart");
    } catch (err) {
      console.error("Failed to validate fixtures", err);
      setNextError("Unable to validate fixtures. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const uniqueDates = Array.from(new Set(allFixtures.map((f) => f.date))).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  const uniqueGameNames = Array.from(new Set(fixtures.map((f) => f.gameName)));

  const filteredFixtures = fixtures.filter((f) =>
    selectedGame ? f.gameName === selectedGame : true,
  );

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${d.getFullYear().toString().slice(-2)}`;
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return "Set Time";

    try {
      if (timeStr.includes(":")) {
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      }
      return timeStr;
    } catch {
      return timeStr;
    }
  };

  const getStatusClass = (status: string | null) => {
    if (!status) return "status-none";
    return `status-${status.toLowerCase()}`;
  };

  return (
    <>
      <Header />

      <div className="modal-overlay">
        <div className="modal-box">
          <div className="modal-header">
            <h2>
              {selectedDate
                ? `DATE: ${formatDate(selectedDate)}`
                : "Tournament Details"}
              {isLoading && <span className="loading-spinner" />}
            </h2>

            <div className="header-actions">
              <ClearDataButton onClear={handleClearData} />

              <button
                className="calendar-btn"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                📅
              </button>

              {showCalendar && (
                <div ref={calendarRef} className="calendar-dropdown">
                  {uniqueDates.length === 0 ? (
                    <div className="calendar-empty">No Dates Available</div>
                  ) : (
                    uniqueDates.map((date) => (
                      <button
                        key={date}
                        className={`calendar-item ${
                          date === selectedDate ? "active" : ""
                        }`}
                        onClick={() => handleDateClick(date)}
                      >
                        {formatDate(date)}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedDate && uniqueGameNames.length > 0 && (
            <div className="game-filters">
              <span className="filter-label">Filter by Game:</span>

              <button
                className={`filter-btn ${!selectedGame ? "active" : ""}`}
                onClick={() => setSelectedGame(null)}
              >
                All Games
              </button>

              {uniqueGameNames.map((game) => (
                <button
                  key={game}
                  className={`filter-btn ${selectedGame === game ? "active" : ""}`}
                  onClick={() => setSelectedGame(game)}
                >
                  {game}
                </button>
              ))}
            </div>
          )}

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Game</th>
                  <th>Team</th>
                  <th>Status</th>
                  <th>Venue</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredFixtures.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-state">
                      {isLoading ? "Loading..." : "No Fixtures Found"}
                    </td>
                  </tr>
                ) : (
                  filteredFixtures.map((f) => (
                    <tr key={f.id}>
                      <td>{formatDate(f.date)}</td>
                      <td>{f.gameName}</td>
                      <td>{f.teamName}</td>

                      <td>
                        {editId === f.id ? (
                          <input
                            type="text"
                            value={editData.status || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                status: e.target.value,
                              })
                            }
                            placeholder="Status"
                            className="edit-input"
                          />
                        ) : (
                          <span
                            className={`status-badge ${getStatusClass(f.status)}`}
                          >
                            {f.status || "-"}
                          </span>
                        )}
                      </td>

                      <td className="dropdown-cell">
                        {editId === f.id ? (
                          <input
                            type="text"
                            value={editData.venue || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                venue: e.target.value,
                              })
                            }
                            placeholder="Venue"
                            className="edit-input"
                          />
                        ) : (
                          <>
                            <button
                              className={`action-btn ${
                                f.venue ? "venue-set" : "venue-unset"
                              }`}
                              onClick={() => {
                                setVenueDropdownId(
                                  venueDropdownId === f.id ? null : f.id,
                                );
                                setTimeDropdownId(null);
                              }}
                            >
                              {f.venue || "+ Set Venue"}
                            </button>

                            {venueDropdownId === f.id && (
                              <div
                                ref={venueDropdownRef}
                                className="dropdown-menu"
                              >
                                <div className="dropdown-header">
                                  Set for all {f.gameName} matches
                                </div>

                                {venueList.map((v) => (
                                  <button
                                    key={v}
                                    className={`dropdown-item ${
                                      f.venue === v ? "selected" : ""
                                    }`}
                                    onClick={() =>
                                      handleUpdateGameVenue(
                                        f.date,
                                        f.gameName,
                                        v,
                                      )
                                    }
                                  >
                                    {v}
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </td>

                      <td className="dropdown-cell">
                        {editId === f.id ? (
                          <input
                            type="time"
                            value={editData.startTime || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                startTime: e.target.value,
                              })
                            }
                            step="1800"
                            className="edit-input"
                          />
                        ) : (
                          <>
                            <button
                              className={`action-btn ${
                                f.startTime ? "time-set" : "time-unset"
                              }`}
                              onClick={() => {
                                setTimeDropdownId(
                                  timeDropdownId === f.id ? null : f.id,
                                );
                                setVenueDropdownId(null);
                              }}
                            >
                              {f.startTime
                                ? formatTime(f.startTime)
                                : "+ Set Time"}
                            </button>

                            {timeDropdownId === f.id && (
                              <div
                                ref={timeDropdownRef}
                                className="dropdown-menu"
                              >
                                <div className="dropdown-header">
                                  Set for all {f.gameName} matches
                                </div>

                                {timeSlots.map((time) => (
                                  <button
                                    key={time}
                                    className={`dropdown-item ${
                                      f.startTime === time ? "selected" : ""
                                    }`}
                                    onClick={() =>
                                      handleUpdateGameTime(
                                        f.date,
                                        f.gameName,
                                        time,
                                      )
                                    }
                                  >
                                    {formatTime(time)}
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </td>

                      <td>
                        {editId === f.id ? (
                          <div className="action-group">
                            <button
                              className="btn-save"
                              onClick={() => handleUpdateSingleFixture(f.id)}
                              disabled={isLoading}
                            >
                              Save
                            </button>

                            <button
                              className="btn-cancel"
                              onClick={handleCancelEdit}
                              disabled={isLoading}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="action-group">
                            <button
                              className="btn-edit"
                              onClick={() => handleEdit(f)}
                              disabled={isLoading}
                            >
                              Edit
                            </button>

                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(f.id)}
                              disabled={isLoading}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {nextError && <div className="next-error-message">{nextError}</div>}

          <div className="modal-footer">
            <button
              className="btn-next"
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FixturesModal;
