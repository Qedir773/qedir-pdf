import { AnimatePresence, motion } from "framer-motion";
import { FileStack, Mic, Sparkles, LayoutGrid, Layers, PenTool, Minimize2, History, QrCode, FileText, IdCard, Video, Building2, ArrowUpRight, X } from "lucide-react";
import { useUiStore, SECTIONS } from "../../store/useUiStore";
import { useT } from "../../hooks/useT";
import clsx from "clsx";

const QERAR_TOOL_URL = "https://qerarlari-avtomatik-yazdirma.onrender.com";
const SIVI_YARAT_URL = "http://92.5.96.82/";
const YOUTUBE_STUDIO_URL = "https://tubeforge-studio.qedirvahidov.workers.dev";
const SAMPLE_SITE_URL = "https://qedir.alwaysdata.net";

export function MobileSidebarDrawer() {
  const open = useUiStore((s) => s.mobileSidebarOpen);
  const setOpen = useUiStore((s) => s.setMobileSidebarOpen);
  const activeSection = useUiStore((s) => s.activeSection);
  const setActiveSection = useUiStore((s) => s.setActiveSection);
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
              <a
                href={SIVI_YARAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold bg-gradient-brand text-white hover:brightness-110 transition-[filter]"
              >
                <IdCard size={19} />
                <span className="flex-1">{az.nav.siviYarat}</span>
                <ArrowUpRight size={16} />
              </a>
              <a
                href={YOUTUBE_STUDIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-500 transition-colors"
              >
                <Video size={19} />
                <span className="flex-1">{az.nav.youtubeVideo}</span>
                <ArrowUpRight size={16} />
              </a>
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
              <a
                href={QERAR_TOOL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-white/5"
              >
                <FileText size={19} />
                <span>{az.nav.qerar}</span>
              </a>
              <a
                href={SAMPLE_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-emerald-100 bg-emerald-500/15 border border-emerald-400/25 hover:bg-emerald-500/25 hover:text-white transition-colors"
              >
                <Building2 size={19} className="text-emerald-300" />
                <span className="flex-1">Nümunə sayt</span>
                <ArrowUpRight size={16} className="text-emerald-300" />
              </a>
              <button
                onClick={() => setActiveSection(SECTIONS.RECENT)}
                className={clsx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                  activeSection === SECTIONS.RECENT ? "bg-white/8 border border-border-glass text-heading" : "text-muted hover:bg-white/5"
                )}
              >
                <History size={19} className={clsx(activeSection === SECTIONS.RECENT && "text-brand-violet")} />
                <span className={clsx(activeSection === SECTIONS.RECENT && "text-gradient-brand font-semibold")}>{az.nav.recent}</span>
              </button>
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
