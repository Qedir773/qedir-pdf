import Tesseract from "tesseract.js";

// "aze" covers Azerbaijani Latin script; "eng" as a fallback for mixed content.
// Language data is fetched from Tesseract's CDN on first use and cached by the browser.
export async function runOcr(file, onProgress) {
  const { data } = await Tesseract.recognize(file, "aze+eng", {
    logger: (m) => {
      if (m.status === "recognizing text") {
        onProgress?.(m.progress);
      }
    },
  });
  return data.text;
}
