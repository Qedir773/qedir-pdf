import { useState } from "react";
import { Send } from "lucide-react";
import { DropZone } from "./DropZone";
import { Spinner } from "../common/Spinner";
import { Button } from "../common/Button";
import { docxToHtml } from "../../lib/docx/docxToHtml";
import { sanitizeHtml } from "../../lib/text/sanitizeHtml";
import { useToast } from "../../hooks/useToast";
import { ACCEPTED_DOCX_TYPE } from "../../lib/utils/constants";
import { az } from "../../locales/az";

export function DocxToHtmlPanel({ editorRef }) {
  const [loading, setLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const toast = useToast();

  async function handleFiles(fileList) {
    const file = fileList[0];
    if (!file) return;
    setLoading(true);
    setPreviewHtml("");
    try {
      const html = sanitizeHtml(await docxToHtml(file));
      setPreviewHtml(html);
      toast.success(az.toast.converted);
    } catch {
      toast.error(az.common.error);
    } finally {
      setLoading(false);
    }
  }

  function handleSendToEditor() {
    editorRef.current?.setHtml(previewHtml);
    toast.success(az.toast.aiApplied);
  }

  return (
    <div className="space-y-4">
      <DropZone accept={[ACCEPTED_DOCX_TYPE]} multiple={false} onFiles={handleFiles} hint="DOCX" />

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Spinner size={16} /> {az.common.loading}
        </div>
      )}

      {previewHtml && !loading && (
        <div className="space-y-3">
          <div
            className="max-h-56 overflow-y-auto rounded-lg bg-white/3 border border-border-glass p-3 text-sm text-muted [&_*]:!max-w-full"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
          <Button variant="primary" onClick={handleSendToEditor}>
            <Send size={15} /> {az.convert.sendToEditor}
          </Button>
        </div>
      )}
    </div>
  );
}
