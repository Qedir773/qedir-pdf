import { useMemo } from "react";
import { computeTextMetrics, htmlToPlainText } from "../lib/text/textMetrics";

export function useTextMetrics(html) {
  return useMemo(() => computeTextMetrics(htmlToPlainText(html)), [html]);
}
