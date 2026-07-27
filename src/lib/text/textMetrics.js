export function computeTextMetrics(plainText) {
  const trimmed = plainText.trim();
  const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
  const charsWithSpaces = plainText.length;
  const charsNoSpaces = plainText.replace(/\s/g, "").length;
  const sentences = trimmed.length === 0
    ? 0
    : (trimmed.match(/[^.!?…]+[.!?…]+/g) || (trimmed.length ? [trimmed] : [])).length;

  return { words, charsWithSpaces, charsNoSpaces, sentences };
}

export function htmlToPlainText(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}
