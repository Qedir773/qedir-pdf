// Capability-based check (not user-agent sniffing): touch/coarse-pointer
// devices lose DOM caret/selection between async speech-recognition results
// far more easily than mouse-driven desktops, which is what causes dictated
// text to land in the wrong place and look "jumbled".
export function isCoarsePointerDevice() {
  return typeof window !== "undefined" && Boolean(window.matchMedia?.("(pointer: coarse)").matches);
}
