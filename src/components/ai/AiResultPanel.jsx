import { CheckCheck, PlusCircle, X } from "lucide-react";
import { Button } from "../common/Button";
import { az } from "../../locales/az";

export function AiResultPanel({ text, onApply, onInsertNew, onDiscard }) {
  return (
    <div className="space-y-3 rounded-xl border border-border-glass bg-white/3 p-4">
      <p className="text-xs font-semibold text-muted-2 uppercase tracking-wide">{az.ai.resultTitle}</p>
      <div className="max-h-56 overflow-y-auto text-sm text-heading whitespace-pre-wrap">{text}</div>
      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button variant="primary" onClick={onApply}>
          <CheckCheck size={15} /> {az.ai.apply}
        </Button>
        <Button variant="ghost" onClick={onInsertNew}>
          <PlusCircle size={15} /> {az.ai.insertNew}
        </Button>
        <Button variant="ghost" onClick={onDiscard}>
          <X size={15} /> {az.ai.discard}
        </Button>
      </div>
    </div>
  );
}
