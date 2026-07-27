import { MAX_FILE_SIZE_MB } from "./constants";

export function isFileTooLarge(file) {
  return file.size > MAX_FILE_SIZE_MB * 1024 * 1024;
}

export function getFileExtension(filename) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

export function filterFilesByType(files, acceptedTypes) {
  return Array.from(files).filter((f) => acceptedTypes.includes(f.type));
}
