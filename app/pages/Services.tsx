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

interface ServiceInfo {
  name: string;
  age: number;
}

interface ServicesProps {
  currentCluster: string;
  currentNamespace: string;
}

function Services({ currentCluster, currentNamespace }: ServicesProps) {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedService, setSelectedService] = useState<ServiceInfo | null>(
    null,
  );

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedServices = await invoke<ServiceInfo[]>("get_services", {
        namespace: currentNamespace,
      });
      setServices(fetchedServices);
    } catch (error) {
      console.error("Failed to fetch Services:", error);
    } finally {
      setLoading(false);
    }
  }, [currentNamespace]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices, currentCluster]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    service: ServiceInfo,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedService(service);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedService(null);
  };

  const handleMenuAction = useCallback(
    async (action: string) => {
      if (selectedService) {
        if (action === "edit") {
          try {
            const yaml = await invoke<string>("get_daemon_set_yaml", {
              name: selectedService.name,
              namespace: currentNamespace,
            });

            const encodedYaml = encodeURIComponent(yaml);
            navigate(
              `/yaml-editor?resource=daemonset&name=${selectedService.name}&namespace=${currentNamespace}&yaml=${encodedYaml}`,
            );
          } catch (error) {
            console.error("Failed to get Service YAML:", error);
          }
        } else if (action === "delete") {
          try {
            await invoke("delete_service_set", {
              name: selectedService.name,
              namespace: currentNamespace,
            });
            fetchServices();
          } catch (error) {
            console.error("Failed to delete Service:", error);
          }
        }
      }
      handleMenuClose();
    },
    [selectedService, navigate, fetchServices, currentNamespace],
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
        Services in {currentNamespace}
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
            {services.map((service) => (
              <TableRow key={service.name}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{formatAge(service.age)}</TableCell>
                <TableCell>
                  <Tooltip title="Actions">
                    <IconButton
                      aria-label="more"
                      id={`long-button-${service.name}`}
                      aria-controls={
                        Boolean(anchorEl) ? "long-menu" : undefined
                      }
                      aria-expanded={Boolean(anchorEl) ? "true" : undefined}
                      aria-haspopup="true"
                      onClick={(event) => handleMenuClick(event, service)}
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

export default Services;
