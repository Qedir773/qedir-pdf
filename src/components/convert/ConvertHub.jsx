import { useState } from "react";
import { ImagePlus, FileSearch, FileType2, ScanText } from "lucide-react";
import { GlassPanel } from "../common/GlassPanel";
import { ImageToPdfPanel } from "./ImageToPdfPanel";
import { PdfExtractPanel } from "./PdfExtractPanel";
import { DocxToHtmlPanel } from "./DocxToHtmlPanel";
import { OcrPanel } from "./OcrPanel";
import { az } from "../../locales/az";
import clsx from "clsx";

const TOOLS = [
  { key: "image-to-pdf", label: az.convert.imageToPdf, icon: ImagePlus },
  { key: "pdf-extract", label: az.convert.pdfExtract, icon: FileSearch },
  { key: "docx-to-html", label: az.convert.docxToHtml, icon: FileType2 },
  { key: "ocr", label: az.convert.ocr, icon: ScanText },
];

export function ConvertHub({ editorRef }) {
  const [activeTool, setActiveTool] = useState("image-to-pdf");

  return (
    <GlassPanel className="p-5">
      <div className="mb-4">
        <h1 className="font-heading font-bold text-xl text-heading">{az.convert.title}</h1>
        <p className="text-sm text-muted">{az.convert.subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const active = activeTool === tool.key;
          return (
            <button
              key={tool.key}
              onClick={() => setActiveTool(tool.key)}
              className={clsx(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors",
                active
                  ? "bg-gradient-brand text-white border-transparent"
                  : "border-border-glass text-muted hover:text-heading hover:bg-white/5"
              )}
            >
              <Icon size={14} /> {tool.label}
            </button>
          );
        })}
      </div>

      {activeTool === "image-to-pdf" && <ImageToPdfPanel />}
      {activeTool === "pdf-extract" && <PdfExtractPanel editorRef={editorRef} />}
      {activeTool === "docx-to-html" && <DocxToHtmlPanel editorRef={editorRef} />}
      {activeTool === "ocr" && <OcrPanel editorRef={editorRef} />}
    </GlassPanel>
  );
}
