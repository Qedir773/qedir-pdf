import { PDFDocument } from "pdf-lib";
import { pdfjsLib } from "./pdfWorker";

const THUMB_SCALE = 0.35;

export async function mergePdfs(files) {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const src = await PDFDocument.load(await file.arrayBuffer());
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  const bytes = await merged.save();
  return new Blob([bytes], { type: "application/pdf" });
}

export async function loadPdfPageThumbnails(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const thumbnails = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: THUMB_SCALE });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    thumbnails.push({ index: i - 1, dataUrl: canvas.toDataURL("image/jpeg", 0.8) });
  }
  return thumbnails;
}

// pageOrder is a 0-based array of source page indices, in the desired final
// order, already excluding any pages the user deleted.
export async function buildPdfFromPageOrder(file, pageOrder) {
  const src = await PDFDocument.load(await file.arrayBuffer());
  const doc = await PDFDocument.create();
  const pages = await doc.copyPages(src, pageOrder);
  pages.forEach((page) => doc.addPage(page));
  const bytes = await doc.save();
  return new Blob([bytes], { type: "application/pdf" });
}
