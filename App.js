import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Select,
  MenuItem,
  Snackbar,
} from "@mui/material";

const App = () => {
  const [accessToken, setAccessToken] = useState("");
  const [fileType, setFileType] = useState("CSV");
  const [folderId, setFolderId] = useState(""); // Store Google Drive folder ID
  const [uploadStatus, setUploadStatus] = useState("");

  const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"; // Replace with your Google Client ID

  const handleLoginSuccess = (credentialResponse) => {
    setAccessToken(credentialResponse.credential);
    console.log("Login Successful:", credentialResponse);
  };

  const handleLoginError = () => {
    console.error("Login Failed");
  };

  const handleFileTypeChange = (event) => {
    setFileType(event.target.value);
  };

  const handleExport = async () => {
    if (!accessToken) {
      setUploadStatus("Please log in to Google Drive first.");
      return;
    }

    try {
      setUploadStatus("Exporting report...");
      const response = await axios.post(
        "http://localhost:5000/export",
        {
          fileType,
          folderId,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setUploadStatus(`File uploaded! View it here: ${response.data.link}`);
    } catch (error) {
      setUploadStatus("Error uploading file. Check console for details.");
      console.error(error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
          }}
        >
          <Toolbar />
          <List>
            <ListItem button>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Export Report" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {/* Navbar */}
          <AppBar position="fixed" sx={{ zIndex: 1201 }}>
            <Toolbar>
              <Typography variant="h6" noWrap component="div">
                Export Reports to Google Drive
              </Typography>
            </Toolbar>
          </AppBar>
          <Toolbar /> {/* Spacer for AppBar */}

          {/* Content */}
          <Box sx={{ mt: 2 }}>
            {!accessToken ? (
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
              />
            ) : (
              <p>Logged in to Google Drive</p>
            )}

            <Box sx={{ my: 3 }}>
              <Typography variant="body1">Choose file type:</Typography>
              <Select
                value={fileType}
                onChange={handleFileTypeChange}
                sx={{ width: 200 }}
              >
                <MenuItem value="CSV">CSV</MenuItem>
                <MenuItem value="PDF">PDF</MenuItem>
              </Select>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleExport}
              sx={{ mt: 2 }}
            >
              Export Report
            </Button>

            {uploadStatus && (
              <Snackbar
                open={!!uploadStatus}
                autoHideDuration={6000}
                message={uploadStatus}
              />
            )}
          </Box>
        </Box>
      </Box>
    </GoogleOAuthProvider>
  );
};

export default App;
