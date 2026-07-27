import { useState } from "react";

export function useImageCropQueue(onDone) {
  const [queue, setQueue] = useState([]);

  function enqueue(files) {
    setQueue((q) => [...q, ...files]);
  }

  function settleCurrent() {
    setQueue((q) => q.slice(1));
  }

  function confirmCrop(croppedFile) {
    onDone(croppedFile);
    settleCurrent();
  }

  function skipCrop() {
    onDone(queue[0]);
    settleCurrent();
  }

  return { pendingFile: queue[0] ?? null, enqueue, confirmCrop, skipCrop };
}
