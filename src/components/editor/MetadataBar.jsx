import { CheckCircle2, Loader2 } from "lucide-react";
import { useTextMetrics } from "../../hooks/useTextMetrics";
import { useAutoSaveStatus } from "../../hooks/useAutoSave";
import { useEditorStore } from "../../store/useEditorStore";
import { useT } from "../../hooks/useT";

export function MetadataBar() {
  const content = useEditorStore((s) => s.content);
  const lastSavedAt = useEditorStore((s) => s.lastSavedAt);
  const metrics = useTextMetrics(content);
  const saveStatus = useAutoSaveStatus(lastSavedAt);
  const az = useT();

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-2 text-xs text-muted border-t border-border-glass">
      <span>{metrics.words} {az.editor.words}</span>
      <span>{metrics.charsWithSpaces} {az.editor.chars}</span>
      <span>{metrics.charsNoSpaces} {az.editor.charsNoSpaces}</span>
      <span>{metrics.sentences} {az.editor.sentences}</span>
      <div className="flex-1" />
      <span className="inline-flex items-center gap-1.5">
        {saveStatus === "saving" ? (
          <>
            <Loader2 size={13} className="animate-spin text-brand-blue" />
            {az.editor.autosaveSaving}
          </>
        ) : saveStatus === "saved" ? (
          <>
            <CheckCircle2 size={13} className="text-emerald-400" />
            {az.editor.autosaveOn}
          </>
        ) : null}
      </span>
    </div>
  );
}
