import { Modal } from "./Modal";
import { Button } from "./Button";
import { useT } from "../../hooks/useT";

export function ConfirmDialog({ open, title, body, onConfirm, onCancel }) {
  const az = useT();

  return (
    <Modal open={open} onClose={onCancel} title={title} widthClass="max-w-sm">
      <p className="text-sm text-muted mb-6">{body}</p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>
          {az.common.cancel}
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          {az.common.confirm}
        </Button>
      </div>
    </Modal>
  );
}
