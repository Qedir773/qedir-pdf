import { useEffect, useRef, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useLocaleStore } from "../../store/useLocaleStore";
import { LANGUAGES } from "../../locales";
import clsx from "clsx";

export function LanguageSwitcher() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = LANGUAGES.find((l) => l.code === locale);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-9 inline-flex items-center gap-1.5 px-2.5 rounded-lg hover:bg-white/5 text-muted hover:text-heading transition-colors text-sm font-medium"
        aria-label="Dil"
      >
        <Globe size={17} />
        {current?.label}
        <ChevronDown size={13} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 glass-panel bg-panel-2! p-1.5 z-30">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
              }}
              className={clsx(
                "w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-sm hover:bg-white/8",
                lang.code === locale ? "text-heading font-semibold" : "text-muted"
              )}
            >
              {lang.name}
              <span className="text-xs text-muted-2">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
