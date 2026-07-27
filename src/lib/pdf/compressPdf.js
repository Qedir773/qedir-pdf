import { jsPDF } from "jspdf";
import { pdfjsLib } from "./pdfWorker";

// Unlike the rest of the app (crop/convert/collage), a "compress" tool exists
// specifically to trade image fidelity for smaller file size, so JPEG
// re-rasterization here is intentional rather than a quality-loss bug.
export const COMPRESSION_PRESETS = {
  low: { scale: 2, quality: 0.85 },
  medium: { scale: 1.5, quality: 0.7 },
  high: { scale: 1, quality: 0.5 },
};

export async function compressPdf(file, presetKey, onProgress) {
  const { scale, quality } = COMPRESSION_PRESETS[presetKey];
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const doc = new jsPDF({ unit: "pt", compress: true });
  doc.deletePage(1);

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;

    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    const orientation = viewport.width >= viewport.height ? "l" : "p";
    doc.addPage([viewport.width, viewport.height], orientation);
    doc.addImage(dataUrl, "JPEG", 0, 0, viewport.width, viewport.height);
    onProgress?.(i / pdf.numPages);
  }

  return doc.output("blob");
}
