import { File, X, CheckCircle2, AlertCircle } from "lucide-react";
import { ProgressBar } from "../common/ProgressBar";
import { az } from "../../locales/az";

export function FileQueueList({ jobs, onRemove }) {
  if (!jobs || jobs.length === 0) {
    return <p className="text-sm text-muted-2 text-center py-4">{az.convert.queueEmpty}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {jobs.map((job) => (
        <div key={job.id} className="flex items-center gap-3 rounded-lg bg-white/3 border border-border-glass px-3 py-2.5">
          <File size={16} className="text-muted shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-heading truncate">{job.file.name}</p>
            {job.status === "processing" && <ProgressBar value={job.progress} />}
            {job.status === "error" && <p className="text-xs text-red-400">{job.error}</p>}
          </div>
          {job.status === "done" && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
          {job.status === "error" && <AlertCircle size={16} className="text-red-400 shrink-0" />}
          {onRemove && (
            <button onClick={() => onRemove(job.id)} className="text-muted hover:text-heading shrink-0">
              <X size={15} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
