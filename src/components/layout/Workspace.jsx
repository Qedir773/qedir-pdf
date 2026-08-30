import { Suspense, lazy, useRef } from "react";
import { useUiStore, SECTIONS } from "../../store/useUiStore";
import { Spinner } from "../common/Spinner";
import { EditorPanel } from "../editor/EditorPanel";
import { Youtube, ArrowUpRight } from "lucide-react";
import { useT } from "../../hooks/useT";

const YOUTUBE_STUDIO_URL = "https://tubeforge-studio.qedirvahidov.workers.dev";

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
  const az = useT();

  return (
    <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6">
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <a
          href={YOUTUBE_STUDIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-600/20 via-panel/80 to-panel/60 p-5 hover:border-red-500/60 hover:shadow-xl hover:shadow-red-950/20 transition-all"
        >
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-950/30">
            <Youtube size={30} strokeWidth={2.2} />
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block text-lg font-heading text-heading">{az.nav.youtubeVideo}</strong>
            <span className="mt-1 block text-sm text-muted">{az.nav.youtubeVideoDescription}</span>
          </span>
          <span className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white group-hover:bg-red-500 transition-colors">
            {az.nav.youtubeVideoOpen}
            <ArrowUpRight size={17} />
          </span>
        </a>
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
