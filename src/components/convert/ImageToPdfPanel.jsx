import { useMemo, useState } from "react";
import { FileImage } from "lucide-react";
import { DropZone } from "./DropZone";
import { FileQueueList } from "./FileQueueList";
import { Button } from "../common/Button";
import { useConversionStore } from "../../store/useConversionStore";
import { imagesToSinglePdf, imageToSinglePagePdf } from "../../lib/pdf/imagesToPdf";
import { downloadBlob } from "../../lib/utils/download";
import { ACCEPTED_IMAGE_TYPES } from "../../lib/utils/constants";
import { useToast } from "../../hooks/useToast";
import { az } from "../../locales/az";

export function ImageToPdfPanel() {
  const allJobs = useConversionStore((s) => s.jobs);
  const jobs = useMemo(() => allJobs.filter((j) => j.kind === "image-to-pdf"), [allJobs]);
  const addJob = useConversionStore((s) => s.addJob);
  const updateJob = useConversionStore((s) => s.updateJob);
  const removeJob = useConversionStore((s) => s.removeJob);
  const toast = useToast();

  const [combine, setCombine] = useState(true);
  const [busy, setBusy] = useState(false);

  function handleFiles(fileList) {
    Array.from(fileList).forEach((file) => addJob(file, "image-to-pdf"));
  }

  async function handleConvert() {
    if (jobs.length === 0) return;
    setBusy(true);
    try {
      if (combine) {
        jobs.forEach((j) => updateJob(j.id, { status: "processing", progress: 0 }));
        const blob = await imagesToSinglePdf(
          jobs.map((j) => j.file),
          (progress) => jobs.forEach((j) => updateJob(j.id, { progress }))
        );
        jobs.forEach((j) => updateJob(j.id, { status: "done", progress: 1 }));
        downloadBlob(blob, "qedir-pdf-birlesik.pdf");
      } else {
        for (const job of jobs) {
          updateJob(job.id, { status: "processing", progress: 0.3 });
          const blob = await imageToSinglePagePdf(job.file);
          updateJob(job.id, { status: "done", progress: 1 });
          downloadBlob(blob, job.file.name.replace(/\.[^.]+$/, "") + ".pdf");
        }
      }
      toast.success(az.toast.converted);
    } catch {
      toast.error(az.common.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <DropZone accept={ACCEPTED_IMAGE_TYPES} onFiles={handleFiles} hint="PNG, JPG, WEBP" />
      <FileQueueList jobs={jobs} onRemove={removeJob} />

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
          <input
            type="radio"
            name="combine-mode"
            checked={combine}
            onChange={() => setCombine(true)}
            className="accent-brand-blue"
          />
          {az.convert.combineImages}
        </label>
        <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
          <input
            type="radio"
            name="combine-mode"
            checked={!combine}
            onChange={() => setCombine(false)}
            className="accent-brand-blue"
          />
          {az.convert.convertEach}
        </label>
        <div className="flex-1" />
        <Button variant="primary" disabled={busy || jobs.length === 0} onClick={handleConvert}>
          <FileImage size={15} /> {az.convert.startConvert}
        </Button>
      </div>
    </div>
  );
}
