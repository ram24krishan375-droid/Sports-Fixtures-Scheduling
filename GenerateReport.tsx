import React from "react";
import "./GenerateReport.css";
import { useNavigate } from "react-router-dom";

const GenerateReportButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/ResultPage"); // change path as needed
  };

  return (
    <button className="generate-btn" onClick={handleClick}>
      GENERATE REPORT
    </button>
  );
};

export default GenerateReportButton;
