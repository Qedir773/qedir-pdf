// Wraps window.speechSynthesis. Long utterances (~15s+) can silently cut off in
// Chromium, especially on inactive tabs, so text is chunked into sentence-sized
// utterances queued sequentially — this also gives natural Pause/Resume points.
export function isSpeechSynthesisSupported() {
  return "speechSynthesis" in window;
}

export function getVoicesAsync() {
  return new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };
  });
}

// Browsers don't expose a real gender field on SpeechSynthesisVoice, so gender
// is guessed from well-known voice name patterns across Chrome/Edge/macOS/Android.
const FEMALE_NAME_HINTS = [
  "female", "zira", "aria", "samantha", "susan", "victoria", "karen", "moira",
  "tessa", "salli", "joanna", "kimberly", "amy", "emma", "ivy", "sarah", "fiona",
  "kate", "anna", "hazel", "olivia",
];
const MALE_NAME_HINTS = [
  "male", "david", "mark", "daniel", "james", "george", "guy", "ryan", "matthew",
  "justin", "brian", "fred", "alex", "diego", "juan", "yuri", "tom", "eric",
];

export function guessVoiceGender(voice) {
  const name = voice.name.toLowerCase();
  if (FEMALE_NAME_HINTS.some((hint) => name.includes(hint))) return "female";
  if (MALE_NAME_HINTS.some((hint) => name.includes(hint))) return "male";
  return "unknown";
}

// Picks the best available voice for a language + gender preference, falling
// back gracefully when no exact match exists (rather than erroring): same
// language any gender -> same gender any language -> null (browser default).
export function pickVoice(voices, langCode, preferredGender) {
  const langPrefix = langCode.split("-")[0];
  const sameLang = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));

  const exact = sameLang.find((v) => guessVoiceGender(v) === preferredGender);
  if (exact) return { voice: exact, exactMatch: true };

  if (sameLang.length > 0) return { voice: sameLang[0], exactMatch: false };

  const genderOnly = voices.find((v) => guessVoiceGender(v) === preferredGender);
  if (genderOnly) return { voice: genderOnly, exactMatch: false };

  return { voice: null, exactMatch: false };
}

function chunkIntoSentences(text) {
  const sentences = text.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) || [text];
  return sentences.map((s) => s.trim()).filter(Boolean);
}

export function createSpeechQueue({ lang, rate, voice, onEnd, onBoundary }) {
  const synth = window.speechSynthesis;
  let queue = [];
  let currentIndex = 0;
  let stopped = true;

  function speakNext() {
    if (currentIndex >= queue.length) {
      stopped = true;
      onEnd?.();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(queue[currentIndex]);
    utterance.lang = lang;
    utterance.rate = rate;
    if (voice) utterance.voice = voice;
    utterance.onstart = () => onBoundary?.(currentIndex, queue.length);
    utterance.onend = () => {
      currentIndex += 1;
      if (!stopped) speakNext();
    };
    synth.speak(utterance);
  }

  return {
    speak(text) {
      synth.cancel();
      queue = chunkIntoSentences(text);
      currentIndex = 0;
      stopped = false;
      speakNext();
    },
    pause() {
      synth.pause();
    },
    resume() {
      synth.resume();
    },
    stop() {
      stopped = true;
      synth.cancel();
    },
  };
}
