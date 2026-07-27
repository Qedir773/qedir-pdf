import { useState } from "react";
import { MicButton } from "./MicButton";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { useVoiceStore } from "../../store/useVoiceStore";
import { useToast } from "../../hooks/useToast";
import { SPEECH_LANGUAGES } from "../../lib/utils/constants";
import { useT } from "../../hooks/useT";
import clsx from "clsx";

export function SpeechToTextPanel({ editorRef }) {
  const recognitionLang = useVoiceStore((s) => s.recognitionLang);
  const setRecognitionLang = useVoiceStore((s) => s.setRecognitionLang);
  const [interim, setInterim] = useState("");
  const toast = useToast();
  const az = useT();

  const { isListening, unsupported, start, stop } = useSpeechRecognition({
    lang: recognitionLang,
    onFinalResult: (text) => {
      editorRef.current?.insertDictatedText(text + " ");
      setInterim("");
    },
    onInterimResult: setInterim,
  });

  function handleToggle() {
    if (unsupported) {
      toast.error(az.toast.micUnsupported);
      return;
    }
    if (isListening) {
      stop();
    } else {
      start();
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="font-heading font-semibold text-heading">{az.voice.sttTitle}</h2>

      {unsupported && (
        <p className="text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
          {az.voice.unsupportedBanner}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {SPEECH_LANGUAGES.map((l) => (
          <button
            key={l.code}
            onClick={() => setRecognitionLang(l.code)}
            className={clsx(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              recognitionLang === l.code
                ? "bg-gradient-brand text-white border-transparent"
                : "border-border-glass text-muted hover:text-heading"
            )}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 py-4">
        <MicButton listening={isListening} onClick={handleToggle} disabled={unsupported} />
        <p className="text-sm text-muted">{isListening ? az.voice.listening : az.voice.start}</p>
        {interim && <p className="text-sm text-muted-2 italic max-w-md text-center">{interim}</p>}
      </div>
    </div>
  );
}
