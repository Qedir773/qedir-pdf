import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { ApiKeyGuide } from "./ApiKeyGuide";
import { useUiStore } from "../../store/useUiStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useToast } from "../../hooks/useToast";
import { az } from "../../locales/az";

export function SettingsModal() {
  const open = useUiStore((s) => s.settingsOpen);
  const setOpen = useUiStore((s) => s.setSettingsOpen);
  const savedKey = useSettingsStore((s) => s.geminiApiKey);
  const setGeminiApiKey = useSettingsStore((s) => s.setGeminiApiKey);
  const toast = useToast();

  const [draftKey, setDraftKey] = useState(savedKey);
  const [visible, setVisible] = useState(false);

  function handleSave() {
    setGeminiApiKey(draftKey.trim());
    toast.success(az.common.save + " ✓");
    setOpen(false);
  }

  return (
    <Modal open={open} onClose={() => setOpen(false)} title={az.settings.title}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-heading mb-1.5 flex items-center gap-1.5">
            <KeyRound size={15} className="text-brand-blue" />
            {az.settings.apiKeyLabel}
          </label>
          <div className="relative">
            <input
              type={visible ? "text" : "password"}
              value={draftKey}
              onChange={(e) => setDraftKey(e.target.value)}
              placeholder={az.settings.apiKeyPlaceholder}
              className="w-full rounded-lg bg-white/5 border border-border-glass px-3 py-2.5 pr-16 text-sm font-mono text-heading placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-heading inline-flex items-center gap-1"
            >
              {visible ? <EyeOff size={14} /> : <Eye size={14} />}
              {visible ? az.settings.hide : az.settings.show}
            </button>
          </div>
          <p className="text-xs text-muted-2 mt-1.5">{az.settings.apiKeyHelp}</p>
        </div>

        <ApiKeyGuide />

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            {az.common.cancel}
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {az.common.save}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
