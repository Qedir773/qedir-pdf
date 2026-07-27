import { jsPDF } from "jspdf";
import { pdfjsLib } from "./pdfWorker";
import { fileToPngDataUrl } from "./imagesToPdf";

const MAX_ITEMS_PER_PAGE = 9;
const MARGIN = 24;
const GAP = 10;

async function pdfFirstPageToPngDataUrl(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 3 });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;

  return { dataUrl: canvas.toDataURL("image/png"), width: viewport.width, height: viewport.height };
}

function fileToImageData(file) {
  return file.type === "application/pdf" ? pdfFirstPageToPngDataUrl(file) : fileToPngDataUrl(file);
}

function gridFor(count) {
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  return { cols, rows };
}

export async function buildCollagePdf(files, pageFormat, onProgress) {
  const images = [];
  for (let i = 0; i < files.length; i++) {
    images.push(await fileToImageData(files[i]));
    onProgress?.((i + 1) / files.length);
  }

  const doc = new jsPDF({ unit: "pt", format: pageFormat, compress: true });
  doc.deletePage(1);

  for (let start = 0; start < images.length; start += MAX_ITEMS_PER_PAGE) {
    const pageImages = images.slice(start, start + MAX_ITEMS_PER_PAGE);
    const { cols, rows } = gridFor(pageImages.length);

    doc.addPage(pageFormat, "p");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const cellW = (pageWidth - 2 * MARGIN - (cols - 1) * GAP) / cols;
    const cellH = (pageHeight - 2 * MARGIN - (rows - 1) * GAP) / rows;

    pageImages.forEach((img, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cellX = MARGIN + col * (cellW + GAP);
      const cellY = MARGIN + row * (cellH + GAP);

      const scale = Math.min(cellW / img.width, cellH / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;

      doc.addImage(img.dataUrl, "PNG", cellX + (cellW - drawW) / 2, cellY + (cellH - drawH) / 2, drawW, drawH);
    });
  }

  return doc.output("blob");
}
