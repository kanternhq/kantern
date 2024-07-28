import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import { Link } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Dashboard as DashboardIcon,
  Memory as WorkloadsIcon,
  NetworkCheck as NetworkIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  AccountTree as ClusterIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
}

function Sidebar({ open }: SidebarProps) {
  const [workloadsOpen, setWorkloadsOpen] = React.useState(true);
  const [networkOpen, setNetworkOpen] = React.useState(false);
  const [configOpen, setConfigOpen] = React.useState(false);
  const [rbacOpen, setRbacOpen] = React.useState(false);
  const [clusterOpen, setClusterOpen] = React.useState(false);

  const handleClick = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setter((prev) => !prev);
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button onClick={() => handleClick(setWorkloadsOpen)}>
          <ListItemIcon>
            <WorkloadsIcon />
          </ListItemIcon>
          <ListItemText primary="Workloads" />
          {workloadsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={workloadsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/pods" sx={{ pl: 4 }}>
              <ListItemText primary="Pods" />
            </ListItem>
            <ListItem button component={Link} to="/deployments" sx={{ pl: 4 }}>
              <ListItemText primary="Deployments" />
            </ListItem>
            <ListItem button component={Link} to="/statefulsets" sx={{ pl: 4 }}>
              <ListItemText primary="StatefulSets" />
            </ListItem>
            <ListItem button component={Link} to="/daemonsets" sx={{ pl: 4 }}>
              <ListItemText primary="DaemonSets" />
            </ListItem>
            <ListItem button component={Link} to="/jobs" sx={{ pl: 4 }}>
              <ListItemText primary="Jobs" />
            </ListItem>
            <ListItem button component={Link} to="/cronjobs" sx={{ pl: 4 }}>
              <ListItemText primary="CronJobs" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem button onClick={() => handleClick(setNetworkOpen)}>
          <ListItemIcon>
            <NetworkIcon />
          </ListItemIcon>
          <ListItemText primary="Services & Networking" />
          {networkOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={networkOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/services" sx={{ pl: 4 }}>
              <ListItemText primary="Services" />
            </ListItem>
            <ListItem button component={Link} to="/ingresses" sx={{ pl: 4 }}>
              <ListItemText primary="Ingresses" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/networkpolicies"
              sx={{ pl: 4 }}
            >
              <ListItemText primary="Network Policies" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem button onClick={() => handleClick(setConfigOpen)}>
          <ListItemIcon>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText primary="Config & Storage" />
          {configOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={configOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/configmaps" sx={{ pl: 4 }}>
              <ListItemText primary="ConfigMaps" />
            </ListItem>
            <ListItem button component={Link} to="/secrets" sx={{ pl: 4 }}>
              <ListItemText primary="Secrets" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/persistentvolumes"
              sx={{ pl: 4 }}
            >
              <ListItemText primary="Persistent Volumes" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/persistentvolumeclaims"
              sx={{ pl: 4 }}
            >
              <ListItemText primary="Persistent Volume Claims" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem button onClick={() => handleClick(setRbacOpen)}>
          <ListItemIcon>
            <SecurityIcon />
          </ListItemIcon>
          <ListItemText primary="RBAC & Security" />
          {rbacOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={rbacOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              component={Link}
              to="/serviceaccounts"
              sx={{ pl: 4 }}
            >
              <ListItemText primary="ServiceAccounts" />
            </ListItem>
            <ListItem button component={Link} to="/roles" sx={{ pl: 4 }}>
              <ListItemText primary="Roles" />
            </ListItem>
            <ListItem button component={Link} to="/rolebindings" sx={{ pl: 4 }}>
              <ListItemText primary="RoleBindings" />
            </ListItem>
            <ListItem button component={Link} to="/clusterroles" sx={{ pl: 4 }}>
              <ListItemText primary="ClusterRoles" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/clusterrolebindings"
              sx={{ pl: 4 }}
            >
              <ListItemText primary="ClusterRoleBindings" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem button onClick={() => handleClick(setClusterOpen)}>
          <ListItemIcon>
            <ClusterIcon />
          </ListItemIcon>
          <ListItemText primary="Cluster" />
          {clusterOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={clusterOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/nodes" sx={{ pl: 4 }}>
              <ListItemText primary="Nodes" />
            </ListItem>
            <ListItem button component={Link} to="/namespaces" sx={{ pl: 4 }}>
              <ListItemText primary="Namespaces" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
}

export default Sidebar;
