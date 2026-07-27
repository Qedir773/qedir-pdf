import { useEffect, useState } from "react";
import { History, Download, Trash2, FileIcon } from "lucide-react";
import { GlassPanel } from "../common/GlassPanel";
import { Button } from "../common/Button";
import { getRecentFiles, deleteRecentFile, clearRecentFiles } from "../../lib/storage/recentFiles";
import { downloadBlob } from "../../lib/utils/download";
import { useT } from "../../hooks/useT";

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(ts) {
  return new Date(ts).toLocaleString();
}

export function RecentFilesPanel() {
  const [files, setFiles] = useState(null);
  const az = useT();

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    getRecentFiles().then(setFiles);
  }

  async function handleDelete(id) {
    await deleteRecentFile(id);
    refresh();
  }

  async function handleClearAll() {
    await clearRecentFiles();
    refresh();
  }

  function handleDownload(entry) {
    // Downloading from history shouldn't re-add itself as a new history entry.
    const url = URL.createObjectURL(entry.blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = entry.name;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <GlassPanel className="p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-heading font-bold text-xl text-heading">{az.recent.title}</h1>
          <p className="text-sm text-muted">{az.recent.subtitle}</p>
        </div>
        {files && files.length > 0 && (
          <Button variant="ghost" onClick={handleClearAll}>
            <Trash2 size={15} /> {az.recent.clearAll}
          </Button>
        )}
      </div>

      {files === null && <p className="text-sm text-muted-2 text-center py-4">{az.common.loading}</p>}

      {files && files.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <History size={28} className="text-muted-2" />
          <p className="text-sm text-muted-2">{az.recent.empty}</p>
        </div>
      )}

      {files && files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3 rounded-lg bg-white/3 border border-border-glass px-3 py-2.5">
              <FileIcon size={16} className="text-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-heading truncate">{entry.name}</p>
                <p className="text-xs text-muted-2">
                  {formatSize(entry.size)} · {formatDate(entry.createdAt)}
                </p>
              </div>
              <button onClick={() => handleDownload(entry)} className="text-muted hover:text-heading shrink-0" aria-label={az.recent.download}>
                <Download size={16} />
              </button>
              <button onClick={() => handleDelete(entry.id)} className="text-muted hover:text-heading shrink-0" aria-label={az.recent.delete}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </GlassPanel>
  );
}
