import { useState } from "react";
import { Minimize2 } from "lucide-react";
import { GlassPanel } from "../common/GlassPanel";
import { DropZone } from "../convert/DropZone";
import { Button } from "../common/Button";
import { ProgressBar } from "../common/ProgressBar";
import { compressPdf } from "../../lib/pdf/compressPdf";
import { downloadBlob } from "../../lib/utils/download";
import { ACCEPTED_PDF_TYPE } from "../../lib/utils/constants";
import { useToast } from "../../hooks/useToast";
import { useT } from "../../hooks/useT";
import clsx from "clsx";

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CompressPanel() {
  const [file, setFile] = useState(null);
  const [preset, setPreset] = useState("medium");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [resultSize, setResultSize] = useState(null);
  const toast = useToast();
  const az = useT();

  function handleFiles(fileList) {
    const pdfFile = Array.from(fileList).find((f) => f.type === ACCEPTED_PDF_TYPE);
    if (!pdfFile) return;
    setFile(pdfFile);
    setResultSize(null);
  }

  async function handleCompress() {
    if (!file) return;
    setBusy(true);
    setProgress(0);
    try {
      const blob = await compressPdf(file, preset, setProgress);
      setResultSize(blob.size);
      downloadBlob(blob, `qedir-pdf-sixilmis-${file.name}`);
      toast.success(az.toast.converted);
    } catch {
      toast.error(az.common.error);
    } finally {
      setBusy(false);
    }
  }

  const presets = [
    { key: "low", label: az.compress.qualityLow },
    { key: "medium", label: az.compress.qualityMedium },
    { key: "high", label: az.compress.qualityHigh },
  ];

  return (
    <GlassPanel className="p-5">
      <div className="mb-5">
        <h1 className="font-heading font-bold text-xl text-heading">{az.compress.title}</h1>
        <p className="text-sm text-muted">{az.compress.subtitle}</p>
      </div>

      <div className="space-y-4">
        {!file && <DropZone accept={[ACCEPTED_PDF_TYPE]} multiple={false} onFiles={handleFiles} hint="PDF" />}

        {file && (
          <div className="flex items-center gap-3 rounded-lg bg-white/3 border border-border-glass px-3 py-2.5">
            <p className="flex-1 min-w-0 text-sm text-heading truncate">{file.name}</p>
            <span className="text-xs text-muted-2 shrink-0">
              {az.compress.originalSize}: {formatSize(file.size)}
            </span>
            <button onClick={() => setFile(null)} className="text-xs text-muted hover:text-heading shrink-0">
              {az.common.clear}
            </button>
          </div>
        )}

        {file && (
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.key}
                onClick={() => setPreset(p.key)}
                className={clsx(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                  preset === p.key ? "bg-gradient-brand text-white border-transparent" : "border-border-glass text-muted hover:text-heading"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {busy && <ProgressBar value={progress} />}

        {resultSize != null && (
          <p className="text-sm text-emerald-400">
            {az.compress.resultSize}: {formatSize(resultSize)}
          </p>
        )}

        {file && (
          <div className="flex justify-end pt-1">
            <Button variant="primary" disabled={busy} onClick={handleCompress}>
              <Minimize2 size={15} /> {az.compress.compressBtn}
            </Button>
          </div>
        )}
      </div>
    </GlassPanel>
  );
}
