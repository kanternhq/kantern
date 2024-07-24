import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Pods from "./pages/Pods";
import Services from "./pages/Services";
import Deployments from "./pages/Deployments";

const theme = createTheme();

const drawerWidth = 240;
const closedDrawerWidth = 56; // Approximately the width of the icons

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: "flex" }}>
          <Navbar toggleSidebar={toggleSidebar} />
          <Sidebar open={sidebarOpen} />
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              p: 3,
              mt: 8,
              transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              marginLeft: sidebarOpen
                ? `${drawerWidth}px`
                : `${closedDrawerWidth}px`,
            })}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pods" element={<Pods />} />
              <Route path="/services" element={<Services />} />
              <Route path="/deployments" element={<Deployments />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
