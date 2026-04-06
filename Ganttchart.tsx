// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import "./GantChart.css";
// import Header from "./Header";
// import Schedule from "./Schedule";
// import GenerateReportButton from "./Generate";
// import ClearDataButton from "./ClearDataButton";

// const GanttChart: React.FC = () => {
//   const [dates, setDates] = useState<string[]>([]);
//   const [selectedDate, setSelectedDate] = useState<string>("");
//   const [totalGames, setTotalGames] = useState(0);
//   const dateRowRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     axios
//       .get<string[]>("http://localhost:8080/api/excelDetails/dates")
//       .then((res) => {
//         setDates(res.data);
//         if (res.data.length > 0) setSelectedDate(res.data[0]);
//       });
//   }, []);

//   useEffect(() => {
//     if (!selectedDate) return;

//     axios
//       .get(`http://localhost:8080/api/gantt/${selectedDate}`)
//       .then((res) => setTotalGames(res.data.length));
//   }, [selectedDate]);

//   useEffect(() => {
//     const active = dateRowRef.current?.querySelector(
//       ".date-item.active",
//     ) as HTMLDivElement;
//     active?.scrollIntoView({ behavior: "smooth", inline: "center" });
//   }, [selectedDate, dates]);

//   return (
//     <div className="gantt-wrapper">
//       <Header />

//       <div className="date-row" ref={dateRowRef}>
//         {dates.map((d) => (
//           <div
//             key={d}
//             className={`date-item ${selectedDate === d ? "active" : ""}`}
//             onClick={() => setSelectedDate(d)}
//           >
//             {d}
//           </div>
//         ))}
//       </div>

//       <div className="buttons-right">
//         <GenerateReportButton />
//         <ClearDataButton />
//       </div>

//       <div className="stats-bar">
//         <div className="stat-card">
//           <div className="stat-title">Selected Date</div>
//           <div className="stat-value">{selectedDate}</div>
//         </div>

//         <div className="stat-card">
//           <div className="stat-title">Total Games</div>
//           <div className="stat-value">{totalGames}</div>
//         </div>
//       </div>

//       {selectedDate && <Schedule selectedDate={selectedDate} />}
//     </div>
//   );
// };

// export default GanttChart;

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CircleArrowLeft } from "lucide-react";
import "./GantChart.css";
import Header from "./Header";
import Schedule from "./Schedule";
import GenerateReportButton from "./Generate";
import ClearDataButton from "./ClearDataButton";

const GanttChart: React.FC = () => {
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [totalGames, setTotalGames] = useState(0);
  const dateRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get<string[]>("http://localhost:8080/api/excelDetails/dates")
      .then((res) => {
        setDates(res.data);
        if (res.data.length > 0) setSelectedDate(res.data[0]);
      });
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    axios
      .get(`http://localhost:8080/api/gantt/${selectedDate}`)
      .then((res) => setTotalGames(res.data.length));
  }, [selectedDate]);

  useEffect(() => {
    const active = dateRowRef.current?.querySelector(
      ".date-item.active",
    ) as HTMLDivElement;
    active?.scrollIntoView({ behavior: "smooth", inline: "center" });
  }, [selectedDate, dates]);

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="gantt-wrapper">
      <Header />

      {/* Top Action Bar */}
      <div className="top-action-bar">
        <div className="back-button" onClick={handleBack}>
          <CircleArrowLeft size={34} />
          <span className="back-tooltip">Back</span>
        </div>

        <div className="buttons-right">
          <GenerateReportButton />
          <ClearDataButton />
        </div>
      </div>

      {/* Date Row */}
      <div className="date-row" ref={dateRowRef}>
        {dates.map((d) => (
          <div
            key={d}
            className={`date-item ${selectedDate === d ? "active" : ""}`}
            onClick={() => setSelectedDate(d)}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-title">Selected Date</div>
          <div className="stat-value">{selectedDate}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Total Games</div>
          <div className="stat-value">{totalGames}</div>
        </div>
      </div>

      {/* Schedule */}
      {selectedDate && <Schedule selectedDate={selectedDate} />}
    </div>
  );
};

export default GanttChart;
