import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { PenTool, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { GlassPanel } from "../common/GlassPanel";
import { DropZone } from "../convert/DropZone";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { Spinner } from "../common/Spinner";
import { renderPdfPageForPreview, embedSignatureOnPage } from "../../lib/pdf/signPdf";
import { downloadBlob } from "../../lib/utils/download";
import { ACCEPTED_PDF_TYPE } from "../../lib/utils/constants";
import { useToast } from "../../hooks/useToast";
import { useT } from "../../hooks/useT";

const PREVIEW_WIDTH = 560;
const DEFAULT_BOX = { x: 40, y: 40, width: 160, height: 70 };

export function SignaturePanel() {
  const [file, setFile] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);
  const [box, setBox] = useState(DEFAULT_BOX);
  const [padOpen, setPadOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const az = useT();

  useEffect(() => {
    if (!file) return;
    setLoading(true);
    renderPdfPageForPreview(file, pageIndex, PREVIEW_WIDTH)
      .then(setPreview)
      .catch(() => toast.error(az.common.error))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, pageIndex]);

  function handleFiles(fileList) {
    const pdfFile = Array.from(fileList).find((f) => f.type === ACCEPTED_PDF_TYPE);
    if (!pdfFile) return;
    setFile(pdfFile);
    setPageIndex(0);
    setSignatureDataUrl(null);
  }

  async function handleConfirm() {
    if (!file || !preview || !signatureDataUrl) return;
    setBusy(true);
    try {
      const blob = await embedSignatureOnPage(file, pageIndex, signatureDataUrl, box, preview);
      downloadBlob(blob, `qedir-pdf-imzali-${file.name}`);
      toast.success(az.toast.converted);
    } catch {
      toast.error(az.common.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <GlassPanel className="p-5">
      <div className="mb-5">
        <h1 className="font-heading font-bold text-xl text-heading">{az.signature.title}</h1>
        <p className="text-sm text-muted">{az.signature.subtitle}</p>
      </div>

      <div className="space-y-4">
        {!file && <DropZone accept={[ACCEPTED_PDF_TYPE]} multiple={false} onFiles={handleFiles} hint="PDF" />}

        {loading && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted">
            <Spinner size={20} /> {az.common.loading}
          </div>
        )}

        {!loading && file && preview && (
          <>
            {preview.pageCount > 1 && (
              <div className="flex items-center justify-center gap-3 text-sm text-muted">
                <button
                  onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                  disabled={pageIndex === 0}
                  className="disabled:opacity-30"
                >
                  <ChevronLeft size={18} />
                </button>
                <span>
                  {az.signature.pageLabel} {pageIndex + 1} / {preview.pageCount}
                </span>
                <button
                  onClick={() => setPageIndex((p) => Math.min(preview.pageCount - 1, p + 1))}
                  disabled={pageIndex === preview.pageCount - 1}
                  className="disabled:opacity-30"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            <div
              className="relative mx-auto border border-border-glass rounded-lg overflow-hidden"
              style={{ width: preview.displayWidth, height: preview.displayHeight }}
            >
              <img src={preview.dataUrl} alt="" className="absolute inset-0 w-full h-full" draggable={false} />
              {signatureDataUrl && (
                <SignatureOverlay
                  src={signatureDataUrl}
                  box={box}
                  setBox={setBox}
                  bounds={{ width: preview.displayWidth, height: preview.displayHeight }}
                />
              )}
            </div>

            <div className="flex justify-center gap-3 pt-1">
              <Button variant="ghost" onClick={() => setPadOpen(true)}>
                <PenTool size={15} /> {signatureDataUrl ? az.signature.redo : az.signature.drawTitle}
              </Button>
              {signatureDataUrl && (
                <Button variant="primary" disabled={busy} onClick={handleConfirm}>
                  <Check size={15} /> {az.signature.confirm}
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      <SignaturePadModal
        open={padOpen}
        onClose={() => setPadOpen(false)}
        onConfirm={(dataUrl) => {
          setSignatureDataUrl(dataUrl);
          setPadOpen(false);
        }}
      />
    </GlassPanel>
  );
}

function SignaturePadModal({ open, onClose, onConfirm }) {
  const canvasRef = useRef(null);
  const padRef = useRef(null);
  const az = useT();

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
    padRef.current = new SignaturePad(canvas, { backgroundColor: "rgba(255,255,255,0)", penColor: "#0F1524" });
    return () => padRef.current?.off();
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title={az.signature.drawTitle}>
      <div className="space-y-4">
        <canvas ref={canvasRef} className="w-full h-48 rounded-lg bg-white touch-none" />
        <div className="flex justify-between gap-3">
          <Button variant="ghost" onClick={() => padRef.current?.clear()}>
            {az.signature.clear}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (!padRef.current || padRef.current.isEmpty()) return;
              onConfirm(padRef.current.toDataURL("image/png"));
            }}
          >
            <Check size={15} /> {az.signature.place}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function SignatureOverlay({ src, box, setBox, bounds }) {
  const dragState = useRef(null);

  function clamp(next) {
    return {
      x: Math.max(0, Math.min(bounds.width - next.width, next.x)),
      y: Math.max(0, Math.min(bounds.height - next.height, next.y)),
      width: Math.max(40, Math.min(bounds.width, next.width)),
      height: Math.max(20, Math.min(bounds.height, next.height)),
    };
  }

  function handleDragStart(e) {
    e.preventDefault();
    dragState.current = { mode: "move", startX: e.clientX, startY: e.clientY, box };
    window.addEventListener("pointermove", handleDragMove);
    window.addEventListener("pointerup", handleDragEnd);
  }

  function handleResizeStart(e) {
    e.preventDefault();
    e.stopPropagation();
    dragState.current = { mode: "resize", startX: e.clientX, startY: e.clientY, box };
    window.addEventListener("pointermove", handleDragMove);
    window.addEventListener("pointerup", handleDragEnd);
  }

  function handleDragMove(e) {
    const state = dragState.current;
    if (!state) return;
    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    if (state.mode === "move") {
      setBox(clamp({ ...state.box, x: state.box.x + dx, y: state.box.y + dy }));
    } else {
      setBox(clamp({ ...state.box, width: state.box.width + dx, height: state.box.height + dy }));
    }
  }

  function handleDragEnd() {
    dragState.current = null;
    window.removeEventListener("pointermove", handleDragMove);
    window.removeEventListener("pointerup", handleDragEnd);
  }

  return (
    <div
      className="absolute border-2 border-dashed border-brand-blue cursor-move"
      style={{ left: box.x, top: box.y, width: box.width, height: box.height }}
      onPointerDown={handleDragStart}
    >
      <img src={src} alt="" className="w-full h-full object-contain pointer-events-none" draggable={false} />
      <div
        onPointerDown={handleResizeStart}
        className="absolute -right-1.5 -bottom-1.5 h-3.5 w-3.5 rounded-full bg-brand-blue cursor-se-resize"
      />
    </div>
  );
}
