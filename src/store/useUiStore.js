import { create } from "zustand";

export const SECTIONS = {
  CONVERT: "convert",
  VOICE: "voice",
  AI: "ai",
};

export const useUiStore = create((set) => ({
  activeSection: SECTIONS.CONVERT,
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  settingsOpen: false,

  setActiveSection: (section) => set({ activeSection: section, mobileSidebarOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  setSettingsOpen: (open) => set({ settingsOpen: open }),
}));
