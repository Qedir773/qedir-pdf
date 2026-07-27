// Wraps webkitSpeechRecognition/SpeechRecognition with continuous listening +
// auto-reconnect. Chrome/Edge (Chromium) only in practice — no Firefox support,
// partial/unreliable Safari.
export function isSpeechRecognitionSupported() {
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

const MAX_RETRIES = 5;

export function createRecognitionEngine({ lang, onInterimResult, onFinalResult, onStateChange, onUnsupportedError }) {
  const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionCtor) {
    return null;
  }

  let recognition = null;
  let manualStop = true;
  let retryCount = 0;

  function build() {
    const instance = new SpeechRecognitionCtor();
    instance.continuous = true;
    instance.interimResults = true;
    instance.lang = lang;

    instance.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          onFinalResult?.(transcript);
          retryCount = 0;
        } else {
          interim += transcript;
        }
      }
      if (interim) onInterimResult?.(interim);
    };

    instance.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        manualStop = true;
        onUnsupportedError?.(event.error);
      }
    };

    instance.onend = () => {
      if (!manualStop && retryCount < MAX_RETRIES) {
        retryCount += 1;
        setTimeout(() => {
          // Build a fresh instance rather than restarting the ended one —
          // some mobile browsers (Android Chrome in particular, where this
          // auto-restart fires much more often than on desktop) can briefly
          // keep delivering results from the old session, producing
          // duplicated/overlapping transcripts.
          if (!manualStop) {
            recognition = build();
            recognition.start();
          }
        }, 300 * retryCount);
      } else {
        onStateChange?.(false);
      }
    };

    return instance;
  }

  return {
    start() {
      manualStop = false;
      retryCount = 0;
      recognition = build();
      recognition.start();
      onStateChange?.(true);
    },
    stop() {
      manualStop = true;
      recognition?.stop();
      onStateChange?.(false);
    },
    setLang(newLang) {
      lang = newLang;
      if (recognition) recognition.lang = newLang;
    },
  };
}
