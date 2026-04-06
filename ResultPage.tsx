// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Header from "./Header";
// import "./ResultPage.css";

// interface TournamentDate {
//   id: string;
//   date: string;
// }

// const GameListPage: React.FC = () => {
//   const [dates, setDates] = useState<TournamentDate[]>([]);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [games, setGames] = useState<string[]>([]);
//   const [selectedGame, setSelectedGame] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Load tournament dates
//   useEffect(() => {
//     axios
//       .get("http://localhost:8080/api/tournament-dates")
//       .then((res) => setDates(res.data))
//       .catch((err) => console.error("Date fetch error:", err));
//   }, []);

//   // Load games by selected date
//   useEffect(() => {
//     if (!selectedDate) {
//       setGames([]);
//       return;
//     }

//     axios
//       .get(`http://localhost:8080/api/games/date/${selectedDate}`)
//       .then((res) => {
//         setGames(res.data);
//         setSelectedGame("");
//       })
//       .catch((err) => {
//         console.error("Games fetch error:", err);
//         setGames([]);
//       });
//   }, [selectedDate]);

//   // Download PDF
//   const handleDownload = async () => {
//     if (!selectedDate || !selectedGame) {
//       alert("Please select date and game");
//       return;
//     }

//     try {
//       setLoading(true);

//       const formattedDate = new Date(selectedDate).toISOString().split("T")[0];

//       const response = await axios.get(
//         "http://localhost:8080/api/fixtures/pdf",
//         {
//           params: {
//             gameName: selectedGame.trim(),
//             date: formattedDate,
//           },
//           responseType: "blob",
//         },
//       );

//       const blob = new Blob([response.data], {
//         type: "application/pdf",
//       });

//       const url = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `fixture_${selectedGame}_${formattedDate}.pdf`;

//       document.body.appendChild(link);
//       link.click();

//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("PDF Download Error:", error);
//       alert("PDF download failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Header />

//       <div className="result-container with-header">
//         <div className="game-card">
//           <h2 className="page-title">Tournament Games</h2>

//           {/* Date Dropdown */}
//           <select
//             className="dropdown"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//           >
//             <option value="">Select Tournament Date</option>
//             {dates.map((item) => (
//               <option key={item.id} value={item.date}>
//                 {item.date}
//               </option>
//             ))}
//           </select>

//           {/* Game Count */}
//           {selectedDate && (
//             <div className="game-count">Total Games : {games.length}</div>
//           )}

//           {/* Game Buttons */}
//           {selectedDate && games.length > 0 && (
//             <div className="game-grid">
//               {games.map((game, index) => (
//                 <button
//                   key={index}
//                   className={`game-btn ${
//                     selectedGame === game ? "active" : ""
//                   }`}
//                   onClick={() => setSelectedGame(game)}
//                 >
//                   {game}
//                 </button>
//               ))}
//             </div>
//           )}

//           {/* Selected Game */}
//           {selectedGame && (
//             <div className="selected-game-box">
//               Selected Game : <span>{selectedGame}</span>
//             </div>
//           )}

//           {/* Download Button */}
//           {selectedGame && (
//             <button
//               className="download-btn"
//               onClick={handleDownload}
//               disabled={loading}
//             >
//               {loading ? "Downloading..." : "Download Fixture PDF"}
//             </button>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default GameListPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./ResultPage.css";

interface TournamentDate {
  id: string;
  date: string;
}

const GameListPage: React.FC = () => {
  const [dates, setDates] = useState<TournamentDate[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [games, setGames] = useState<string[]>([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Load tournament dates
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/tournament-dates")
      .then((res) => setDates(res.data))
      .catch((err) => console.error("Date fetch error:", err));
  }, []);

  // Load games by selected date
  useEffect(() => {
    if (!selectedDate) {
      setGames([]);
      setSelectedGame("");
      return;
    }

    axios
      .get(`http://localhost:8080/api/games/date/${selectedDate}`)
      .then((res) => {
        setGames(res.data);
        setSelectedGame("");
      })
      .catch((err) => {
        console.error("Games fetch error:", err);
        setGames([]);
        setSelectedGame("");
      });
  }, [selectedDate]);

  // Download PDF
  const handleDownload = async () => {
    if (!selectedDate || !selectedGame) {
      alert("Please select date and game");
      return;
    }

    try {
      setLoading(true);

      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];

      const response = await axios.get(
        "http://localhost:8080/api/pdf/bracket",
        {
          params: {
            gameName: selectedGame.trim(),
            date: formattedDate,
          },
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `fixture_${selectedGame}_${formattedDate}.pdf`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Download Error:", error);
      alert("PDF download failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="result-page">
        {/* Back Button */}
        <div className="back-button-wrapper">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <div className="result-container with-header">
          <div className="game-card">
            <h2 className="page-title">Tournament Games</h2>
            <p className="page-subtitle">
              Select tournament date and choose a game to download the fixture
              PDF
            </p>

            {/* Date Dropdown */}
            <div className="form-group">
              <label className="field-label">Tournament Date</label>
              <select
                className="dropdown"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                <option value="">Select Tournament Date</option>
                {dates.map((item) => (
                  <option key={item.id} value={item.date}>
                    {item.date}
                  </option>
                ))}
              </select>
            </div>

            {/* Game Count */}
            {selectedDate && (
              <div className="game-count">
                Total Games: <span>{games.length}</span>
              </div>
            )}

            {/* Game Buttons */}
            {selectedDate && games.length > 0 && (
              <div className="game-grid">
                {games.map((game, index) => (
                  <button
                    key={index}
                    className={`game-btn ${selectedGame === game ? "active" : ""}`}
                    onClick={() => setSelectedGame(game)}
                  >
                    {game}
                  </button>
                ))}
              </div>
            )}

            {/* No Games */}
            {selectedDate && games.length === 0 && (
              <div className="no-games">No games available for this date</div>
            )}

            {/* Selected Game */}
            {selectedGame && (
              <div className="selected-game-box">
                Selected Game: <span>{selectedGame}</span>
              </div>
            )}

            {/* Download Button */}
            {selectedGame && (
              <button
                className="download-btn"
                onClick={handleDownload}
                disabled={loading}
              >
                {loading ? "Downloading..." : "Download Fixture PDF"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GameListPage;
