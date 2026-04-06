import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SettingsDashboard.css";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

type VenueType = {
  id: string;
  venueName: string;
};

type TitleType = {
  id: string;
  title: string;
  subTitle: string;
};

const BASE_URL = "http://localhost:8080/api/venues";
const TITLE_URL = "http://localhost:8080/api/titles";

export default function Settings() {
  const navigate = useNavigate();

  const [menu, setMenu] = useState("general");
  const [venueMenu, setVenueMenu] = useState<"add" | "show">("add");

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [titleId, setTitleId] = useState<string | null>(null);

  const [venue, setVenue] = useState("");
  const [venues, setVenues] = useState<VenueType[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const [popup, setPopup] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* ---------------- Fetch Venues ---------------- */
  const fetchVenues = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setVenues(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- Fetch Title ---------------- */
  const fetchTitle = async () => {
    try {
      const res = await axios.get(TITLE_URL);

      if (res.data && res.data.length > 0) {
        const data: TitleType = res.data[0];
        setTitle(data.title);
        setSubtitle(data.subTitle);
        setTitleId(data.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVenues();
    fetchTitle();
  }, []);

  /* ---------------- Save / Update Title ---------------- */
  const handleSave = async () => {
    if (!title.trim()) return;

    try {
      if (titleId) {
        await axios.put(`${TITLE_URL}/${titleId}`, {
          title: title,
          subTitle: subtitle,
        });

        setPopup("Tournament Updated Successfully");
      } else {
        const res = await axios.post(TITLE_URL, {
          title: title,
          subTitle: subtitle,
        });

        setTitleId(res.data.id);
        setPopup("Tournament Created Successfully");
      }

      setTimeout(() => setPopup(""), 1200);
      fetchTitle();
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- Delete Title ---------------- */
  const handleDeleteTitle = async () => {
    if (!titleId) return;

    try {
      await axios.delete(`${TITLE_URL}/${titleId}`);

      setTitle("");
      setSubtitle("");
      setTitleId(null);

      setPopup("Tournament Deleted Successfully");
      setTimeout(() => setPopup(""), 1200);
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- Add / Update Venue ---------------- */
  const handleAddVenue = async () => {
    if (!venue.trim()) return;

    try {
      if (editId) {
        await axios.put(`${BASE_URL}/${editId}`, {
          venueName: venue,
        });

        setPopup("Venue Updated Successfully");
      } else {
        await axios.post(BASE_URL, {
          venueName: venue,
        });

        setPopup("Venue Added Successfully");
      }

      setVenue("");
      setEditId(null);

      setTimeout(() => setPopup(""), 1200);
      fetchVenues();
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- Edit Venue ---------------- */
  const handleEditVenue = (v: VenueType) => {
    setVenue(v.venueName);
    setEditId(v.id);

    setMenu("venue");
    setVenueMenu("add");
  };

  /* ---------------- Delete Venue ---------------- */
  const handleDeleteVenue = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(`${BASE_URL}/${deleteId}`);

      setPopup("Venue Deleted Successfully");
      setTimeout(() => setPopup(""), 1200);

      fetchVenues();
    } catch (error) {
      console.log(error);
    }

    setDeleteId(null);
  };

  return (
    <div className="settings-dashboard">
      <Header />

      {popup && <div className="popup-message">{popup}</div>}

      {deleteId && (
        <div className="modal-overlay">
          <div className="confirm-popup">
            <h4>Confirm Delete</h4>
            <p>Are you sure you want to delete this venue?</p>

            <div className="confirm-actions">
              <button className="yes-btn" onClick={handleDeleteVenue}>
                Yes, Delete
              </button>

              <button className="no-btn" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="settings-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-top">
            <h2 className="logo">Settings</h2>

            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>

          <div className="menu">
            <p
              className={menu === "general" ? "active" : ""}
              onClick={() => setMenu("general")}
            >
              General
            </p>

            <p
              className={menu === "venue" ? "active" : ""}
              onClick={() => {
                setMenu("venue");
                setVenueMenu("add");
              }}
            >
              Venue Management
            </p>
          </div>
        </aside>

        {/* Content */}
        <main className="content">
          {/* General Settings */}
          {menu === "general" && (
            <div className="card">
              <div className="card-header">
                <h3>Tournament Details</h3>
                <p>Manage tournament title and subtitle information</p>
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  value={title}
                  placeholder="Enter tournament title"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Subtitle</label>
                <input
                  value={subtitle}
                  placeholder="Enter tournament subtitle"
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </div>

              <div className="button-row">
                <button className="save-btn" onClick={handleSave}>
                  Save Changes
                </button>

                <button
                  className="delete-title-btn"
                  onClick={handleDeleteTitle}
                >
                  Delete Tournament
                </button>
              </div>
            </div>
          )}

          {/* Venue Management */}
          {menu === "venue" && (
            <div className="card venue-card">
              <div className="card-header">
                <h3>Venue Management</h3>
                <p>Add, update, and manage tournament venues</p>
              </div>

              <div className="submenu">
                <span
                  className={venueMenu === "add" ? "active" : ""}
                  onClick={() => setVenueMenu("add")}
                >
                  {editId ? "Update Venue" : "Add Venue"}
                </span>

                <span
                  className={venueMenu === "show" ? "active" : ""}
                  onClick={() => {
                    setVenueMenu("show");
                    fetchVenues();
                  }}
                >
                  Show Venues
                </span>
              </div>

              {venueMenu === "add" && (
                <div className="venue-form">
                  <div className="form-group">
                    <label>Venue Name</label>
                    <input
                      value={venue}
                      placeholder="Enter venue name"
                      onChange={(e) => setVenue(e.target.value)}
                    />
                  </div>

                  <button className="save-btn" onClick={handleAddVenue}>
                    {editId ? "Update Venue" : "Add Venue"}
                  </button>
                </div>
              )}

              {venueMenu === "show" && (
                <div className="venue-list">
                  {venues.length === 0 ? (
                    <div className="empty-state">No venues available</div>
                  ) : (
                    venues.map((v) => (
                      <div key={v.id} className="venue-item">
                        <div className="venue-info">
                          <span className="venue-name">{v.venueName}</span>
                        </div>

                        <div className="venue-actions">
                          <button
                            className="edit-btn"
                            onClick={() => handleEditVenue(v)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => setDeleteId(v.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
