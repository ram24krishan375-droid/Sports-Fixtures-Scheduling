// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./ClearResultButton.css";

// const ClearResultButton: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleClear = async () => {
//     const confirmClear = window.confirm(
//       "Are you sure you want to clear all fixture results?",
//     );

//     if (!confirmClear) return;

//     try {
//       setLoading(true);

//       await axios.delete("http://localhost:8080/api/data/clearFixturesResult");

//       alert("Fixture results cleared successfully.");

//       //  Navigate to GanttChart page
//       navigate("/Ganttchart");
//     } catch (error) {
//       console.error("Error clearing fixtures:", error);
//       alert("Failed to clear fixture results ");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button className="clear-btn" onClick={handleClear} disabled={loading}>
//       {loading ? "Clearing..." : "Clear Result"}
//     </button>
//   );
// };

// export default ClearResultButton;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ClearResultButton.css";

const ClearResultButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const handleClear = async () => {
    try {
      setLoading(true);

      await axios.delete("http://localhost:8080/api/data/clearFixturesResult");

      setShowPopup(false);

      // Show success popup
      setShowSuccess(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/Ganttchart");
      }, 5000);
    } catch (error) {
      console.error("Error clearing fixtures:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="clear-btn"
        onClick={() => setShowPopup(true)}
        disabled={loading}
      >
        {loading ? "Clearing..." : "Clear Result"}
      </button>

      {/* Confirm Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Confirm Action</h3>
            <p>Are you sure you want to clear all fixture results?</p>

            <div className="popup-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={handleClear}
                disabled={loading}
              >
                {loading ? "Clearing..." : "Yes, Clear"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <div className="success-popup">
          Fixture results cleared successfully
        </div>
      )}
    </>
  );
};

export default ClearResultButton;
