import { useState } from "react";
import { FileText, Send, Download } from "lucide-react";
import { DropZone } from "./DropZone";
import { ProgressBar } from "../common/ProgressBar";
import { Button } from "../common/Button";
import { extractPdfText } from "../../lib/pdf/extractPdfText";
import { exportAsDocx } from "../../lib/export/exportDocx";
import { sanitizeHtml } from "../../lib/text/sanitizeHtml";
import { useToast } from "../../hooks/useToast";
import { ACCEPTED_PDF_TYPE } from "../../lib/utils/constants";
import { az } from "../../locales/az";

function textToHtml(text) {
  return text
    .split(/\n{2,}/)
    .map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function PdfExtractPanel({ editorRef }) {
  const [fileName, setFileName] = useState(null);
  const [progress, setProgress] = useState(0);
  const [extracting, setExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const toast = useToast();

  async function handleFiles(fileList) {
    const file = fileList[0];
    if (!file) return;
    setFileName(file.name);
    setExtracting(true);
    setProgress(0);
    setExtractedText("");
    try {
      const text = await extractPdfText(file, setProgress);
      setExtractedText(text);
      toast.success(az.toast.converted);
    } catch {
      toast.error(az.common.error);
    } finally {
      setExtracting(false);
    }
  }

  function handleSendToEditor() {
    editorRef.current?.setHtml(sanitizeHtml(textToHtml(extractedText)));
    toast.success(az.toast.aiApplied);
  }

  async function handleDownloadDocx() {
    await exportAsDocx(textToHtml(extractedText), (fileName?.replace(/\.pdf$/i, "") || "qedir-pdf") + ".docx");
    toast.success(az.toast.exported);
  }

  return (
    <div className="space-y-4">
      <DropZone accept={[ACCEPTED_PDF_TYPE]} multiple={false} onFiles={handleFiles} hint="PDF" />

      {extracting && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted">{fileName}</p>
          <ProgressBar value={progress} />
        </div>
      )}

      {extractedText && !extracting && (
        <div className="space-y-3">
          <div className="max-h-56 overflow-y-auto rounded-lg bg-white/3 border border-border-glass p-3 text-sm text-muted whitespace-pre-wrap">
            {extractedText.slice(0, 2000)}
            {extractedText.length > 2000 && "…"}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={handleSendToEditor}>
              <Send size={15} /> {az.convert.sendToEditor}
            </Button>
            <Button variant="ghost" onClick={handleDownloadDocx}>
              <Download size={15} /> {az.editor.exportDocx}
            </Button>
          </div>
        </div>
      )}

      {!extractedText && !extracting && (
        <p className="text-xs text-muted-2 inline-flex items-center gap-1.5">
          <FileText size={13} /> {az.convert.extractText}
        </p>
      )}
    </div>
  );
}
