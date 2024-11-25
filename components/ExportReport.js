import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./components/ExportReport.css";

const ExportReport = () => {
  const [folderId, setFolderId] = useState("");
  const [fileType, setFileType] = useState("PDF");

  const handleExport = async () => {
    if (!folderId) {
      toast.error("Please select a folder.", { className: "toast-container" });
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/export-report", {
        folderId,
        fileType,
      });

      if (response.data.success) {
        toast.success(
          `Report exported! View it [here](${response.data.fileLink}).`,
          {
            autoClose: 8000,
            className: "toast-container",
          }
        );
      } else {
        toast.error("Failed to export the report.", { className: "toast-container" });
      }
    } catch (error) {
      toast.error("An error occurred while exporting the report.", {
        className: "toast-container",
      });
      console.error(error);
    }
  };

  return (
    <div className="export-report-container">
      <h2>Export Report to Google Drive</h2>
      <label>
        Google Drive Folder ID:
        <input
          type="text"
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
          placeholder="Enter Folder ID"
        />
      </label>
      <label>
        File Type:
        <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
          <option value="PDF">PDF</option>
          <option value="CSV">CSV</option>
        </select>
      </label>
      <button onClick={handleExport}>Export Report</button>
      <ToastContainer />
    </div>
  );
};

export default ExportReport;
