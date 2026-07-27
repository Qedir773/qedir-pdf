import { create } from "zustand";

export const useVoiceStore = create((set) => ({
  isListening: false,
  recognitionLang: "az-AZ",
  isSpeaking: false,
  isPaused: false,

  setIsListening: (v) => set({ isListening: v }),
  setRecognitionLang: (lang) => set({ recognitionLang: lang }),
  setIsSpeaking: (v) => set({ isSpeaking: v }),
  setIsPaused: (v) => set({ isPaused: v }),
}));
