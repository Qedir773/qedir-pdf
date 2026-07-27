import { downloadText } from "../utils/download";
import { htmlToPlainText } from "../text/textMetrics";

export function exportAsTxt(html, filename = "qedir-pdf-metn.txt") {
  downloadText(htmlToPlainText(html), filename);
}
