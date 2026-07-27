import html2pdf from "html2pdf.js";

// Renders a clone of the editor's plain content off-screen (never the
// gradient/glass dashboard — html2canvas doesn't reliably handle
// backdrop-filter), with Arial/12pt styles inlined explicitly since
// html2canvas doesn't always resolve CSS custom properties correctly.
export async function exportAsPdf(html, filename = "qedir-pdf-metn.pdf") {
  const container = document.createElement("div");
  container.innerHTML = html;
  Object.assign(container.style, {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#1a1a1a",
    background: "#ffffff",
    padding: "32px",
    width: "780px",
    position: "fixed",
    left: "-9999px",
    top: "0",
  });

  await document.fonts.ready;
  document.body.appendChild(container);

  try {
    await html2pdf()
      .set({
        margin: 10,
        filename,
        html2canvas: { scale: 2, backgroundColor: "#ffffff" },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      })
      .from(container)
      .save();
  } finally {
    document.body.removeChild(container);
  }
}
