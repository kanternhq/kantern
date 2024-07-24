import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LayersIcon from "@mui/icons-material/Layers";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";

const drawerWidth = 240;
const closedDrawerWidth = 56; // Approximately the width of the icons

interface SidebarProps {
  open: boolean;
}

function Sidebar({ open }: SidebarProps) {
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
      <List>
        {[
          { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
          { text: "Pods", icon: <LayersIcon />, path: "/pods" },
          {
            text: "Services",
            icon: <SettingsEthernetIcon />,
            path: "/services",
          },
          {
            text: "Deployments",
            icon: <CloudQueueIcon />,
            path: "/deployments",
          },
        ].map((item) => (
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
            <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
