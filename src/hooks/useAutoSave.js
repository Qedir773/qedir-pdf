import { useEffect, useState } from "react";

// Derives a "saving" vs "saved" label from a lastSavedAt timestamp, so the
// MetadataBar can show a brief "Saxlanılır..." pulse right after a save then
// settle back to "Avtomatik saxlanıldı".
export function useAutoSaveStatus(lastSavedAt) {
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (!lastSavedAt) return;
    setJustSaved(true);
    const t = setTimeout(() => setJustSaved(false), 600);
    return () => clearTimeout(t);
  }, [lastSavedAt]);

  return justSaved ? "saving" : lastSavedAt ? "saved" : "idle";
}
