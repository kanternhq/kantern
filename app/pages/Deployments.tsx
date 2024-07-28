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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface DeploymentInfo {
  name: string;
  namespace: string;
  ready: string;
  age: number;
}

interface DeploymentsProps {
  currentCluster: string;
  currentNamespace: string;
}

function Deployments({ currentCluster, currentNamespace }: DeploymentsProps) {
  const navigate = useNavigate();
  const [deployments, setDeployments] = useState<DeploymentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDeployment, setSelectedDeployment] =
    useState<DeploymentInfo | null>(null);

  const fetchDeployments = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedDeployments = await invoke<DeploymentInfo[]>(
        "get_deployments",
        { namespace: currentNamespace },
      );
      setDeployments(fetchedDeployments);
    } catch (error) {
      console.error("Failed to fetch deployments:", error);
    } finally {
      setLoading(false);
    }
  }, [currentNamespace]);

  useEffect(() => {
    fetchDeployments();
  }, [fetchDeployments, currentCluster]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    deployment: DeploymentInfo,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedDeployment(deployment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDeployment(null);
  };

  const handleMenuAction = useCallback(
    async (action: string) => {
      if (selectedDeployment) {
        console.log(
          `Action: ${action}, Deployment: ${selectedDeployment.name}`,
        );
        if (action === "edit") {
          try {
            const yaml = await invoke<string>("get_deployment_yaml", {
              name: selectedDeployment.name,
              namespace: selectedDeployment.namespace,
            });

            const encodedYaml = encodeURIComponent(yaml);
            navigate(
              `/yaml-editor?resource=deployment&name=${selectedDeployment.name}&namespace=${selectedDeployment.namespace}&yaml=${encodedYaml}`,
            );
          } catch (error) {
            console.error("Failed to get deployment YAML:", error);
          }
        }
        // Implement other actions here
      }
      handleMenuClose();
    },
    [selectedDeployment, navigate],
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
        Deployments in {currentNamespace}
      </Typography>
      <TableContainer component={Paper} sx={{ flexGrow: 1, height: "100%" }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Ready</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deployments.map((deployment) => (
              <TableRow key={`${deployment.namespace}-${deployment.name}`}>
                <TableCell>{deployment.name}</TableCell>
                <TableCell>{deployment.ready}</TableCell>
                <TableCell>{formatAge(deployment.age)}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="more"
                    id={`long-button-${deployment.name}`}
                    aria-controls={Boolean(anchorEl) ? "long-menu" : undefined}
                    aria-expanded={Boolean(anchorEl) ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={(event) => handleMenuClick(event, deployment)}
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
        {["edit", "scale", "delete"].map((option) => (
          <MenuItem key={option} onClick={() => handleMenuAction(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default Deployments;
