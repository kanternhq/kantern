import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

interface PodInfo {
  name: string;
  namespace: string;
  status: string;
  age: number;
  restarts: number;
  ip: string;
  node: string;
}

interface PodsProps {
  currentCluster: string;
  currentNamespace: string;
}

function formatAge(ageInSeconds: number): string {
  if (ageInSeconds < 60) return `${ageInSeconds}s`;
  if (ageInSeconds < 3600) return `${Math.floor(ageInSeconds / 60)}m`;
  if (ageInSeconds < 86400) return `${Math.floor(ageInSeconds / 3600)}h`;
  return `${Math.floor(ageInSeconds / 86400)}d`;
}

function Pods({ currentCluster, currentNamespace }: PodsProps) {
  const [pods, setPods] = useState<PodInfo[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPod, setSelectedPod] = useState<PodInfo | null>(null);

  const fetchPods = useCallback(async () => {
    try {
      const fetchedPods = await invoke<PodInfo[]>("get_pods", {
        namespace: currentNamespace,
      });
      setPods(fetchedPods);
    } catch (error) {
      console.error("Failed to fetch pods:", error);
    }
  }, [currentNamespace]);

  useEffect(() => {
    fetchPods();
    const intervalId = setInterval(fetchPods, 1000);
    return () => clearInterval(intervalId);
  }, [fetchPods, currentCluster]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    pod: PodInfo,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPod(pod);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPod(null);
  };
  const navigate = useNavigate();

  const handleMenuAction = async (action: string) => {
    if (selectedPod) {
      console.log(`Action: ${action}, Pod: ${selectedPod.name}`);
      if (action === "edit") {
        try {
          const yaml = await invoke<string>("get_pod_yaml", {
            name: selectedPod.name,
            namespace: selectedPod.namespace,
          });

          // Encode the YAML to be passed as a URL parameter
          const encodedYaml = encodeURIComponent(yaml);

          navigate(
            `/yaml-editor?pod=${selectedPod.name}&namespace=${selectedPod.namespace}&yaml=${encodedYaml}`,
          );
        } catch (error) {
          console.error("Failed to get pod YAML:", error);
        }
      }
      handleMenuClose();
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography
        variant="h6"
        sx={{ p: 2, backgroundColor: "background.paper" }}
      >
        Pods in {currentNamespace}
      </Typography>
      <TableContainer component={Paper} sx={{ flexGrow: 1, height: "100%" }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Namespace</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Restarts</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>IP</TableCell>
              <TableCell>Node</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pods.map((pod) => (
              <TableRow hover key={`${pod.namespace}-${pod.name}`}>
                <TableCell>{pod.name}</TableCell>
                <TableCell>{pod.namespace}</TableCell>
                <TableCell>{pod.status}</TableCell>
                <TableCell>{pod.restarts}</TableCell>
                <TableCell>{formatAge(pod.age)}</TableCell>
                <TableCell>{pod.ip}</TableCell>
                <TableCell>{pod.node}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    aria-label="more"
                    id={`long-button-${pod.name}`}
                    aria-controls={`long-menu-${pod.name}`}
                    aria-expanded={Boolean(anchorEl)}
                    aria-haspopup="true"
                    onClick={(event) => handleMenuClick(event, pod)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {["definition", "shell", "delete", "edit", "describe"].map((option) => (
          <MenuItem key={option} onClick={() => handleMenuAction(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default Pods;
