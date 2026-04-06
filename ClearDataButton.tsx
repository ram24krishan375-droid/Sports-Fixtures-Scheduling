import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ClearDataButton.css";

const ClearDataButton: React.FC = () => {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClearData = async () => {
    try {
      setLoading(true);

      await axios.delete("http://localhost:8080/api/data/clear-all");

      setShowPopup(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/ExcelUpload");
      }, 5000);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setShowPopup(true)} className="clear-data-btn">
        CLEAR DATA
      </button>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Confirm Clear</h3>
            <p>Are you sure you want to delete all data?</p>

            <div className="popup-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={handleClearData}
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
        <div className="success-popup">All data cleared successfully</div>
      )}
    </>
  );
};

export default ClearDataButton;
