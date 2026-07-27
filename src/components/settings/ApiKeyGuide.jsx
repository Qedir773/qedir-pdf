import { az } from "../../locales/az";

export function ApiKeyGuide() {
  return (
    <div className="rounded-xl border border-border-glass bg-white/3 p-4 text-sm text-muted space-y-1.5">
      <p className="text-heading font-semibold mb-2">{az.settings.getKeyGuideTitle}</p>
      <p>{az.settings.getKeyStep1}</p>
      <p>{az.settings.getKeyStep2}</p>
      <p>{az.settings.getKeyStep3}</p>
      <p>{az.settings.getKeyStep4}</p>
      <a
        href="https://ai.google.dev/"
        target="_blank"
        rel="noreferrer"
        className="inline-block mt-2 text-brand-blue hover:underline font-medium"
      >
        ai.google.dev →
      </a>
    </div>
  );
}
