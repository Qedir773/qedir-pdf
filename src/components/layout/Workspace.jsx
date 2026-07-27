import { Suspense, lazy, useRef } from "react";
import { useUiStore, SECTIONS } from "../../store/useUiStore";
import { Spinner } from "../common/Spinner";
import { EditorPanel } from "../editor/EditorPanel";

const ConvertHub = lazy(() => import("../convert/ConvertHub").then((m) => ({ default: m.ConvertHub })));
const VoiceStudio = lazy(() => import("../voice/VoiceStudio").then((m) => ({ default: m.VoiceStudio })));
const AiStudio = lazy(() => import("../ai/AiStudio").then((m) => ({ default: m.AiStudio })));
const CollagePanel = lazy(() => import("../collage/CollagePanel").then((m) => ({ default: m.CollagePanel })));

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
        </Suspense>
        {activeSection !== SECTIONS.AI && activeSection !== SECTIONS.COLLAGE && (
          <EditorPanel editorRef={editorRef} />
        )}
      </div>
    </main>
  );
}
