import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LOCALSTORAGE_KEYS } from "../lib/utils/constants";

export const useSettingsStore = create(
  persist(
    (set) => ({
      geminiApiKey: "",
      ttsRate: 1,
      ttsVoiceGender: "female",
      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
      setTtsRate: (rate) => set({ ttsRate: rate }),
      setTtsVoiceGender: (gender) => set({ ttsVoiceGender: gender }),
    }),
    { name: LOCALSTORAGE_KEYS.settings }
  )
);
