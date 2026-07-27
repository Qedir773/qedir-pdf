export class GeminiError extends Error {
  constructor(kind) {
    super(kind);
    this.kind = kind;
  }
}

export function mapHttpStatusToErrorKind(status) {
  if (status === 429) return "quota-exceeded";
  if (status === 400 || status === 403) return "invalid-key";
  return "generic";
}
