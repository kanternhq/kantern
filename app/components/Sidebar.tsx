import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LayersIcon from "@mui/icons-material/Layers";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 240;
const closedDrawerWidth = 56; // Approximately the width of the icons

interface SidebarProps {
  open: boolean;
}

function Sidebar({ open }: SidebarProps) {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Pods", icon: <LayersIcon />, path: "/pods" },
    { text: "Services", icon: <SettingsEthernetIcon />, path: "/services" },
    { text: "Deployments", icon: <CloudQueueIcon />, path: "/deployments" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={(theme) => ({
        width: open ? drawerWidth : closedDrawerWidth,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        [`& .MuiDrawer-paper`]: {
          width: open ? drawerWidth : closedDrawerWidth,
          overflowX: "hidden",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      })}
    >
      <Toolbar />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />{" "}
        {/* This pushes the settings button to the bottom */}
        <Divider />
        <List>
          <ListItem
            button
            component={Link}
            to="/settings"
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" sx={{ opacity: open ? 1 : 0 }} />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
