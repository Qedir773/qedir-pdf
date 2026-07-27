import { useT } from "../../hooks/useT";
import clsx from "clsx";

export function ToneSelector({ tone, onChange }) {
  const az = useT();
  const TONES = [az.ai.toneFormal, az.ai.toneAcademic, az.ai.toneCasual];

  return (
    <div>
      <p className="text-xs text-muted-2 mb-1.5">{az.ai.tone}</p>
      <div className="flex flex-wrap gap-2">
        {TONES.map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={clsx(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              tone === t
                ? "bg-gradient-brand text-white border-transparent"
                : "border-border-glass text-muted hover:text-heading"
            )}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
