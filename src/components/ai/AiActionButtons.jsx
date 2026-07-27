import { ListChecks, SpellCheck2, Languages, Wand2 } from "lucide-react";
import { useT } from "../../hooks/useT";
import clsx from "clsx";

export function AiActionButtons({ activeAction, onSelect }) {
  const az = useT();

  const ACTIONS = [
    { key: "summarize", label: az.ai.summarize, icon: ListChecks },
    { key: "grammar", label: az.ai.grammar, icon: SpellCheck2 },
    { key: "translate", label: az.ai.translate, icon: Languages },
    { key: "tone", label: az.ai.tone, icon: Wand2 },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {ACTIONS.map((a) => {
        const Icon = a.icon;
        const active = activeAction === a.key;
        return (
          <button
            key={a.key}
            onClick={() => onSelect(a.key)}
            className={clsx(
              "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors",
              active
                ? "border-transparent bg-gradient-brand text-white"
                : "border-border-glass text-muted hover:text-heading hover:bg-white/5"
            )}
          >
            <Icon size={20} />
            {a.label}
          </button>
        );
      })}
    </div>
  );
}
