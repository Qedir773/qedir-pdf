import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useToastStore } from "../../store/useToastStore";

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const ACCENTS = {
  success: "text-emerald-400",
  error: "text-red-400",
  info: "text-brand-blue",
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismissToast = useToastStore((s) => s.dismissToast);

  return (
    <div className="fixed bottom-5 right-5 z-100 flex flex-col gap-2 max-w-[92vw] w-80">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.variant] ?? Info;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="glass-panel bg-panel-2! flex items-start gap-2.5 p-3.5 shadow-lg"
            >
              <Icon size={18} className={`shrink-0 mt-0.5 ${ACCENTS[t.variant] ?? ""}`} />
              <p className="text-sm text-heading flex-1">{t.message}</p>
              <button
                type="button"
                onClick={() => dismissToast(t.id)}
                className="text-muted hover:text-heading shrink-0"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
