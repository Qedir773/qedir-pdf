import { FileStack, Mic, Sparkles, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useUiStore, SECTIONS } from "../../store/useUiStore";
import { SidebarNavItem } from "./SidebarNavItem";
import { az } from "../../locales/az";
import clsx from "clsx";

const NAV_ITEMS = [
  { section: SECTIONS.CONVERT, icon: FileStack, label: az.nav.convert },
  { section: SECTIONS.VOICE, icon: Mic, label: az.nav.voice },
  { section: SECTIONS.AI, icon: Sparkles, label: az.nav.ai },
];

export function Sidebar() {
  const activeSection = useUiStore((s) => s.activeSection);
  const setActiveSection = useUiStore((s) => s.setActiveSection);
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <aside
      className={clsx(
        "hidden md:flex flex-col shrink-0 border-r border-border-glass bg-panel/40 transition-all duration-200",
        collapsed ? "w-[72px]" : "w-60"
      )}
    >
      <nav className="flex-1 flex flex-col gap-1.5 p-3 pt-4">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.section}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
            active={activeSection === item.section}
            onClick={() => setActiveSection(item.section)}
          />
        ))}
      </nav>

      <div className="p-3 border-t border-border-glass">
        <button
          type="button"
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs text-muted hover:text-heading hover:bg-white/5 transition-colors"
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
