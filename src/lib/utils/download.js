export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  // Best-effort history entry for the "Son fayllar" section — never block or
  // fail the actual download if IndexedDB is unavailable (private browsing etc).
  import("../storage/recentFiles")
    .then(({ addRecentFile }) => addRecentFile(blob, filename))
    .catch(() => {});
}

export function downloadText(text, filename) {
  downloadBlob(new Blob([text], { type: "text/plain;charset=utf-8" }), filename);
}
