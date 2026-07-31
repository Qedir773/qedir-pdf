import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useT } from "../../hooks/useT";

export function Modal({ open, onClose, title, children, widthClass = "max-w-lg" }) {
  const az = useT();

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className={`relative w-full ${widthClass} glass-panel bg-panel! p-6 max-h-[85vh] overflow-y-auto`}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-lg text-heading">{title}</h2>
              <button
                type="button"
                aria-label={az.common.close}
                onClick={onClose}
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-white/10 text-muted hover:text-heading"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
