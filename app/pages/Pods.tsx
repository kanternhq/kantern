import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { invoke } from "@tauri-apps/api/core";

interface PodInfo {
  name: string;
  namespace: string;
  status: string;
}

interface PodsProps {
  currentCluster: string;
  currentNamespace: string;
}

function Pods({ currentCluster, currentNamespace }: PodsProps) {
  const [pods, setPods] = useState<PodInfo[]>([]);

  useEffect(() => {
    invoke<PodInfo[]>("get_pods", { namespace: currentNamespace })
      .then(setPods)
      .catch(console.error);
  }, [currentCluster, currentNamespace]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Namespace</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pods.map((pod) => (
            <TableRow
              key={`${pod.namespace}-${pod.name}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {pod.name}
              </TableCell>
              <TableCell>{pod.namespace}</TableCell>
              <TableCell>{pod.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Pods;
