import { useEffect, useImperativeHandle, useRef } from "react";
import { useEditorStore } from "../../store/useEditorStore";
import { useDebouncedCallback } from "../../hooks/useDebounce";
import { useT } from "../../hooks/useT";

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
