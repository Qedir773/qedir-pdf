import { AnimatePresence, motion } from "framer-motion";
import { FileStack, Mic, Sparkles, X } from "lucide-react";
import { useUiStore, SECTIONS } from "../../store/useUiStore";
import { az } from "../../locales/az";
import clsx from "clsx";

const NAV_ITEMS = [
  { section: SECTIONS.CONVERT, icon: FileStack, label: az.nav.convert },
  { section: SECTIONS.VOICE, icon: Mic, label: az.nav.voice },
  { section: SECTIONS.AI, icon: Sparkles, label: az.nav.ai },
];

export function MobileSidebarDrawer() {
  const open = useUiStore((s) => s.mobileSidebarOpen);
  const setOpen = useUiStore((s) => s.setMobileSidebarOpen);
  const activeSection = useUiStore((s) => s.activeSection);
  const setActiveSection = useUiStore((s) => s.setActiveSection);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-64 bg-panel-2 border-r border-border-glass p-4 flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.22 }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-heading font-bold text-gradient-brand">{az.app.name}</p>
              <button onClick={() => setOpen(false)} className="text-muted hover:text-heading" aria-label={az.common.close}>
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => {
                const active = activeSection === item.section;
                const Icon = item.icon;
                return (
                  <button
                    key={item.section}
                    onClick={() => setActiveSection(item.section)}
                    className={clsx(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                      active ? "bg-white/8 border border-border-glass text-heading" : "text-muted hover:bg-white/5"
                    )}
                  >
                    <Icon size={19} className={clsx(active && "text-brand-violet")} />
                    <span className={clsx(active && "text-gradient-brand font-semibold")}>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
