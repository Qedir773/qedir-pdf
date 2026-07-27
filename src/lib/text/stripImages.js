// Strips embedded images/figures from HTML (incl. base64 <img>), leaving clean
// formatted text. Also handles raw markdown image syntax that may have been
// pasted directly as text.
export function stripImagesFromHtml(html) {
  const container = document.createElement("div");
  container.innerHTML = html;

  container.querySelectorAll("img, picture, svg, figure").forEach((el) => el.remove());

  container.querySelectorAll("*").forEach((el) => {
    const style = el.getAttribute("style");
    if (style && /background(-image)?\s*:\s*url\(/i.test(style)) {
      el.removeAttribute("style");
    }
  });

  return container.innerHTML;
}

export function stripMarkdownImages(text) {
  return text.replace(/!\[[^\]]*\]\([^)]*\)/g, "");
}
