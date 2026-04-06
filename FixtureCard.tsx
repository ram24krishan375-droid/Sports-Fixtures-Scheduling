// // FixtureCard.jsx
// import React from "react";

// export default function FixtureCard({ open, onClose, data }) {
//   if (!open) return null;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         background: "rgba(0,0,0,0.4)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 1000,
//       }}
//       onClick={onClose}
//     >
//       <div
//         style={{
//           background: "white",
//           padding: "20px",
//           borderRadius: "12px",
//           width: "340px",
//           boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h2 style={{ marginBottom: "10px" }}>{data.game}</h2>

//         <p>
//           <strong>Total Teams:</strong> {data.teams}
//         </p>
//         <p>
//           <strong>Time:</strong> {data.time}
//         </p>
//         <p>
//           <strong>Venue:</strong> {data.venue}
//         </p>

//         <button
//           onClick={onClose}
//           style={{
//             marginTop: "20px",
//             width: "100%",
//             padding: "10px",
//             border: "none",
//             borderRadius: "8px",
//             background: "#007bff",
//             color: "white",
//             cursor: "pointer",
//             fontSize: "16px",
//           }}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";

export default function FixtureCard({ data, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  const [edited, setEdited] = useState({
    time: data.time,
    venue: data.venue,
  });

  const handleSave = () => {
    onUpdate({ ...data, ...edited });
    setIsEditing(false);
  };

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        width: "350px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        margin: "10px",
      }}
    >
      {/* Title */}
      <h2 style={{ marginBottom: "10px" }}>{data.game}</h2>

      {/* Total Teams */}
      <p>
        <strong>Total Teams:</strong> {data.teams}
      </p>

      {/* Time */}
      {isEditing ? (
        <input
          type="text"
          value={edited.time}
          onChange={(e) => setEdited({ ...edited, time: e.target.value })}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      ) : (
        <p>
          <strong>Time:</strong> {data.time}
        </p>
      )}

      {/* Venue */}
      {isEditing ? (
        <input
          type="text"
          value={edited.venue}
          onChange={(e) => setEdited({ ...edited, venue: e.target.value })}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      ) : (
        <p>
          <strong>Venue:</strong> {data.venue}
        </p>
      )}

      {/* Buttons */}
      {isEditing ? (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: "10px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Save
          </button>

          <button
            onClick={() => setIsEditing(false)}
            style={{
              flex: 1,
              padding: "10px",
              background: "#555",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "10px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Edit
        </button>
      )}
    </div>
  );
}
