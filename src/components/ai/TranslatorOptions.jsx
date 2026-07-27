import { TRANSLATE_LANGUAGES } from "../../lib/utils/constants";
import { az } from "../../locales/az";
import clsx from "clsx";

export function TranslatorOptions({ targetLang, onChange }) {
  return (
    <div>
      <p className="text-xs text-muted-2 mb-1.5">{az.ai.targetLang}</p>
      <div className="flex flex-wrap gap-2">
        {TRANSLATE_LANGUAGES.map((l) => (
          <button
            key={l.code}
            onClick={() => onChange(l)}
            className={clsx(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              targetLang.code === l.code
                ? "bg-gradient-brand text-white border-transparent"
                : "border-border-glass text-muted hover:text-heading"
            )}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
