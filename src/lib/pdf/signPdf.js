import { PDFDocument } from "pdf-lib";
import { pdfjsLib } from "./pdfWorker";

// Renders one page for on-screen placement. The returned pdfWidth/pdfHeight
// are in PDF points (pdfjs scale:1 matches pdf-lib's page.getSize() units),
// so overlay coordinates can be converted back to point-space exactly.
export async function renderPdfPageForPreview(file, pageIndex, displayWidth) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(pageIndex + 1);
  const unscaledViewport = page.getViewport({ scale: 1 });
  const scale = displayWidth / unscaledViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;

  return {
    dataUrl: canvas.toDataURL("image/png"),
    displayWidth: viewport.width,
    displayHeight: viewport.height,
    pdfWidth: unscaledViewport.width,
    pdfHeight: unscaledViewport.height,
    pageCount: pdf.numPages,
  };
}

// box is { x, y, width, height } in the same pixel space as displayWidth/
// displayHeight from renderPdfPageForPreview (y grows downward from the top).
export async function embedSignatureOnPage(file, pageIndex, signaturePngDataUrl, box, previewMeta) {
  const src = await PDFDocument.load(await file.arrayBuffer());
  const pngImage = await src.embedPng(signaturePngDataUrl);

  const page = src.getPage(pageIndex);
  const scaleToPdf = previewMeta.pdfWidth / previewMeta.displayWidth;

  const width = box.width * scaleToPdf;
  const height = box.height * scaleToPdf;
  const x = box.x * scaleToPdf;
  const y = previewMeta.pdfHeight - (box.y * scaleToPdf) - height;

  page.drawImage(pngImage, { x, y, width, height });

  const bytes = await src.save();
  return new Blob([bytes], { type: "application/pdf" });
}
