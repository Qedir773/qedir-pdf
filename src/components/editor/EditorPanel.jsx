import { GlassPanel } from "../common/GlassPanel";
import { RichTextEditor } from "./RichTextEditor";
import { EditorToolbar } from "./EditorToolbar";
import { MetadataBar } from "./MetadataBar";

export function EditorPanel({ editorRef }) {
  return (
    <GlassPanel className="flex flex-col overflow-hidden">
      <div className="sticky top-0 z-10 bg-panel-2/90 backdrop-blur-sm">
        <EditorToolbar editorRef={editorRef} />
      </div>
      <div className="p-4">
        <RichTextEditor editorRef={editorRef} />
      </div>
      <MetadataBar />
    </GlassPanel>
  );
}
