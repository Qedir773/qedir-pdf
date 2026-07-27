import { useEffect } from "react";

// onCtrlEnter: primary AI action. onCtrlC: "copy all" — only fires when the
// user has no active text selection, so native selection-copy isn't hijacked.
export function useKeyboardShortcuts({ onCtrlEnter, onCtrlC } = {}) {
  useEffect(() => {
    function handleKeyDown(e) {
      const ctrlOrCmd = e.ctrlKey || e.metaKey;
      if (!ctrlOrCmd) return;

      if (e.key === "Enter" && onCtrlEnter) {
        e.preventDefault();
        onCtrlEnter();
      }

      if ((e.key === "c" || e.key === "C") && onCtrlC) {
        const selection = window.getSelection();
        const hasSelection = selection && selection.toString().length > 0;
        if (!hasSelection) {
          onCtrlC();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCtrlEnter, onCtrlC]);
}
