import { UploadCloud } from "lucide-react";
import { useFileDrop } from "../../hooks/useFileDrop";
import { az } from "../../locales/az";
import clsx from "clsx";

export function DropZone({ accept, multiple = true, onFiles, hint }) {
  const { isDragging, dropHandlers, handleInputChange } = useFileDrop(onFiles);
  const inputId = `dropzone-input-${accept?.join("").replace(/[^a-z]/gi, "") ?? "any"}`;

  return (
    <label
      htmlFor={inputId}
      {...dropHandlers}
      className={clsx(
        "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
        isDragging ? "border-brand-blue bg-brand-blue/5" : "border-border-glass hover:bg-white/3"
      )}
    >
      <UploadCloud size={28} className={isDragging ? "text-brand-blue" : "text-muted"} />
      <p className="text-sm text-heading font-medium">{az.common.dragDrop}</p>
      {hint && <p className="text-xs text-muted-2">{hint}</p>}
      <input
        id={inputId}
        type="file"
        accept={accept?.join(",")}
        multiple={multiple}
        className="hidden"
        onChange={handleInputChange}
      />
    </label>
  );
}
