import clsx from "clsx";

export function IconButton({ icon: Icon, label, active, className, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={clsx(
        "inline-flex items-center justify-center h-9 w-9 rounded-lg border border-transparent text-muted transition-colors",
        active
          ? "bg-white/10 text-heading border-border-glass"
          : "hover:bg-white/5 hover:text-heading",
        className
      )}
      {...props}
    >
      <Icon size={18} />
    </button>
  );
}
