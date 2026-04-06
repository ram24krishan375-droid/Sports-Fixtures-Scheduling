// import React from "react";
// import "./Header.css";
// import logo from "./vhnsnc.jpg";
// import logoutIcon from "./logout1.jpg";
// //import { Settings } from "lucide-react";
// import * as Icons from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const Header: React.FC = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/Login");
//   };

//   return (
//     <div className="top-bar">
//       {/* Left side */}
//       <div className="logo-container">
//         <img src={logo} alt="VHNSNC Logo" className="logo" />
//         <span className="dept-title">
//           VHNSNC Department of Physical Education
//         </span>
//       </div>

//       {/* Right side buttons */}
//       <div className="right-controls">
//         <Icons.Settings
//           size={30}
//           className="settings-icon"
//           onClick={() => navigate("/settings")}
//           style={{ cursor: "pointer" }}
//         />

//         <div className="logout-container" onClick={handleLogout}>
//           <img src={logoutIcon} alt="Logout" className="logout-icon" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;

import React, { useEffect, useState } from "react";
import "./Header.css";
import logo from "./vhnsnc.jpg";
import logoutIcon from "./logout1.jpg";
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TITLE_URL = "http://localhost:8080/api/titles";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");

  const fetchTitle = async () => {
    try {
      const res = await axios.get(TITLE_URL);

      if (res.data && res.data.length > 0) {
        setTitle(res.data[0].title);
        setSubTitle(res.data[0].subTitle);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTitle();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/Login");
  };

  return (
    <div className="top-bar">
      {/* Left Side */}

      <div className="logo-container">
        <img src={logo} alt="VHNSNC Logo" className="logo" />
        <span className="dept-title">
          VHNSNC Department of Physical Education
        </span>
      </div>

      {/* Right Side */}

      <div className="right-controls">
        {(title || subTitle) && (
          <div className="tournament-info">
            <span className="tournament-title">{title}</span>
            <span className="tournament-subtitle">{subTitle}</span>
          </div>
        )}

        <Icons.Settings
          size={30}
          className="settings-icon"
          onClick={() => navigate("/settings")}
          style={{ cursor: "pointer" }}
        />

        <div className="logout-container" onClick={handleLogout}>
          <img src={logoutIcon} alt="Logout" className="logout-icon" />
        </div>
      </div>
    </div>
  );
};

export default Header;
