// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import "./VENUES.css";
// // import Header from "./Header";

// // type Venue = {
// //   id: string;
// //   venueName: string;
// // };

// // const BASE_URL = "http://localhost:8080/api/venues";

// // export default function VENUES({ onBack }: { onBack?: () => void }) {
// //   const [venues, setVenues] = useState<Venue[]>([]);
// //   const [showModal, setShowModal] = useState(false);
// //   const [name, setName] = useState("");
// //   const [editId, setEditId] = useState<string | null>(null);

// //   /* ================= FETCH ALL ================= */
// //   const fetchVenues = async () => {
// //     try {
// //       const res = await axios.get<Venue[]>(BASE_URL);
// //       setVenues(res.data);
// //     } catch (err) {
// //       console.error("Failed to fetch venues:", err);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchVenues();
// //   }, []);

// //   /* ================= SAVE (ADD / UPDATE) ================= */
// //   const saveVenue = async () => {
// //     if (!name.trim()) return;

// //     try {
// //       if (editId) {
// //         await axios.put(`${BASE_URL}/${editId}`, { venueName: name });
// //       } else {
// //         await axios.post(BASE_URL, { venueName: name });
// //       }

// //       setName("");
// //       setEditId(null);
// //       setShowModal(false);
// //       fetchVenues();
// //     } catch (err) {
// //       console.error("Error saving venue:", err);
// //       alert("Failed to save venue. Check console for details.");
// //     }
// //   };

// //   /* ================= EDIT ================= */
// //   const handleEdit = (venue: Venue) => {
// //     setEditId(venue.id);
// //     setName(venue.venueName);
// //     setShowModal(true);
// //   };

// //   /* ================= DELETE ================= */
// //   const handleDelete = async (id: string) => {
// //     if (window.confirm("Delete this venue?")) {
// //       try {
// //         await axios.delete(`${BASE_URL}/${id}`);
// //         fetchVenues();
// //       } catch (err) {
// //         console.error("Failed to delete venue:", err);
// //       }
// //     }
// //   };

// //   /* ================= DELETE ALL ================= */
// //   const clearVenues = async () => {
// //     if (window.confirm("Delete all venues?")) {
// //       try {
// //         await axios.delete(`${BASE_URL}/delete-all`);
// //         fetchVenues();
// //       } catch (err) {
// //         console.error("Failed to clear venues:", err);
// //       }
// //     }
// //   };

// //   const handleBack = () => {
// //     if (onBack) onBack();
// //     else window.history.back();
// //   };

// //   return (
// //     <div className="venues-page">
// //       <div className="venues-container">
// //         <Header />

// //         {/* Top Bar */}
// //         <div className="venues-topbar">
// //           <h2 className="venues-title">Venues</h2>
// //           <div className="venues-top-buttons">
// //             <button className="venues-clear" onClick={clearVenues}>
// //               Clear
// //             </button>
// //             <button className="venues-back" onClick={handleBack}>
// //               Back
// //             </button>
// //           </div>
// //         </div>

// //         {/* Actions */}
// //         <div className="venues-actions">
// //           <button
// //             className="venues-add"
// //             onClick={() => {
// //               setName("");
// //               setEditId(null);
// //               setShowModal(true);
// //             }}
// //           >
// //             + Add Venue
// //           </button>
// //         </div>

// //         {/* Table */}
// //         <div className="venues-table-wrapper">
// //           <table className="venues-table">
// //             <thead>
// //               <tr>
// //                 <th>#</th>
// //                 <th>Venue Name</th>
// //                 <th>Actions</th>
// //               </tr>
// //             </thead>

// //             <tbody>
// //               {venues.length === 0 ? (
// //                 <tr>
// //                   <td colSpan={3} className="venues-empty">
// //                     No venues added
// //                   </td>
// //                 </tr>
// //               ) : (
// //                 venues.map((v, index) => (
// //                   <tr key={v.id}>
// //                     <td>{index + 1}</td>
// //                     <td>{v.venueName}</td>
// //                     <td className="venues-actions-cell">
// //                       <button
// //                         className="venues-edit-btn"
// //                         onClick={() => handleEdit(v)}
// //                       >
// //                         Edit
// //                       </button>
// //                       <button
// //                         className="venues-delete-btn"
// //                         onClick={() => handleDelete(v.id)}
// //                       >
// //                         Delete
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* Modal */}
// //         {showModal && (
// //           <div className="venues-modal-backdrop">
// //             <div className="venues-modal">
// //               <h3>{editId ? "Edit Venue" : "Add Venue"}</h3>

// //               <label className="venues-label">
// //                 Venue Name
// //                 <input
// //                   className="venues-input"
// //                   value={name}
// //                   onChange={(e) => setName(e.target.value)}
// //                   placeholder="Ex: Main Stadium"
// //                 />
// //               </label>

// //               <div className="venues-modal-actions">
// //                 <button
// //                   className="venues-btn-secondary"
// //                   onClick={() => setShowModal(false)}
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button className="venues-btn-primary" onClick={saveVenue}>
// //                   Save
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./VENUES.css";
// import Header from "./Header";

// type Venue = {
//   id: string;
//   venueName: string;
// };

// const BASE_URL = "http://localhost:8080/api/venues";

// export default function VENUES({ onBack }: { onBack?: () => void }) {
//   const [venues, setVenues] = useState<Venue[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [name, setName] = useState("");
//   const [editId, setEditId] = useState<string | null>(null);

//   /* ================= FETCH ================= */
//   const fetchVenues = async () => {
//     try {
//       const res = await axios.get<Venue[]>(BASE_URL);
//       setVenues(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchVenues();
//   }, []);

//   /* ================= SAVE ================= */
//   const saveVenue = async () => {
//     if (!name.trim()) return;

//     try {
//       if (editId) {
//         await axios.put(`${BASE_URL}/${editId}`, { venueName: name });
//       } else {
//         await axios.post(BASE_URL, { venueName: name });
//       }

//       setName("");
//       setEditId(null);
//       setShowModal(false);
//       fetchVenues();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* ================= EDIT ================= */
//   const handleEdit = (venue: Venue) => {
//     setEditId(venue.id);
//     setName(venue.venueName);
//     setShowModal(true);
//   };

//   /* ================= DELETE ================= */
//   const handleDelete = async (id: string) => {
//     if (window.confirm("Delete this venue?")) {
//       await axios.delete(`${BASE_URL}/${id}`);
//       fetchVenues();
//     }
//   };

//   /* ================= CLEAR ================= */
//   const clearVenues = async () => {
//     if (window.confirm("Delete all venues?")) {
//       await axios.delete(`${BASE_URL}/delete-all`);
//       fetchVenues();
//     }
//   };

//   const handleBack = () => {
//     if (onBack) onBack();
//     else window.history.back();
//   };

//   return (
//     <div className="venues-page">
//       <Header />

//       <div className="venues-container">
//         {/* Header */}
//         <div className="venues-top">
//           <h2>Venues</h2>

//           <div className="venues-buttons">
//             <button className="btn-clear" onClick={clearVenues}>
//               Clear
//             </button>

//             <button className="btn-back" onClick={handleBack}>
//               Back
//             </button>
//           </div>
//         </div>

//         {/* Add Button */}
//         <div className="venues-actions">
//           <button
//             className="btn-add"
//             onClick={() => {
//               setName("");
//               setEditId(null);
//               setShowModal(true);
//             }}
//           >
//             + Add Venue
//           </button>
//         </div>

//         {/* Table */}
//         <table className="venues-table">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Venue Name</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {venues.length === 0 ? (
//               <tr>
//                 <td colSpan={3} className="empty">
//                   No venues added
//                 </td>
//               </tr>
//             ) : (
//               venues.map((v, index) => (
//                 <tr key={v.id}>
//                   <td>{index + 1}</td>
//                   <td>{v.venueName}</td>

//                   <td>
//                     <button className="btn-edit" onClick={() => handleEdit(v)}>
//                       Edit
//                     </button>

//                     <button
//                       className="btn-delete"
//                       onClick={() => handleDelete(v.id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ================= MODAL ================= */}

//       {showModal && (
//         <div className="modal-overlay" onClick={() => setShowModal(false)}>
//           <div className="modal-box" onClick={(e) => e.stopPropagation()}>
//             <h3>{editId ? "Edit Venue" : "Add Venue"}</h3>

//             <input
//               className="modal-input"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Enter venue name"
//             />

//             <div className="modal-buttons">
//               <button
//                 className="btn-cancel"
//                 onClick={() => setShowModal(false)}
//               >
//                 Cancel
//               </button>

//               <button className="btn-save" onClick={saveVenue}>
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VENUES.css";
import Header from "./Header";

type Venue = {
  id: string;
  venueName: string;
};

const BASE_URL = "http://localhost:8080/api/venues";

export default function VENUES() {
  const [venues, setVenues] = useState<Venue[]>([]);

  const [showTitle, setShowTitle] = useState(false);
  const [showSubTitle, setShowSubTitle] = useState(false);
  const [showAddVenue, setShowAddVenue] = useState(false);

  const [name, setName] = useState("");

  /* ================= FETCH ================= */

  const fetchVenues = async () => {
    const res = await axios.get(BASE_URL);
    setVenues(res.data);
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  /* ================= SAVE ================= */

  const saveVenue = async () => {
    if (!name.trim()) return;

    await axios.post(BASE_URL, { venueName: name });

    setName("");
    setShowAddVenue(false);
    fetchVenues();
  };

  return (
    <div className="venues-page">
      <Header />

      {/* ================= CORNER BUTTON ================= */}

      <button className="corner-title" onClick={() => setShowTitle(true)}>
        Title
      </button>

      {/* ================= TITLE POPUP ================= */}

      {showTitle && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Title</h2>

            <button
              className="popup-btn"
              onClick={() => {
                setShowTitle(false);
                setShowSubTitle(true);
              }}
            >
              Sub Title
            </button>

            <button className="close-btn" onClick={() => setShowTitle(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= SUB TITLE POPUP ================= */}

      {showSubTitle && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Sub Title</h2>

            <button
              className="popup-btn"
              onClick={() => {
                setShowSubTitle(false);
                setShowAddVenue(true);
              }}
            >
              Add Venue
            </button>

            <button
              className="close-btn"
              onClick={() => setShowSubTitle(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= ADD VENUE POPUP ================= */}

      {showAddVenue && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Add Venue</h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter venue name"
              className="popup-input"
            />

            <button className="popup-btn" onClick={saveVenue}>
              Save
            </button>

            <button
              className="close-btn"
              onClick={() => setShowAddVenue(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= VENUE LIST ================= */}

      <div className="venue-list">
        <h2>Venues</h2>

        {venues.length === 0 ? (
          <p>No venues added</p>
        ) : (
          venues.map((v, i) => (
            <div key={v.id} className="venue-item">
              {i + 1}. {v.venueName}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
