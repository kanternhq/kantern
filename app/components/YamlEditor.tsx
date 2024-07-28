import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-github";

interface YamlEditorProps {
  yaml: string;
  onChange: (newYaml: string) => void;
}

function YamlEditor({ yaml, onChange }: YamlEditorProps) {
  return (
    <AceEditor
      mode="yaml"
      theme="github"
      onChange={onChange}
      name="yaml_editor"
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        useWorker: false,
        showPrintMargin: false,
        fontSize: 14,
      }}
      value={yaml}
      width="100%"
      height="100%"
    />
  );
}

export default YamlEditor;
