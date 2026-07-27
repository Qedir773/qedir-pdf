import { useState } from "react";
import { GlassPanel } from "../common/GlassPanel";
import { Spinner } from "../common/Spinner";
import { AiActionButtons } from "./AiActionButtons";
import { TranslatorOptions } from "./TranslatorOptions";
import { ToneSelector } from "./ToneSelector";
import { AiResultPanel } from "./AiResultPanel";
import { generateText } from "../../lib/ai/geminiClient";
import { GeminiError } from "../../lib/ai/geminiErrors";
import { summarizePrompt, grammarFixPrompt, translatePrompt, toneRewritePrompt } from "../../lib/ai/prompts";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useToast } from "../../hooks/useToast";
import { TRANSLATE_LANGUAGES } from "../../lib/utils/constants";
import { az } from "../../locales/az";

export function AiStudio({ editorRef }) {
  const apiKey = useSettingsStore((s) => s.geminiApiKey);
  const toast = useToast();

  const [activeAction, setActiveAction] = useState("summarize");
  const [targetLang, setTargetLang] = useState(TRANSLATE_LANGUAGES[1]);
  const [tone, setTone] = useState(az.ai.toneFormal);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  function getSourceText() {
    const selected = window.getSelection()?.toString().trim();
    if (selected) return selected;
    return editorRef.current?.getPlainText()?.trim() ?? "";
  }

  async function runAction() {
    const text = getSourceText();
    if (!text) return;

    if (!apiKey) {
      toast.error(az.toast.apiKeyMissing);
      return;
    }

    let prompt;
    if (activeAction === "summarize") prompt = summarizePrompt(text);
    else if (activeAction === "grammar") prompt = grammarFixPrompt(text);
    else if (activeAction === "translate") prompt = translatePrompt(text, targetLang.label);
    else prompt = toneRewritePrompt(text, tone);

    setLoading(true);
    setResult("");
    try {
      const output = await generateText(prompt, apiKey);
      setResult(output);
    } catch (err) {
      toast.error(err instanceof GeminiError ? err.message : az.toast.genericAiError);
    } finally {
      setLoading(false);
    }
  }

  useKeyboardShortcuts({ onCtrlEnter: runAction });

  function handleApply() {
    editorRef.current?.setHtml(`<p>${result.replace(/\n/g, "<br>")}</p>`);
    setResult("");
    toast.success(az.toast.aiApplied);
  }

  function handleInsertNew() {
    editorRef.current?.insertHtmlAtCursor(`<p>${result.replace(/\n/g, "<br>")}</p>`);
    setResult("");
    toast.success(az.toast.aiApplied);
  }

  return (
    <GlassPanel className="p-5">
      <div className="mb-5">
        <h1 className="font-heading font-bold text-xl text-heading">{az.ai.title}</h1>
        <p className="text-sm text-muted">{az.ai.subtitle}</p>
      </div>

      <div className="space-y-5">
        <AiActionButtons activeAction={activeAction} onSelect={setActiveAction} />

        {activeAction === "translate" && <TranslatorOptions targetLang={targetLang} onChange={setTargetLang} />}
        {activeAction === "tone" && <ToneSelector tone={tone} onChange={setTone} />}

        <button
          onClick={runAction}
          disabled={loading}
          className="btn-primary w-full sm:w-auto disabled:opacity-50"
        >
          {loading ? <Spinner size={16} className="text-white" /> : null}
          {loading ? az.ai.running : `${az.common.confirm} (Ctrl+Enter)`}
        </button>

        {result && !loading && (
          <AiResultPanel text={result} onApply={handleApply} onInsertNew={handleInsertNew} onDiscard={() => setResult("")} />
        )}
      </div>
    </GlassPanel>
  );
}
