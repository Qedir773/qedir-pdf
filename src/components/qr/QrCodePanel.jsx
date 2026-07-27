import { useState } from "react";
import QRCode from "qrcode";
import { QrCode, Download } from "lucide-react";
import { GlassPanel } from "../common/GlassPanel";
import { Button } from "../common/Button";
import { downloadBlob } from "../../lib/utils/download";
import { useToast } from "../../hooks/useToast";
import { useT } from "../../hooks/useT";

export function QrCodePanel() {
  const [text, setText] = useState("");
  const [dataUrl, setDataUrl] = useState(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const az = useT();

  async function handleGenerate() {
    if (!text.trim()) return;
    setBusy(true);
    try {
      const url = await QRCode.toDataURL(text, { width: 480, margin: 2 });
      setDataUrl(url);
    } catch {
      toast.error(az.common.error);
    } finally {
      setBusy(false);
    }
  }

  async function handleDownload() {
    if (!dataUrl) return;
    const blob = await (await fetch(dataUrl)).blob();
    downloadBlob(blob, "qedir-pdf-qr-kod.png");
    toast.success(az.toast.exported);
  }

  return (
    <GlassPanel className="p-5">
      <div className="mb-5">
        <h1 className="font-heading font-bold text-xl text-heading">{az.qr.title}</h1>
        <p className="text-sm text-muted">{az.qr.subtitle}</p>
      </div>

      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={az.qr.placeholder}
          rows={3}
          className="w-full rounded-xl bg-white/3 border border-border-glass px-3 py-2.5 text-sm text-heading placeholder:text-muted-2 outline-none focus:border-brand-blue"
        />

        <div className="flex justify-end">
          <Button variant="primary" disabled={busy || !text.trim()} onClick={handleGenerate}>
            <QrCode size={15} /> {az.qr.generate}
          </Button>
        </div>

        {dataUrl && (
          <div className="flex flex-col items-center gap-3 pt-2">
            <img src={dataUrl} alt="QR" className="rounded-lg bg-white p-2 w-48 h-48" />
            <Button variant="ghost" onClick={handleDownload}>
              <Download size={15} /> {az.qr.download}
            </Button>
          </div>
        )}
      </div>
    </GlassPanel>
  );
}
