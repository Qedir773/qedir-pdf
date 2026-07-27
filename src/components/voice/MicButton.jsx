import { Mic, Square } from "lucide-react";
import clsx from "clsx";

export function MicButton({ listening, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "h-16 w-16 rounded-full inline-flex items-center justify-center transition-colors",
        listening ? "bg-red-500 animate-pulse-mic" : "bg-gradient-brand",
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      {listening ? <Square size={22} className="text-white" fill="white" /> : <Mic size={24} className="text-white" />}
    </button>
  );
}
