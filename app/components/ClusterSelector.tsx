import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

interface ClusterSelectorProps {
  currentCluster: string;
  clusters: string[];
  onClusterChange: (cluster: string) => void;
}

function ClusterSelector({
  currentCluster,
  clusters,
  onClusterChange,
}: ClusterSelectorProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onClusterChange(event.target.value as string);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="cluster-select-label">Cluster</InputLabel>
      <Select
        labelId="cluster-select-label"
        id="cluster-select"
        value={currentCluster}
        label="Cluster"
        onChange={handleChange}
      >
        {clusters.map((cluster) => (
          <MenuItem key={cluster} value={cluster}>
            {cluster}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default ClusterSelector;
