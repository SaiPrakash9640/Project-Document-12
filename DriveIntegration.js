import React, { useState } from 'react';
import axios from 'axios';
import './DriveIntegration.css';

const DriveIntegration = () => {
  const [authUrl, setAuthUrl] = useState('');
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [fileContent, setFileContent] = useState(''); // Simulate report data

  const getAuthUrl = async () => {
    const response = await axios.get('http://localhost:5001/auth-url');
    setAuthUrl(response.data.url);
  };

  const listFolders = async () => {
    const response = await axios.get('http://localhost:5001/list-folders');
    setFolders(response.data);
  };

  const uploadFile = async () => {
    const response = await axios.post('http://localhost:5001/upload', {
      folderId: selectedFolder,
      fileName: 'Report.xlsx',
      fileContent,
    });
    alert(`File uploaded successfully! File ID: ${response.data.fileId}`);
  };

  return (
    <div className="container">
      <h1>Google Drive Integration</h1>
      <button className="primary" onClick={getAuthUrl}>
        Authenticate with Google
      </button>

      {authUrl && (
        <a
          href={authUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="auth-link"
        >
          Login to Google
        </a>
      )}

      <button className="secondary" onClick={listFolders}>
        List Google Drive Folders
      </button>

      {folders.length > 0 && (
        <div className="folder-select">
          <select
            onChange={(e) => setSelectedFolder(e.target.value)}
            value={selectedFolder}
          >
            <option value="">Select a folder</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <textarea
        placeholder="Enter file content (e.g., report data)"
        value={fileContent}
        onChange={(e) => setFileContent(e.target.value)}
      />

      <button className="primary" onClick={uploadFile}>
        Upload File
      </button>
    </div>
  );
};

export default DriveIntegration;
