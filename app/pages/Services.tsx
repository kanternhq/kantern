import { Typography } from "@mui/material";

interface DashboardProps {
  currentCluster: string;
}

function Services({ currentCluster }: DashboardProps) {
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Services
      </Typography>
      <Typography variant="subtitle1">
        Current Cluster: {currentCluster}
      </Typography>
    </div>
  );
}

export default Services;
