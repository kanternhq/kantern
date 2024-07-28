import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface DsInfo {
  name: string;
  age: number;
}

interface DaemonSetsProps {
  currentCluster: string;
  currentNamespace: string;
}

function DaemonSets({ currentCluster, currentNamespace }: DaemonSetsProps) {
  const navigate = useNavigate();
  const [daemonSets, setDaemonSets] = useState<DsInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDaemonSet, setSelectedDaemonSet] = useState<DsInfo | null>(
    null,
  );

  const fetchDaemonSets = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedDaemonSets = await invoke<DsInfo[]>("get_daemon_sets", {
        namespace: currentNamespace,
      });
      setDaemonSets(fetchedDaemonSets);
    } catch (error) {
      console.error("Failed to fetch DaemonSets:", error);
    } finally {
      setLoading(false);
    }
  }, [currentNamespace]);

  useEffect(() => {
    fetchDaemonSets();
  }, [fetchDaemonSets, currentCluster]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    daemonSet: DsInfo,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedDaemonSet(daemonSet);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDaemonSet(null);
  };

  const handleMenuAction = useCallback(
    async (action: string) => {
      if (selectedDaemonSet) {
        if (action === "edit") {
          try {
            const yaml = await invoke<string>("get_daemon_set_yaml", {
              name: selectedDaemonSet.name,
              namespace: currentNamespace,
            });

            const encodedYaml = encodeURIComponent(yaml);
            navigate(
              `/yaml-editor?resource=daemonset&name=${selectedDaemonSet.name}&namespace=${currentNamespace}&yaml=${encodedYaml}`,
            );
          } catch (error) {
            console.error("Failed to get DaemonSet YAML:", error);
          }
        } else if (action === "delete") {
          try {
            await invoke("delete_daemon_set", {
              name: selectedDaemonSet.name,
              namespace: currentNamespace,
            });
            fetchDaemonSets();
          } catch (error) {
            console.error("Failed to delete DaemonSet:", error);
          }
        }
      }
      handleMenuClose();
    },
    [selectedDaemonSet, navigate, fetchDaemonSets, currentNamespace],
  );

  const formatAge = (ageInSeconds: number): string => {
    if (ageInSeconds < 60) return `${ageInSeconds}s`;
    if (ageInSeconds < 3600) return `${Math.floor(ageInSeconds / 60)}m`;
    if (ageInSeconds < 86400) return `${Math.floor(ageInSeconds / 3600)}h`;
    return `${Math.floor(ageInSeconds / 86400)}d`;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography
        variant="h6"
        sx={{ p: 2, backgroundColor: "background.paper" }}
      >
        DaemonSets in {currentNamespace}
      </Typography>
      <TableContainer component={Paper} sx={{ flexGrow: 1, height: "100%" }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {daemonSets.map((ds) => (
              <TableRow key={ds.name}>
                <TableCell>{ds.name}</TableCell>
                <TableCell>{formatAge(ds.age)}</TableCell>
                <TableCell>
                  <Tooltip title="Actions">
                    <IconButton
                      aria-label="more"
                      id={`long-button-${ds.name}`}
                      aria-controls={
                        Boolean(anchorEl) ? "long-menu" : undefined
                      }
                      aria-expanded={Boolean(anchorEl) ? "true" : undefined}
                      aria-haspopup="true"
                      onClick={(event) => handleMenuClick(event, ds)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
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
        {["edit", "delete"].map((option) => (
          <MenuItem key={option} onClick={() => handleMenuAction(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default DaemonSets;
