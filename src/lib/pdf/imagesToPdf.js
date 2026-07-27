import { jsPDF } from "jspdf";

// jsPDF doesn't support WEBP (and is finicky about odd JPEG encodings), so every
// image is round-tripped through an offscreen <canvas> to a PNG data URL first —
// simpler and more reliable than branching per source format.
function loadImageElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

async function fileToPngDataUrl(file) {
  const img = await loadImageElement(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return { dataUrl: canvas.toDataURL("image/png"), width: img.naturalWidth, height: img.naturalHeight };
}

export async function imagesToSinglePdf(files, onProgress) {
  const doc = new jsPDF({ unit: "pt", compress: true });
  doc.deletePage(1);

  for (let i = 0; i < files.length; i++) {
    const { dataUrl, width, height } = await fileToPngDataUrl(files[i]);
    const orientation = width >= height ? "l" : "p";
    doc.addPage([width, height], orientation);
    doc.addImage(dataUrl, "PNG", 0, 0, width, height);
    onProgress?.((i + 1) / files.length);
  }

  return doc.output("blob");
}

export async function imageToSinglePagePdf(file) {
  const { dataUrl, width, height } = await fileToPngDataUrl(file);
  const orientation = width >= height ? "l" : "p";
  const doc = new jsPDF({ unit: "pt", orientation, format: [width, height], compress: true });
  doc.addImage(dataUrl, "PNG", 0, 0, width, height);
  return doc.output("blob");
}
