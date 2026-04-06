// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./Login";
// import Ganttchart from "./Ganttchart";
// import ExcelUpload from "./ExcelUpload";
// import Schedule from "./Schedule";
// import Schedule1 from "./Schedule1";
// import VENUES from "./VENUES";
// import FixtureDetails from "./FixtureDetails";
// import FixturesGenerated from "./Ganttchart1";
// import ResultPage from "./ResultPage";
// import ExcelDetail from "./ExcelDetails";
// import KnockoutBracket from "./Knockout";

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/Login" element={<Login />} />
//         <Route path="/ExcelUpload" element={<ExcelUpload />} />
//         <Route path="/Ganttchart" element={<Ganttchart />} />
//         <Route path="/Schedule" element={<Schedule />} />
//         <Route path="/Venues" element={<VENUES />} />
//         <Route path="/fixture/:game" element={<FixtureDetails />} />
//         <Route path="/fixtures-generated" element={<FixturesGenerated />} />
//         <Route path="/Schedule1" element={<Schedule1 />} />
//         <Route path="/ResultPage" element={<ResultPage />} />
//         <Route path="/ExcelDetails" element={<ExcelDetail />} />
//         <Route path="/knockout" element={<KnockoutBracket />} />
//         <Route path="/knockout/:game/:date" element={<KnockoutBracket />} />
//       </Routes>
//     </Router>
//   );
// }

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Ganttchart from "./Ganttchart";
import ExcelUpload from "./ExcelUpload";
import Schedule from "./Schedule";
import Schedule1 from "./Schedule1";
import VENUES from "./VENUES";
import FixtureDetails from "./FixtureDetails";
import FixturesGenerated from "./Ganttchart1";
import ResultPage from "./ResultPage";
import ExcelDetail from "./ExcelDetails";
import KnockoutBracket from "./Knockout";
import SettingsDashboard from "./SettingsDashboard"; // ✅ NEW IMPORT

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/ExcelUpload" element={<ExcelUpload />} />
        <Route path="/Ganttchart" element={<Ganttchart />} />
        <Route path="/Schedule" element={<Schedule />} />
        <Route path="/Schedule1" element={<Schedule1 />} />
        <Route path="/Venues" element={<VENUES />} />
        <Route path="/fixture/:game" element={<FixtureDetails />} />
        <Route path="/fixtures-generated" element={<FixturesGenerated />} />
        <Route path="/ResultPage" element={<ResultPage />} />
        <Route path="/ExcelDetails" element={<ExcelDetail />} />
        <Route path="/knockout" element={<KnockoutBracket />} />
        <Route path="/knockout/:game/:date" element={<KnockoutBracket />} />

        {/* ✅ SETTINGS PAGE */}
        <Route path="/settings" element={<SettingsDashboard />} />
      </Routes>
    </Router>
  );
}
