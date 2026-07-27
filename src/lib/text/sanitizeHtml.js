// Minimal sanitizer for HTML we programmatically insert into the editor
// (from DOCX import / OCR / AI results) — strips executable content while
// keeping formatting tags intact.
const DANGEROUS_TAGS = ["script", "style", "iframe", "object", "embed", "link", "meta"];

export function sanitizeHtml(html) {
  const container = document.createElement("div");
  container.innerHTML = html;

  DANGEROUS_TAGS.forEach((tag) => {
    container.querySelectorAll(tag).forEach((el) => el.remove());
  });

  container.querySelectorAll("*").forEach((el) => {
    [...el.attributes].forEach((attr) => {
      if (/^on/i.test(attr.name) || (attr.name === "href" && /^javascript:/i.test(attr.value))) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return container.innerHTML;
}
