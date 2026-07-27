import { useEffect, useRef, useState } from "react";
import {
  createSpeechQueue,
  getVoicesAsync,
  isSpeechSynthesisSupported,
  pickVoice,
} from "../lib/speech/synthesisEngine";

export function useSpeechSynthesis({ lang, rate, gender }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [unsupported] = useState(!isSpeechSynthesisSupported());
  const [voices, setVoices] = useState([]);
  const queueRef = useRef(null);

  useEffect(() => {
    if (unsupported) return;
    getVoicesAsync().then(setVoices);
  }, [unsupported]);

  const { voice: resolvedVoice, exactMatch } = pickVoice(voices, lang, gender);

  useEffect(() => {
    if (unsupported) return undefined;
    queueRef.current = createSpeechQueue({
      lang,
      rate,
      voice: resolvedVoice,
      onEnd: () => {
        setIsSpeaking(false);
        setIsPaused(false);
      },
    });
    return () => queueRef.current?.stop();
    // resolvedVoice is derived from `voices`/`lang`/`gender` each render, so it's
    // covered by those deps — including the object itself would recreate the
    // queue on every render since pickVoice returns a new wrapper object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unsupported, lang, rate, voices, gender]);

  return {
    isSpeaking,
    isPaused,
    unsupported,
    voiceUnavailable: voices.length > 0 && !exactMatch,
    play: (text) => {
      queueRef.current?.speak(text);
      setIsSpeaking(true);
      setIsPaused(false);
    },
    pause: () => {
      queueRef.current?.pause();
      setIsPaused(true);
    },
    resume: () => {
      queueRef.current?.resume();
      setIsPaused(false);
    },
    stop: () => {
      queueRef.current?.stop();
      setIsSpeaking(false);
      setIsPaused(false);
    },
  };
}
