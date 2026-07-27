import clsx from "clsx";

export function Badge({ icon: Icon, children, className }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
        "bg-white/5 border border-border-glass text-muted",
        className
      )}
    >
      {Icon && <Icon size={14} />}
      {children}
    </span>
  );
}
