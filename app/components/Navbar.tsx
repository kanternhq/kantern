import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ClusterSelector from "./ClusterSelector";
import NamespaceSelector from "./NamespaceSelector";

interface NavbarProps {
  toggleSidebar: () => void;
  currentCluster: string;
  clusters: string[];
  onClusterChange: (cluster: string) => void;
  currentNamespace: string;
  namespaces: string[];
  onNamespaceChange: (namespace: string) => void;
}

function Navbar({
  toggleSidebar,
  currentCluster,
  clusters,
  onClusterChange,
  currentNamespace,
  namespaces,
  onNamespaceChange,
}: NavbarProps) {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleSidebar}
          edge="start"
          sx={{ marginRight: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Kantern
        </Typography>
        <ClusterSelector
          currentCluster={currentCluster}
          clusters={clusters}
          onClusterChange={onClusterChange}
        />
        <NamespaceSelector
          currentNamespace={currentNamespace}
          namespaces={namespaces}
          onNamespaceChange={onNamespaceChange}
        />
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
