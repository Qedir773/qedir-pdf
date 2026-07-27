export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
export const ACCEPTED_PDF_TYPE = "application/pdf";
export const ACCEPTED_DOCX_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const MAX_FILE_SIZE_MB = 25;

export const SPEECH_LANGUAGES = [
  { code: "az-AZ", label: "Azərbaycan" },
  { code: "en-US", label: "English" },
  { code: "ru-RU", label: "Русский" },
];

export const TRANSLATE_LANGUAGES = [
  { code: "az", label: "Azərbaycan" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "tr", label: "Türkçe" },
];

// "-latest" alias always resolves to Google's current free-tier flash model,
// so this doesn't need to be updated as models are renamed/deprecated.
export const GEMINI_MODEL = "gemini-flash-latest";
export const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export const LOCALSTORAGE_KEYS = {
  editorContent: "omni.editor.content",
  settings: "omni.settings",
  uiPrefs: "omni.ui.prefs",
  locale: "omni.locale",
};
