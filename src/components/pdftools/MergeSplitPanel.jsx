import { useState } from "react";
import { ArrowUp, ArrowDown, X, Combine, FileText, Loader2 } from "lucide-react";
import { GlassPanel } from "../common/GlassPanel";
import { DropZone } from "../convert/DropZone";
import { Button } from "../common/Button";
import { Spinner } from "../common/Spinner";
import { mergePdfs, loadPdfPageThumbnails, buildPdfFromPageOrder } from "../../lib/pdf/pdfPages";
import { downloadBlob } from "../../lib/utils/download";
import { ACCEPTED_PDF_TYPE } from "../../lib/utils/constants";
import { useToast } from "../../hooks/useToast";
import { useT } from "../../hooks/useT";
import clsx from "clsx";

function moveItem(list, index, delta) {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function MergeSplitPanel() {
  const [tab, setTab] = useState("merge");
  const az = useT();

  return (
    <GlassPanel className="p-5">
      <div className="mb-5">
        <h1 className="font-heading font-bold text-xl text-heading">{az.mergeSplit.title}</h1>
        <p className="text-sm text-muted">{az.mergeSplit.subtitle}</p>
      </div>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab("merge")}
          className={clsx(
            "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
            tab === "merge" ? "bg-gradient-brand text-white border-transparent" : "border-border-glass text-muted hover:text-heading"
          )}
        >
          {az.mergeSplit.mergeTab}
        </button>
        <button
          onClick={() => setTab("pages")}
          className={clsx(
            "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
            tab === "pages" ? "bg-gradient-brand text-white border-transparent" : "border-border-glass text-muted hover:text-heading"
          )}
        >
          {az.mergeSplit.pagesTab}
        </button>
      </div>

      {tab === "merge" ? <MergeTab /> : <PagesTab />}
    </GlassPanel>
  );
}

function MergeTab() {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const az = useT();

  function handleFiles(fileList) {
    setFiles((prev) => [...prev, ...Array.from(fileList).filter((f) => f.type === ACCEPTED_PDF_TYPE)]);
  }

  async function handleMerge() {
    if (files.length < 2) return;
    setBusy(true);
    try {
      const blob = await mergePdfs(files);
      downloadBlob(blob, "qedir-pdf-birlesdirilmis.pdf");
      toast.success(az.toast.converted);
    } catch {
      toast.error(az.common.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <DropZone accept={[ACCEPTED_PDF_TYPE]} onFiles={handleFiles} hint="PDF" />

      {files.length === 0 ? (
        <p className="text-sm text-muted-2 text-center py-4">{az.convert.queueEmpty}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`} className="flex items-center gap-3 rounded-lg bg-white/3 border border-border-glass px-3 py-2.5">
              <FileText size={16} className="text-muted shrink-0" />
              <p className="flex-1 min-w-0 text-sm text-heading truncate">{file.name}</p>
              <button onClick={() => setFiles((f) => moveItem(f, i, -1))} className="text-muted hover:text-heading disabled:opacity-30" disabled={i === 0}>
                <ArrowUp size={15} />
              </button>
              <button onClick={() => setFiles((f) => moveItem(f, i, 1))} className="text-muted hover:text-heading disabled:opacity-30" disabled={i === files.length - 1}>
                <ArrowDown size={15} />
              </button>
              <button onClick={() => setFiles((f) => f.filter((_, idx) => idx !== i))} className="text-muted hover:text-heading">
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end pt-1">
        <Button variant="primary" disabled={busy || files.length < 2} onClick={handleMerge}>
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Combine size={15} />} {az.mergeSplit.mergeBtn}
        </Button>
      </div>
    </div>
  );
}

function PagesTab() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const az = useT();

  async function handleFiles(fileList) {
    const pdfFile = Array.from(fileList).find((f) => f.type === ACCEPTED_PDF_TYPE);
    if (!pdfFile) return;
    setFile(pdfFile);
    setLoading(true);
    try {
      const thumbnails = await loadPdfPageThumbnails(pdfFile);
      setPages(thumbnails);
      setOrder(thumbnails.map((p) => p.index));
    } catch {
      toast.error(az.common.error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBuild() {
    if (!file || order.length === 0) return;
    setBusy(true);
    try {
      const blob = await buildPdfFromPageOrder(file, order);
      downloadBlob(blob, "qedir-pdf-duzenlenmis.pdf");
      toast.success(az.toast.converted);
    } catch {
      toast.error(az.common.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {!file && <DropZone accept={[ACCEPTED_PDF_TYPE]} multiple={false} onFiles={handleFiles} hint="PDF" />}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted">
          <Spinner size={20} /> {az.common.loading}
        </div>
      )}

      {!loading && file && order.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {order.map((pageIndex, pos) => (
              <div key={pageIndex} className="relative rounded-lg overflow-hidden border border-border-glass bg-white/3">
                <img src={pages[pageIndex].dataUrl} alt="" className="w-full h-auto block" />
                <div className="absolute top-1 left-1 rounded bg-black/60 text-white text-[11px] px-1.5 py-0.5">{pos + 1}</div>
                <div className="absolute top-1 right-1 flex gap-1">
                  <button
                    onClick={() => setOrder((o) => moveItem(o, pos, -1))}
                    disabled={pos === 0}
                    className="h-6 w-6 inline-flex items-center justify-center rounded bg-black/60 text-white disabled:opacity-30"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={() => setOrder((o) => moveItem(o, pos, 1))}
                    disabled={pos === order.length - 1}
                    className="h-6 w-6 inline-flex items-center justify-center rounded bg-black/60 text-white disabled:opacity-30"
                  >
                    <ArrowDown size={12} />
                  </button>
                  <button
                    onClick={() => setOrder((o) => o.filter((_, i) => i !== pos))}
                    className="h-6 w-6 inline-flex items-center justify-center rounded bg-black/60 text-white"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-1">
            <Button variant="primary" disabled={busy} onClick={handleBuild}>
              {busy ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />} {az.mergeSplit.buildBtn}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
