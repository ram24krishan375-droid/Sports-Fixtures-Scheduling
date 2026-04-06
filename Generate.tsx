// import React, { useState } from "react";
// import "./Generate.css";
// import { useNavigate } from "react-router-dom";

// const GenerateReportButton: React.FC = () => {
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [successPopup, setSuccessPopup] = useState(false);
//   const [errorPopup, setErrorPopup] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleClick = async () => {
//     setLoading(true);

//     try {
//       const response = await fetch(
//         "http://localhost:8080/api/fixtures/generate",
//         {
//           method: "POST",
//         },
//       );

//       if (!response.ok) {
//         throw new Error("Failed to generate fixtures");
//       }

//       await response.text();

//       // ✅ Spinner 5 sec
//       setTimeout(() => {
//         setLoading(false);
//         setSuccessPopup(true);

//         // ✅ Success popup 2 sec
//         setTimeout(() => {
//           setSuccessPopup(false);
//           navigate("/fixtures-generated");
//         }, 2000);
//       }, 5000);
//     } catch (error: any) {
//       setLoading(false);
//       setErrorMessage(error.message);
//       setErrorPopup(true);
//     }
//   };

//   return (
//     <>
//       <button className="generate-btn" onClick={handleClick}>
//         GENERATE FIXTURE
//       </button>

//       {/* ✅ Loading Spinner */}
//       {loading && (
//         <div className="loading-overlay">
//           <div className="loader"></div>
//           <p>Generating Fixtures...</p>
//         </div>
//       )}

//       {/* ✅ Success Popup */}
//       {successPopup && (
//         <div className="popup-overlay">
//           <div className="popup-box">
//             <h3 style={{ color: "green" }}>Success</h3>
//             <p>Fixture generated successfully</p>
//           </div>
//         </div>
//       )}

//       {/* ✅ Error Popup */}
//       {errorPopup && (
//         <div className="popup-overlay">
//           <div className="popup-box">
//             <h3 style={{ color: "red" }}>Error</h3>
//             <p>{errorMessage}</p>

//             <button className="popup-ok" onClick={() => setErrorPopup(false)}>
//               OK
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default GenerateReportButton;

// import React, { useState } from "react";
// import "./Generate.css";
// import { useNavigate } from "react-router-dom";

// const GenerateReportButton: React.FC = () => {
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [successPopup, setSuccessPopup] = useState(false);
//   const [errorPopup, setErrorPopup] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleClick = async () => {
//     setLoading(true);
//     setErrorPopup(false);
//     setSuccessPopup(false);
//     setErrorMessage("");

//     try {
//       const response = await fetch(
//         "http://localhost:8080/api/fixtures/generate",
//         {
//           method: "POST",
//         },
//       );

//       const message = await response.text(); // ✅ backend response message

//       if (!response.ok) {
//         throw new Error(message || "Failed to generate fixtures");
//       }

//       // ✅ Show loading spinner for 5 sec
//       setTimeout(() => {
//         setLoading(false);
//         setSuccessPopup(true);

//         // ✅ Show success popup for 2 sec then navigate
//         setTimeout(() => {
//           setSuccessPopup(false);
//           navigate("/fixtures-generated");
//         }, 2000);
//       }, 5000);
//     } catch (error: any) {
//       setLoading(false);
//       setErrorMessage(error.message || "Something went wrong");
//       setErrorPopup(true);
//     }
//   };

//   return (
//     <>
//       <button className="generate-btn" onClick={handleClick}>
//         GENERATE FIXTURE
//       </button>

//       {/* Loading Spinner */}
//       {loading && (
//         <div className="loading-overlay">
//           <div className="loader"></div>
//           <p>Generating Fixtures...</p>
//         </div>
//       )}

//       {/* Success Popup */}
//       {successPopup && (
//         <div className="popup-overlay">
//           <div className="popup-box">
//             <h3 style={{ color: "green" }}>Success</h3>
//             <p>Fixture generated successfully</p>
//           </div>
//         </div>
//       )}

//       {/* Error Popup */}
//       {errorPopup && (
//         <div className="popup-overlay">
//           <div className="popup-box">
//             <h3 style={{ color: "red" }}>Error</h3>
//             <p>{errorMessage}</p>

//             <button className="popup-ok" onClick={() => setErrorPopup(false)}>
//               OK
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default GenerateReportButton;

import React, { useState } from "react";
import "./Generate.css";
import { useNavigate } from "react-router-dom";

const GenerateReportButton: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleClick = async () => {
    setLoading(true);
    setErrorPopup(false);
    setSuccessPopup(false);
    setErrorMessages([]);

    try {
      const response = await fetch(
        "http://localhost:8080/api/fixtures/generate",
        {
          method: "POST",
        },
      );

      const message = await response.text();

      if (!response.ok) {
        const errors = message
          .split(/\n|,/)
          .map((msg) => msg.trim())
          .filter((msg) => msg.length > 0);

        throw new Error(JSON.stringify(errors));
      }

      setTimeout(() => {
        setLoading(false);
        setSuccessPopup(true);

        setTimeout(() => {
          setSuccessPopup(false);
          navigate("/fixtures-generated");
        }, 2000);
      }, 5000);
    } catch (error: any) {
      setLoading(false);

      let parsedErrors: string[] = [];

      try {
        parsedErrors = JSON.parse(error.message);
      } catch {
        parsedErrors = [error.message || "Something went wrong"];
      }

      setErrorMessages(parsedErrors);
      setErrorPopup(true);
    }
  };

  return (
    <>
      <button className="generate-btn" onClick={handleClick}>
        GENERATE FIXTURE
      </button>

      {/* Loading Spinner */}
      {loading && (
        <div className="loading-overlay">
          <div className="loader"></div>
          <p>Generating Fixtures...</p>
        </div>
      )}

      {/* Success Popup */}
      {successPopup && (
        <div className="popup-overlay">
          <div className="popup-box success-popup">
            <p className="popup-message">Fixture generated successfully</p>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {errorPopup && (
        <div className="popup-overlay">
          <div className="popup-box error-popup">
            <h3 className="popup-title">Error</h3>

            <div className="error-list-container">
              <ol className="error-list">
                {errorMessages.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ol>
            </div>

            <button className="popup-ok" onClick={() => setErrorPopup(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GenerateReportButton;
