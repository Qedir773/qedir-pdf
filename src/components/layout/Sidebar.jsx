import { FileStack, Mic, Sparkles, LayoutGrid, Layers, PenTool, Minimize2, History, QrCode, FileText, IdCard, ArrowUpRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useUiStore, SECTIONS } from "../../store/useUiStore";
import { SidebarNavItem } from "./SidebarNavItem";
import { useT } from "../../hooks/useT";
import clsx from "clsx";

const QERAR_TOOL_URL = "https://qerarlari-avtomatik-yazdirma.onrender.com";
const SIVI_YARAT_URL = "https://sivi-yarat.onrender.com/";

export function Sidebar() {
  const activeSection = useUiStore((s) => s.activeSection);
  const setActiveSection = useUiStore((s) => s.setActiveSection);
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const az = useT();

  const NAV_ITEMS = [
    { section: SECTIONS.CONVERT, icon: FileStack, label: az.nav.convert },
    { section: SECTIONS.VOICE, icon: Mic, label: az.nav.voice },
    { section: SECTIONS.AI, icon: Sparkles, label: az.nav.ai },
    { section: SECTIONS.COLLAGE, icon: LayoutGrid, label: az.nav.collage },
    { section: SECTIONS.MERGE_SPLIT, icon: Layers, label: az.nav.mergeSplit },
    { section: SECTIONS.SIGNATURE, icon: PenTool, label: az.nav.signature },
    { section: SECTIONS.COMPRESS, icon: Minimize2, label: az.nav.compress },
    { section: SECTIONS.QR, icon: QrCode, label: az.nav.qr },
  ];

  return (
    <aside
      className={clsx(
        "hidden md:flex flex-col shrink-0 border-r border-border-glass bg-panel/40 transition-all duration-200",
        collapsed ? "w-[72px]" : "w-60"
      )}
    >
      <nav className="flex-1 flex flex-col gap-1.5 p-3 pt-4">
        <a
          href={SIVI_YARAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          title={collapsed ? az.nav.siviYarat : undefined}
          className={clsx(
            "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold bg-gradient-brand text-white hover:brightness-110 transition-[filter]",
            collapsed && "justify-center px-0"
          )}
        >
          <IdCard size={19} className="shrink-0" strokeWidth={2.4} />
          {!collapsed && (
            <>
              <span className="truncate flex-1">{az.nav.siviYarat}</span>
              <ArrowUpRight size={16} className="shrink-0" />
            </>
          )}
        </a>
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
        <a
          href={QERAR_TOOL_URL}
          target="_blank"
          rel="noopener noreferrer"
          title={collapsed ? az.nav.qerar : undefined}
          className={clsx(
            "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors text-muted hover:text-heading hover:bg-white/5 border border-transparent",
            collapsed && "justify-center px-0"
          )}
        >
          <FileText size={19} className="shrink-0" strokeWidth={2} />
          {!collapsed && <span className="truncate">{az.nav.qerar}</span>}
        </a>
        <SidebarNavItem
          icon={History}
          label={az.nav.recent}
          collapsed={collapsed}
          active={activeSection === SECTIONS.RECENT}
          onClick={() => setActiveSection(SECTIONS.RECENT)}
        />
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
