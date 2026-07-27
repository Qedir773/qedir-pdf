import qedirSwirl from "./logo-qedir-swirl.png";
import pdfArrow1 from "./logo-pdf-arrow-1.jpg";
import pdfArrow2 from "./logo-pdf-arrow-2.jpg";
import qedirExplode1 from "./logo-qedir-explode-1.jpg";
import qedirExplode2 from "./logo-qedir-explode-2.jpg";

// All 5 supplied logo variants, in rotation order. The header cycles through
// these as the active section changes (Convert/Voice/AI/Settings all share
// this pool since no section-specific logos have been supplied yet).
// pdfArrow2 is listed first so it's the logo shown on initial load (default
// section is Convert Hub), per explicit request.
export const LOGOS = [pdfArrow2, qedirExplode1, qedirExplode2, qedirSwirl, pdfArrow1];

export const DEFAULT_LOGO = pdfArrow2;
