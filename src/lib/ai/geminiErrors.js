import { az } from "../../locales/az";

export class GeminiError extends Error {
  constructor(kind, message) {
    super(message);
    this.kind = kind;
  }
}

export function mapHttpStatusToMessage(status) {
  if (status === 429) return az.toast.quotaExceeded;
  if (status === 400 || status === 403) return az.toast.invalidKey;
  return az.toast.genericAiError;
}
