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

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
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
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
