import { Suspense, lazy, useRef } from "react";
import { useUiStore, SECTIONS } from "../../store/useUiStore";
import { Spinner } from "../common/Spinner";
import { EditorPanel } from "../editor/EditorPanel";

const ConvertHub = lazy(() => import("../convert/ConvertHub").then((m) => ({ default: m.ConvertHub })));
const VoiceStudio = lazy(() => import("../voice/VoiceStudio").then((m) => ({ default: m.VoiceStudio })));
const AiStudio = lazy(() => import("../ai/AiStudio").then((m) => ({ default: m.AiStudio })));
const CollagePanel = lazy(() => import("../collage/CollagePanel").then((m) => ({ default: m.CollagePanel })));
const MergeSplitPanel = lazy(() => import("../pdftools/MergeSplitPanel").then((m) => ({ default: m.MergeSplitPanel })));
const SignaturePanel = lazy(() => import("../pdftools/SignaturePanel").then((m) => ({ default: m.SignaturePanel })));
const CompressPanel = lazy(() => import("../pdftools/CompressPanel").then((m) => ({ default: m.CompressPanel })));
const RecentFilesPanel = lazy(() => import("../recent/RecentFilesPanel").then((m) => ({ default: m.RecentFilesPanel })));
const QrCodePanel = lazy(() => import("../qr/QrCodePanel").then((m) => ({ default: m.QrCodePanel })));

const NO_EDITOR_SECTIONS = [
  SECTIONS.AI,
  SECTIONS.COLLAGE,
  SECTIONS.MERGE_SPLIT,
  SECTIONS.SIGNATURE,
  SECTIONS.COMPRESS,
  SECTIONS.RECENT,
  SECTIONS.QR,
];

function SectionFallback() {
  return (
    <div className="flex items-center justify-center h-40">
      <Spinner size={26} />
    </div>
  );
}

export function Workspace() {
  const activeSection = useUiStore((s) => s.activeSection);
  const editorRef = useRef(null);

  return (
    <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6">
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <Suspense fallback={<SectionFallback />}>
          {activeSection === SECTIONS.CONVERT && <ConvertHub editorRef={editorRef} />}
          {activeSection === SECTIONS.VOICE && <VoiceStudio editorRef={editorRef} />}
          {activeSection === SECTIONS.AI && <AiStudio editorRef={editorRef} />}
          {activeSection === SECTIONS.COLLAGE && <CollagePanel />}
          {activeSection === SECTIONS.MERGE_SPLIT && <MergeSplitPanel />}
          {activeSection === SECTIONS.SIGNATURE && <SignaturePanel />}
          {activeSection === SECTIONS.COMPRESS && <CompressPanel />}
          {activeSection === SECTIONS.RECENT && <RecentFilesPanel />}
          {activeSection === SECTIONS.QR && <QrCodePanel />}
        </Suspense>
        {!NO_EDITOR_SECTIONS.includes(activeSection) && <EditorPanel editorRef={editorRef} />}
      </div>
    </main>
  );
}
