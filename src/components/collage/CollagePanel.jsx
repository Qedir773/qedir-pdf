import { useMemo, useState } from "react";
import { Images, LayoutGrid } from "lucide-react";
import { GlassPanel } from "../common/GlassPanel";
import { DropZone } from "../convert/DropZone";
import { FileQueueList } from "../convert/FileQueueList";
import { Button } from "../common/Button";
import { ImageCropModal } from "../common/ImageCropModal";
import { useConversionStore } from "../../store/useConversionStore";
import { buildCollagePdf } from "../../lib/pdf/collage";
import { downloadBlob } from "../../lib/utils/download";
import { ACCEPTED_IMAGE_TYPES, ACCEPTED_PDF_TYPE } from "../../lib/utils/constants";
import { useToast } from "../../hooks/useToast";
import { useImageCropQueue } from "../../hooks/useImageCropQueue";
import { useT } from "../../hooks/useT";

const ACCEPTED_TYPES = [...ACCEPTED_IMAGE_TYPES, ACCEPTED_PDF_TYPE];

export function CollagePanel() {
  const allJobs = useConversionStore((s) => s.jobs);
  const jobs = useMemo(() => allJobs.filter((j) => j.kind === "collage"), [allJobs]);
  const addJob = useConversionStore((s) => s.addJob);
  const updateJob = useConversionStore((s) => s.updateJob);
  const removeJob = useConversionStore((s) => s.removeJob);
  const toast = useToast();
  const az = useT();

  const [format, setFormat] = useState("a4");
  const [busy, setBusy] = useState(false);

  const { pendingFile, enqueue, confirmCrop, skipCrop } = useImageCropQueue((file) => addJob(file, "collage"));

  function handleFiles(fileList) {
    const toCrop = [];
    Array.from(fileList).forEach((file) => {
      if (file.type === ACCEPTED_PDF_TYPE) addJob(file, "collage");
      else toCrop.push(file);
    });
    if (toCrop.length) enqueue(toCrop);
  }

  async function handleBuild() {
    if (jobs.length === 0) return;
    setBusy(true);
    try {
      jobs.forEach((j) => updateJob(j.id, { status: "processing", progress: 0 }));
      const blob = await buildCollagePdf(
        jobs.map((j) => j.file),
        format,
        (progress) => jobs.forEach((j) => updateJob(j.id, { progress }))
      );
      jobs.forEach((j) => updateJob(j.id, { status: "done", progress: 1 }));
      downloadBlob(blob, `qedir-pdf-kolaj-${format}.pdf`);
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
        <h1 className="font-heading font-bold text-xl text-heading">{az.collage.title}</h1>
        <p className="text-sm text-muted">{az.collage.subtitle}</p>
      </div>

      <div className="space-y-4">
        <DropZone accept={ACCEPTED_TYPES} onFiles={handleFiles} hint="PNG, JPG, WEBP, PDF" />

        <div className="flex items-center gap-2 text-sm text-muted">
          <Images size={15} />
          {az.collage.queueCount(jobs.length)}
        </div>

        <FileQueueList jobs={jobs} onRemove={removeJob} />

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <LayoutGrid size={15} /> {az.collage.format}
          </span>
          <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
            <input
              type="radio"
              name="collage-format"
              checked={format === "a4"}
              onChange={() => setFormat("a4")}
              className="accent-brand-blue"
            />
            A4
          </label>
          <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
            <input
              type="radio"
              name="collage-format"
              checked={format === "a5"}
              onChange={() => setFormat("a5")}
              className="accent-brand-blue"
            />
            A5
          </label>
          <div className="flex-1" />
          <Button variant="primary" disabled={busy || jobs.length === 0} onClick={handleBuild}>
            <LayoutGrid size={15} /> {az.collage.build}
          </Button>
        </div>
      </div>

      <ImageCropModal file={pendingFile} onConfirm={confirmCrop} onSkip={skipCrop} />
    </GlassPanel>
  );
}
