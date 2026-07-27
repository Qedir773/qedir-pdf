import { useCallback, useState } from "react";

export function useFileDrop(onFiles) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer?.files?.length) {
        onFiles(e.dataTransfer.files);
      }
    },
    [onFiles]
  );

  const handleInputChange = useCallback(
    (e) => {
      if (e.target.files?.length) {
        onFiles(e.target.files);
        e.target.value = "";
      }
    },
    [onFiles]
  );

  return {
    isDragging,
    dropHandlers: {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
    handleInputChange,
  };
}
