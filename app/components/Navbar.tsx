import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ClusterSelector from "./ClusterSelector";

interface NavbarProps {
  toggleSidebar: () => void;
  currentCluster: string;
  clusters: string[];
  onClusterChange: (cluster: string) => void;
}

function Navbar({
  toggleSidebar,
  currentCluster,
  clusters,
  onClusterChange,
}: NavbarProps) {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Kantern
        </Typography>
        <Box>
          <ClusterSelector
            currentCluster={currentCluster}
            clusters={clusters}
            onClusterChange={onClusterChange}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
