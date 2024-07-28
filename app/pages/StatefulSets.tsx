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

interface StatefulSetInfo {
  name: string;
  namespace: string;
  replicas: number;
  readyReplicas: number;
  updateStrategy: string;
  age: number;
}

interface StatefulSetsProps {
  currentCluster: string;
  currentNamespace: string;
}

function StatefulSets({ currentCluster, currentNamespace }: StatefulSetsProps) {
  const navigate = useNavigate();
  const [statefulSets, setStatefulSets] = useState<StatefulSetInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStatefulSet, setSelectedStatefulSet] =
    useState<StatefulSetInfo | null>(null);

  const fetchStatefulSets = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedStatefulSets = await invoke<StatefulSetInfo[]>(
        "get_stateful_sets",
        { namespace: currentNamespace },
      );
      setStatefulSets(fetchedStatefulSets);
    } catch (error) {
      console.error("Failed to fetch StatefulSets:", error);
    } finally {
      setLoading(false);
    }
  }, [currentNamespace]);

  useEffect(() => {
    fetchStatefulSets();
  }, [fetchStatefulSets, currentCluster]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    statefulSet: StatefulSetInfo,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedStatefulSet(statefulSet);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStatefulSet(null);
  };

  const handleMenuAction = useCallback(
    async (action: string) => {
      if (selectedStatefulSet) {
        console.log(
          `Action: ${action}, StatefulSet: ${selectedStatefulSet.name}`,
        );
        if (action === "edit") {
          try {
            const yaml = await invoke<string>("get_stateful_set_yaml", {
              name: selectedStatefulSet.name,
              namespace: selectedStatefulSet.namespace,
            });

            const encodedYaml = encodeURIComponent(yaml);
            navigate(
              `/yaml-editor?resource=statefulset&name=${selectedStatefulSet.name}&namespace=${selectedStatefulSet.namespace}&yaml=${encodedYaml}`,
            );
          } catch (error) {
            console.error("Failed to get StatefulSet YAML:", error);
          }
        } else if (action === "delete") {
          // Implement delete functionality
          try {
            await invoke("delete_stateful_set", {
              name: selectedStatefulSet.name,
              namespace: selectedStatefulSet.namespace,
            });
            fetchStatefulSets(); // Refresh the list after deletion
          } catch (error) {
            console.error("Failed to delete StatefulSet:", error);
          }
        }
      }
      handleMenuClose();
    },
    [selectedStatefulSet, navigate, fetchStatefulSets],
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
        StatefulSets in {currentNamespace}
      </Typography>
      <TableContainer component={Paper} sx={{ flexGrow: 1, height: "100%" }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Ready</TableCell>
              <TableCell>Update Strategy</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statefulSets.map((statefulSet) => (
              <TableRow key={`${statefulSet.namespace}-${statefulSet.name}`}>
                <TableCell>{statefulSet.name}</TableCell>
                <TableCell>{`${statefulSet.readyReplicas}/${statefulSet.replicas}`}</TableCell>
                <TableCell>{statefulSet.updateStrategy}</TableCell>
                <TableCell>{formatAge(statefulSet.age)}</TableCell>
                <TableCell>
                  <Tooltip title="Actions">
                    <IconButton
                      aria-label="more"
                      id={`long-button-${statefulSet.name}`}
                      aria-controls={
                        Boolean(anchorEl) ? "long-menu" : undefined
                      }
                      aria-expanded={Boolean(anchorEl) ? "true" : undefined}
                      aria-haspopup="true"
                      onClick={(event) => handleMenuClick(event, statefulSet)}
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

export default StatefulSets;
