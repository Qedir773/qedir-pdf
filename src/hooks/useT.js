import { useLocaleStore } from "../store/useLocaleStore";
import { LOCALES } from "../locales";

export function useT() {
  const locale = useLocaleStore((s) => s.locale);
  return LOCALES[locale];
}
