import { create } from "zustand";

let nextId = 1;

export const useConversionStore = create((set) => ({
  jobs: [],

  addJob: (file, kind) => {
    const id = nextId++;
    set((s) => ({
      jobs: [...s.jobs, { id, file, kind, status: "pending", progress: 0, error: null, result: null }],
    }));
    return id;
  },

  updateJob: (id, patch) =>
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)),
    })),

  removeJob: (id) => set((s) => ({ jobs: s.jobs.filter((j) => j.id !== id) })),
  clearJobs: () => set({ jobs: [] }),
}));
