import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

interface NamespaceSelectorProps {
  currentNamespace: string;
  namespaces: string[];
  onNamespaceChange: (namespace: string) => void;
}

function NamespaceSelector({
  currentNamespace,
  namespaces,
  onNamespaceChange,
}: NamespaceSelectorProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onNamespaceChange(event.target.value as string);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="namespace-select-label">Namespace</InputLabel>
      <Select
        labelId="namespace-select-label"
        id="namespace-select"
        value={currentNamespace}
        label="Namespace"
        onChange={handleChange}
      >
        {namespaces.map((namespace) => (
          <MenuItem key={namespace} value={namespace}>
            {namespace}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default NamespaceSelector;
