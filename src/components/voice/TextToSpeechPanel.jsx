import { Play, Pause, Square, Gauge, Venus, Mars } from "lucide-react";
import { Button } from "../common/Button";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useVoiceStore } from "../../store/useVoiceStore";
import { useToast } from "../../hooks/useToast";
import { az } from "../../locales/az";
import clsx from "clsx";

export function TextToSpeechPanel({ editorRef }) {
  const recognitionLang = useVoiceStore((s) => s.recognitionLang);
  const ttsRate = useSettingsStore((s) => s.ttsRate);
  const setTtsRate = useSettingsStore((s) => s.setTtsRate);
  const ttsVoiceGender = useSettingsStore((s) => s.ttsVoiceGender);
  const setTtsVoiceGender = useSettingsStore((s) => s.setTtsVoiceGender);
  const toast = useToast();

  const { isSpeaking, isPaused, unsupported, voiceUnavailable, play, pause, resume, stop } = useSpeechSynthesis({
    lang: recognitionLang,
    rate: ttsRate,
    gender: ttsVoiceGender,
  });

  function getTargetText() {
    const selected = window.getSelection()?.toString().trim();
    if (selected) return selected;
    return editorRef.current?.getPlainText()?.trim() ?? "";
  }

  function handlePlay() {
    if (unsupported) {
      toast.error(az.toast.micUnsupported);
      return;
    }
    const text = getTargetText();
    if (!text) return;
    if (voiceUnavailable) toast.info(az.voice.voiceFallback);
    play(text);
  }

  return (
    <div className="space-y-5">
      <h2 className="font-heading font-semibold text-heading">{az.voice.ttsTitle}</h2>

      {unsupported && (
        <p className="text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
          {az.voice.unsupportedBanner}
        </p>
      )}

      <div>
        <p className="text-xs text-muted-2 mb-1.5">{az.voice.voice}</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTtsVoiceGender("female")}
            className={clsx(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              ttsVoiceGender === "female"
                ? "bg-gradient-brand text-white border-transparent"
                : "border-border-glass text-muted hover:text-heading"
            )}
          >
            <Venus size={14} /> {az.voice.voiceFemale}
          </button>
          <button
            onClick={() => setTtsVoiceGender("male")}
            className={clsx(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              ttsVoiceGender === "male"
                ? "bg-gradient-brand text-white border-transparent"
                : "border-border-glass text-muted hover:text-heading"
            )}
          >
            <Mars size={14} /> {az.voice.voiceMale}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {!isSpeaking && (
          <Button variant="primary" onClick={handlePlay} disabled={unsupported}>
            <Play size={15} /> {az.voice.play}
          </Button>
        )}
        {isSpeaking && !isPaused && (
          <Button variant="ghost" onClick={pause}>
            <Pause size={15} /> {az.voice.pause}
          </Button>
        )}
        {isSpeaking && isPaused && (
          <Button variant="primary" onClick={resume}>
            <Play size={15} /> {az.voice.resume}
          </Button>
        )}
        {isSpeaking && (
          <Button variant="ghost" onClick={stop}>
            <Square size={15} /> {az.voice.stop}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3 max-w-xs">
        <Gauge size={16} className="text-muted shrink-0" />
        <span className="text-xs text-muted-2 shrink-0">{az.voice.speed}</span>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={ttsRate}
          onChange={(e) => setTtsRate(Number(e.target.value))}
          className="flex-1 accent-brand-blue"
        />
        <span className="text-xs text-muted w-8">{ttsRate.toFixed(1)}x</span>
      </div>
    </div>
  );
}
