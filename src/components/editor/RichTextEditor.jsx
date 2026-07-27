import { useEffect, useImperativeHandle, useRef } from "react";
import { useEditorStore } from "../../store/useEditorStore";
import { useDebouncedCallback } from "../../hooks/useDebounce";
import { useT } from "../../hooks/useT";
import { isCoarsePointerDevice } from "../../lib/utils/device";

// Uncontrolled contentEditable: React never re-renders innerHTML on keystroke
// (the classic cursor-jump bug). We only overwrite innerHTML on explicit
// external loads (OCR result, DOCX import, AI apply, clear) via the ref API,
// and debounce-sync user typing into the store for autosave/export/metadata.
export const RichTextEditor = ({ editorRef }) => {
  const domRef = useRef(null);
  const content = useEditorStore((s) => s.content);
  const setContent = useEditorStore((s) => s.setContent);
  const hasLoadedInitial = useRef(false);
  const az = useT();

  const debouncedSetContent = useDebouncedCallback((html) => setContent(html), 400);

  useEffect(() => {
    if (!hasLoadedInitial.current && domRef.current) {
      domRef.current.innerHTML = content;
      hasLoadedInitial.current = true;
    }
  }, [content]);

  useImperativeHandle(editorRef, () => ({
    setHtml: (html) => {
      if (domRef.current) {
        domRef.current.innerHTML = html;
        setContent(html);
      }
    },
    insertHtmlAtCursor: (html) => {
      const el = domRef.current;
      if (!el) return;
      el.focus();
      document.execCommand("insertHTML", false, html);
      setContent(el.innerHTML);
    },
    insertTextAtCursor: (text) => {
      const el = domRef.current;
      if (!el) return;
      el.focus();
      document.execCommand("insertText", false, text);
      setContent(el.innerHTML);
    },
    // Speech dictation uses this instead of insertTextAtCursor. On touch
    // devices the caret/selection is easily lost between async recognition
    // results (tapping elsewhere, the on-screen keyboard opening/closing),
    // so execCommand's cursor-relative insert can land in the wrong spot or
    // silently drop text. Appending at the end sidesteps that entirely.
    // Desktop keeps the cursor-based behavior since it works reliably there.
    insertDictatedText: (text) => {
      const el = domRef.current;
      if (!el) return;
      el.focus();
      if (isCoarsePointerDevice()) {
        el.appendChild(document.createTextNode(text));
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        document.execCommand("insertText", false, text);
      }
      setContent(el.innerHTML);
    },
    getHtml: () => domRef.current?.innerHTML ?? "",
    getPlainText: () => domRef.current?.innerText ?? "",
    focus: () => domRef.current?.focus(),
  }));

  return (
    <div
      ref={domRef}
      className="editor-content"
      contentEditable
      suppressContentEditableWarning
      data-placeholder={az.editor.placeholder}
      onInput={(e) => debouncedSetContent(e.currentTarget.innerHTML)}
    />
  );
};
