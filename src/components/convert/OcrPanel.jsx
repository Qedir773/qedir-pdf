import { useState } from "react";
import { Send } from "lucide-react";
import { DropZone } from "./DropZone";
import { ProgressBar } from "../common/ProgressBar";
import { Button } from "../common/Button";
import { runOcr } from "../../lib/ocr/runOcr";
import { useToast } from "../../hooks/useToast";
import { ACCEPTED_IMAGE_TYPES } from "../../lib/utils/constants";
import { az } from "../../locales/az";

export function OcrPanel({ editorRef }) {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [text, setText] = useState("");
  const toast = useToast();

  async function handleFiles(fileList) {
    const file = fileList[0];
    if (!file) return;
    setRunning(true);
    setProgress(0);
    setText("");
    try {
      const result = await runOcr(file, setProgress);
      setText(result);
      toast.success(az.toast.ocrDone);
    } catch {
      toast.error(az.common.error);
    } finally {
      setRunning(false);
    }
  }

  function handleSendToEditor() {
    const html = text
      .split(/\n{2,}/)
      .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
      .join("");
    editorRef.current?.setHtml(html);
    toast.success(az.toast.aiApplied);
  }

  return (
    <div className="space-y-4">
      <DropZone accept={ACCEPTED_IMAGE_TYPES} multiple={false} onFiles={handleFiles} hint="PNG, JPG, WEBP" />

      {running && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted">{az.convert.ocrProgress}</p>
          <ProgressBar value={progress} />
        </div>
      )}

      {text && !running && (
        <div className="space-y-3">
          <div className="max-h-56 overflow-y-auto rounded-lg bg-white/3 border border-border-glass p-3 text-sm text-muted whitespace-pre-wrap">
            {text}
          </div>
          <Button variant="primary" onClick={handleSendToEditor}>
            <Send size={15} /> {az.convert.sendToEditor}
          </Button>
        </div>
      )}
    </div>
  );
}
