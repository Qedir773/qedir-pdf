import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Settings } from "lucide-react";
import { useUiStore, SECTIONS } from "../../store/useUiStore";
import { LOGOS } from "../../assets/logos";
import { az } from "../../locales/az";

const SECTION_ORDER = [SECTIONS.CONVERT, SECTIONS.VOICE, SECTIONS.AI];

export function Header() {
  const activeSection = useUiStore((s) => s.activeSection);
  const setMobileSidebarOpen = useUiStore((s) => s.setMobileSidebarOpen);
  const setSettingsOpen = useUiStore((s) => s.setSettingsOpen);

  const [logoIndex, setLogoIndex] = useState(0);

  useEffect(() => {
    const idx = SECTION_ORDER.indexOf(activeSection);
    setLogoIndex(idx >= 0 ? idx % LOGOS.length : 0);
  }, [activeSection]);

  return (
    <header className="sticky top-0 z-40 h-24 flex items-center gap-3 px-4 md:px-6 border-b border-border-glass bg-base/80 backdrop-blur-md">
      <button
        type="button"
        className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-white/5 text-muted"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Menyu"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative h-[72px] w-[72px] shrink-0 rounded-xl overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            <motion.img
              key={logoIndex}
              src={LOGOS[logoIndex]}
              alt="QƏDİR.pdf loqo"
              className="h-full w-full object-contain"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.25 }}
            />
          </AnimatePresence>
        </div>
        <div className="min-w-0">
          <p className="font-heading font-extrabold text-gradient-brand text-2xl leading-tight truncate">
            {az.app.name}
          </p>
          <p className="text-xs text-muted-2 leading-tight truncate hidden sm:block">
            {az.app.tagline}
          </p>
        </div>
      </div>

      <div className="flex-1" />

      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        className="h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-white/5 text-muted hover:text-heading transition-colors"
        aria-label={az.nav.settings}
        title={az.nav.settings}
      >
        <Settings size={19} />
      </button>
    </header>
  );
}
