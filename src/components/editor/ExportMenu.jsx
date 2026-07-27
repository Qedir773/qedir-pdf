import { useState, useRef, useEffect } from "react";
import { Download, ChevronDown, FileText, FileType, FileDown } from "lucide-react";
import { Button } from "../common/Button";
import { exportAsTxt } from "../../lib/export/exportTxt";
import { useToast } from "../../hooks/useToast";
import { useT } from "../../hooks/useT";

export function ExportMenu({ editorRef }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const menuRef = useRef(null);
  const toast = useToast();
  const az = useT();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function runExport(loadFn) {
    const html = editorRef.current?.getHtml() ?? "";
    setBusy(true);
    setOpen(false);
    try {
      const fn = await loadFn();
      await fn(html);
      toast.success(az.toast.exported);
    } catch {
      toast.error(az.common.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button variant="primary" disabled={busy} onClick={() => setOpen((o) => !o)}>
        <Download size={15} /> {az.editor.export} <ChevronDown size={14} />
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 glass-panel bg-panel-2! p-1.5 z-30">
          <button
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-heading hover:bg-white/8"
            onClick={() => runExport(() => Promise.resolve(exportAsTxt))}
          >
            <FileText size={15} /> {az.editor.exportTxt}
          </button>
          <button
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-heading hover:bg-white/8"
            onClick={() => runExport(() => import("../../lib/export/exportDocx").then((m) => m.exportAsDocx))}
          >
            <FileType size={15} /> {az.editor.exportDocx}
          </button>
          <button
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-heading hover:bg-white/8"
            onClick={() => runExport(() => import("../../lib/export/exportPdf").then((m) => m.exportAsPdf))}
          >
            <FileDown size={15} /> {az.editor.exportPdf}
          </button>
        </div>
      )}
    </div>
  );
}
