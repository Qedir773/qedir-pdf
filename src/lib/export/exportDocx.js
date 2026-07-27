import { Document, Packer, Paragraph, TextRun } from "docx";
import { downloadBlob } from "../utils/download";

function htmlToParagraphTexts(html) {
  const container = document.createElement("div");
  container.innerHTML = html;

  const blocks = container.querySelectorAll("p, div, h1, h2, h3, li, br");
  if (blocks.length === 0) {
    const text = container.textContent || "";
    return text.split("\n").filter((l) => l.length > 0);
  }

  const lines = [];
  blocks.forEach((block) => {
    if (block.tagName === "BR") return;
    const text = block.textContent.trim();
    if (text.length > 0) lines.push(text);
  });
  return lines.length > 0 ? lines : [(container.textContent || "").trim()];
}

export async function exportAsDocx(html, filename = "qedir-pdf-metn.docx") {
  const paragraphTexts = htmlToParagraphTexts(html);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphTexts.map(
          (line) =>
            new Paragraph({
              children: [new TextRun({ text: line, font: "Arial", size: 24 })],
              spacing: { after: 160 },
            })
        ),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, filename);
}
