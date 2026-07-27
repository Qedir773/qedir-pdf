import { useToastStore } from "../store/useToastStore";

export function useToast() {
  const showToast = useToastStore((s) => s.showToast);
  return {
    success: (msg) => showToast(msg, "success"),
    error: (msg) => showToast(msg, "error"),
    info: (msg) => showToast(msg, "info"),
  };
}
