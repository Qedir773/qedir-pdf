import clsx from "clsx";

export function SidebarNavItem({ icon: Icon, label, active, collapsed, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={clsx(
        "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        collapsed && "justify-center px-0",
        active
          ? "bg-white/8 border border-border-glass text-heading"
          : "text-muted hover:text-heading hover:bg-white/5 border border-transparent"
      )}
    >
      <Icon size={19} className={clsx("shrink-0", active && "text-brand-violet")} strokeWidth={active ? 2.4 : 2} />
      {!collapsed && (
        <span className={clsx("truncate", active && "text-gradient-brand font-semibold")}>{label}</span>
      )}
    </button>
  );
}
