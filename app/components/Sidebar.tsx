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

interface SidebarProps {
  open: boolean;
}

function Sidebar({ open }: SidebarProps) {
  return (
    <Drawer
      variant="permanent"
      sx={(theme) => ({
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: open ? drawerWidth : theme.spacing(7),
          [theme.breakpoints.up("sm")]: {
            width: open ? drawerWidth : theme.spacing(9),
          },
          boxSizing: "border-box",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
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
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            {open && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
