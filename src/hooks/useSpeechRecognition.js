import { useEffect, useRef, useState } from "react";
import { createRecognitionEngine, isSpeechRecognitionSupported } from "../lib/speech/recognitionEngine";

export function useSpeechRecognition({ lang, onFinalResult, onInterimResult }) {
  const [isListening, setIsListening] = useState(false);
  const [unsupported] = useState(!isSpeechRecognitionSupported());
  const engineRef = useRef(null);
  const onFinalResultRef = useRef(onFinalResult);
  const onInterimResultRef = useRef(onInterimResult);
  onFinalResultRef.current = onFinalResult;
  onInterimResultRef.current = onInterimResult;

  useEffect(() => {
    if (unsupported) return undefined;
    engineRef.current = createRecognitionEngine({
      lang,
      onFinalResult: (text) => onFinalResultRef.current?.(text),
      onInterimResult: (text) => onInterimResultRef.current?.(text),
      onStateChange: setIsListening,
      onUnsupportedError: () => setIsListening(false),
    });
    return () => engineRef.current?.stop();
    // `lang` deliberately excluded: the engine is built once with the initial
    // language, and later language changes are applied via setLang() below
    // instead of tearing down/recreating the whole engine mid-session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unsupported]);

  useEffect(() => {
    engineRef.current?.setLang(lang);
  }, [lang]);

  return {
    isListening,
    unsupported,
    start: () => engineRef.current?.start(),
    stop: () => engineRef.current?.stop(),
  };
}
