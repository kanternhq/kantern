import React, { useEffect, useState } from "react";
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
import { invoke } from "@tauri-apps/api/core";

interface PodInfo {
  name: string;
  namespace: string;
  status: string;
}

interface PodsProps {
  currentCluster: string;
  currentNamespace: string;
}

function Pods({ currentCluster, currentNamespace }: PodsProps) {
  const [pods, setPods] = useState<PodInfo[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPod, setSelectedPod] = useState<PodInfo | null>(null);

  useEffect(() => {
    invoke<PodInfo[]>("get_pods", { namespace: currentNamespace })
      .then(setPods)
      .catch(console.error);
  }, [currentCluster, currentNamespace]);

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

  const handleMenuAction = async (action: string) => {
    if (selectedPod) {
      switch (action) {
        case "definition":
          try {
            const definition = await invoke<string>("get_pod_definition", {
              name: selectedPod.name,
              namespace: selectedPod.namespace,
            });
            console.log(definition);
            // Display the definition in a modal or new window
          } catch (error) {
            console.error("Failed to get pod definition:", error);
          }
          break;
        case "delete":
          try {
            await invoke("delete_pod", {
              name: selectedPod.name,
              namespace: selectedPod.namespace,
            });
            // Refresh the pod list
            invoke<PodInfo[]>("get_pods", { namespace: currentNamespace })
              .then(setPods)
              .catch(console.error);
          } catch (error) {
            console.error("Failed to delete pod:", error);
          }
          break;
        // Implement other actions
      }
    }
    handleMenuClose();
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
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Namespace</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pods.map((pod) => (
              <TableRow hover key={`${pod.namespace}-${pod.name}`}>
                <TableCell>{pod.name}</TableCell>
                <TableCell>{pod.namespace}</TableCell>
                <TableCell>{pod.status}</TableCell>
                <TableCell>
                  <IconButton
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
        {["definition", "shell", "delete", "describe"].map((option) => (
          <MenuItem key={option} onClick={() => handleMenuAction(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default Pods;
