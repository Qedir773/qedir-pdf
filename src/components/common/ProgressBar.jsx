export function ProgressBar({ value = 0 }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
      <div
        className="h-full bg-gradient-brand transition-all duration-200 rounded-full"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
