import { useState } from "react";
import { Copy, ImageOff, Trash2 } from "lucide-react";
import { Button } from "../common/Button";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { ExportMenu } from "./ExportMenu";
import { copyPlainText } from "../../lib/utils/clipboard";
import { stripImagesFromHtml } from "../../lib/text/stripImages";
import { useToast } from "../../hooks/useToast";
import { useT } from "../../hooks/useT";

export function EditorToolbar({ editorRef }) {
  const toast = useToast();
  const az = useT();
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  async function handleCopy() {
    const text = editorRef.current?.getPlainText() ?? "";
    try {
      await copyPlainText(text);
      toast.success(az.toast.copied);
    } catch {
      toast.error(az.toast.copyFailed);
    }
  }

  function handleRemoveImages() {
    const html = editorRef.current?.getHtml() ?? "";
    editorRef.current?.setHtml(stripImagesFromHtml(html));
    toast.success(az.toast.imagesRemoved);
  }

  function handleClear() {
    editorRef.current?.setHtml("");
    setConfirmClearOpen(false);
    toast.success(az.toast.cleared);
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border-glass">
        <Button variant="ghost" onClick={handleCopy}>
          <Copy size={15} /> {az.editor.copyText}
        </Button>
        <Button variant="ghost" onClick={handleRemoveImages}>
          <ImageOff size={15} /> {az.editor.removeImages}
        </Button>
        <Button variant="ghost" onClick={() => setConfirmClearOpen(true)}>
          <Trash2 size={15} /> {az.editor.clearText}
        </Button>
        <div className="flex-1" />
        <ExportMenu editorRef={editorRef} />
      </div>

      <ConfirmDialog
        open={confirmClearOpen}
        title={az.editor.clearConfirmTitle}
        body={az.editor.clearConfirmBody}
        onConfirm={handleClear}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </>
  );
}
