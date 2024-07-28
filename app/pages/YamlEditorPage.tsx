import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import YamlEditor from "../components/YamlEditor";
import { invoke } from "@tauri-apps/api/core";
import { Snackbar, Alert } from "@mui/material";

function YamlEditorPage() {
  const [yaml, setYaml] = useState("");
  const [podName, setPodName] = useState("");
  const [namespace, setNamespace] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [saveStatus, setSaveStatus] = useState<{
    message: string;
    error: boolean;
  } | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pod = searchParams.get("pod");
    const ns = searchParams.get("namespace");
    const initialYaml = searchParams.get("yaml");
    if (pod && ns) {
      setPodName(pod);
      setNamespace(ns);
      if (initialYaml) {
        setYaml(decodeURIComponent(initialYaml));
      } else {
        // Fallback to fetching YAML if not provided in URL
        invoke<string>("get_pod_yaml", { name: pod, namespace: ns })
          .then(setYaml)
          .catch(console.error);
      }
    }
  }, [location]);

  const handleSave = async () => {
    try {
      const result = await invoke<string>("apply_pod_yaml", { yaml });
      setSaveStatus({ message: result, error: false });
    } catch (error) {
      console.error("Failed to apply YAML:", error);
      setSaveStatus({ message: `Failed to apply YAML: ${error}`, error: true });
    }
  };

  const handleBack = () => {
    navigate("/pods");
  };

  return (
    <Box
      sx={{ height: "100vh", display: "flex", flexDirection: "column", p: 2 }}
    >
      <Typography variant="h6" gutterBottom>
        Editing YAML for pod: {podName} in namespace: {namespace}
      </Typography>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" onClick={handleBack}>
          Back to Pods
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1, border: "1px solid #ddd", borderRadius: 1 }}>
        <YamlEditor yaml={yaml} onChange={setYaml} />
      </Box>
      <Snackbar
        open={Boolean(saveStatus)}
        autoHideDuration={6000}
        onClose={() => setSaveStatus(null)}
      >
        <Alert
          onClose={() => setSaveStatus(null)}
          severity={saveStatus?.error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {saveStatus?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default YamlEditorPage;
