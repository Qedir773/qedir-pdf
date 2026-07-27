import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LOCALSTORAGE_KEYS } from "../lib/utils/constants";

export const useEditorStore = create(
  persist(
    (set) => ({
      content: "",
      lastSavedAt: null,
      setContent: (html) => set({ content: html, lastSavedAt: Date.now() }),
      clearContent: () => set({ content: "", lastSavedAt: Date.now() }),
    }),
    {
      name: LOCALSTORAGE_KEYS.editorContent,
      partialize: (state) => ({ content: state.content }),
    }
  )
);
