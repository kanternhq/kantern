import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Pods from "./pages/Pods";
import Services from "./pages/Services";
import Deployments from "./pages/Deployments";
import Settings from "./pages/Settings";

// Import the tauri API
import { invoke } from "@tauri-apps/api/core";

const theme = createTheme();

const drawerWidth = 240;
const closedDrawerWidth = 56;

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [clusters, setClusters] = useState<string[]>([]);
  const [currentCluster, setCurrentCluster] = useState<string>("");
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [currentNamespace, setCurrentNamespace] = useState<string>("");

  useEffect(() => {
    // Fetch clusters from kubeconfig
    invoke<string[]>("get_clusters")
      .then((fetchedClusters) => {
        setClusters(fetchedClusters);
        if (fetchedClusters.length > 0) {
          setCurrentCluster(fetchedClusters[0]);
        }
      })
      .catch(console.error);

    invoke<string[]>("get_namespaces")
      .then((fetchedNamespaces) => {
        setNamespaces(fetchedNamespaces);
        if (fetchedNamespaces.length > 0) {
          setCurrentNamespace(fetchedNamespaces[0]);
        }
      })
      .catch(console.error);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleClusterChange = (cluster: string) => {
    setCurrentCluster(cluster);
    invoke("set_current_cluster", { cluster }).catch(console.error);
  };

  const handleNamespaceChange = (namespace: string) => {
    setCurrentNamespace(namespace);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: "flex" }}>
          <Navbar
            toggleSidebar={toggleSidebar}
            currentCluster={currentCluster}
            clusters={clusters}
            onClusterChange={handleClusterChange}
            currentNamespace={currentNamespace}
            namespaces={namespaces}
            onNamespaceChange={handleNamespaceChange}
          />
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
              <Route
                path="/"
                element={<Dashboard currentCluster={currentCluster} />}
              />
              <Route
                path="/pods"
                element={
                  <Pods
                    currentCluster={currentCluster}
                    currentNamespace={currentNamespace}
                  />
                }
              />
              <Route
                path="/services"
                element={<Services currentCluster={currentCluster} />}
              />
              <Route
                path="/deployments"
                element={<Deployments currentCluster={currentCluster} />}
              />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
