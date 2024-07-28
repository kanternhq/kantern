import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface DeploymentInfo {
  name: string;
  namespace: string;
  ready: string;
  age: number;
}

interface DeploymentsTableProps {
  deployments: DeploymentInfo[];
  onActionClick: (
    deployment: DeploymentInfo,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void;
}

function formatAge(ageInSeconds: number): string {
  if (ageInSeconds < 60) return `${ageInSeconds}s`;
  if (ageInSeconds < 3600) return `${Math.floor(ageInSeconds / 60)}m`;
  if (ageInSeconds < 86400) return `${Math.floor(ageInSeconds / 3600)}h`;
  return `${Math.floor(ageInSeconds / 86400)}d`;
}

function DeploymentsTable({
  deployments,
  onActionClick,
}: DeploymentsTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="deployments table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Ready</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deployments.map((deployment) => (
            <TableRow
              key={`${deployment.namespace}-${deployment.name}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {deployment.name}
              </TableCell>
              <TableCell>{deployment.ready}</TableCell>
              <TableCell>{formatAge(deployment.age)}</TableCell>
              <TableCell>
                <IconButton
                  aria-label="actions"
                  onClick={(event) => onActionClick(deployment, event)}
                >
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DeploymentsTable;
