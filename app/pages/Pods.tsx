import { Typography } from "@mui/material";

interface DashboardProps {
  currentCluster: string;
}

function Pods({ currentCluster }: DashboardProps) {
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Pods
      </Typography>
      <Typography variant="subtitle1">
        Current Cluster: {currentCluster}
      </Typography>
    </div>
  );
}

export default Pods;
