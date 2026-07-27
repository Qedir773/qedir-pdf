import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LOCALSTORAGE_KEYS } from "../lib/utils/constants";

export const useLocaleStore = create(
  persist(
    (set) => ({
      locale: "az",
      setLocale: (locale) => set({ locale }),
    }),
    { name: LOCALSTORAGE_KEYS.locale }
  )
);
