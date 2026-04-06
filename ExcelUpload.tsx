import React, { useRef, useState } from "react";
import axios from "axios";
import "./ExcelUpload.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const ExcelUploadCard: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  // 🔹 Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      if (
        !selectedFile.name.endsWith(".xlsx") &&
        !selectedFile.name.endsWith(".xls")
      ) {
        setError("Please upload a valid Excel file (.xlsx or .xls)");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError("");
    }
  };

  // 🔹 Open file picker
  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  // 🔹 Upload to backend
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      await axios.post("http://localhost:8080/api/excel/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ Navigate only after successful upload
      // navigate("/Ganttchart");
      navigate("/ExcelDetails");
    } catch (err: any) {
      console.error(err);
      setError("File upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* 🔹 Header */}
      <Header />

      {/* 🔹 Upload Card */}
      <div className="upload-card">
        <h2>Upload Excel File</h2>

        {/* Hidden file input */}
        <input
          type="file"
          accept=".xlsx,.xls"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* File display */}
        <div className={`file-display ${file ? "has-file" : ""}`}>
          {file ? (
            <p>
              Selected File: <strong>{file.name}</strong>
            </p>
          ) : (
            <p>No file selected</p>
          )}
        </div>

        {/* Error message */}
        {error && <p className="error-text">{error}</p>}

        {/* Buttons */}
        <div className="button-group">
          <button
            className="select-button"
            onClick={handleSelectClick}
            disabled={loading}
          >
            Select File
          </button>

          <button
            className="upload-button"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelUploadCard;
