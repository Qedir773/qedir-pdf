import { GEMINI_API_BASE, GEMINI_MODEL } from "../utils/constants";
import { GeminiError, mapHttpStatusToMessage } from "./geminiErrors";
import { az } from "../../locales/az";

// Calls the Gemini Generative Language REST API directly from the browser —
// its CORS headers permit this, so no backend/proxy is required. The API key
// is supplied by the user and lives only in their browser's localStorage.
export async function generateText(prompt, apiKey) {
  if (!apiKey) {
    throw new GeminiError("missing-key", az.toast.apiKeyMissing);
  }

  let response;
  try {
    response = await fetch(`${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
  } catch {
    throw new GeminiError("network", az.toast.networkError);
  }

  if (!response.ok) {
    throw new GeminiError("http", mapHttpStatusToMessage(response.status));
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
  if (!text) {
    throw new GeminiError("empty", az.toast.genericAiError);
  }
  return text.trim();
}
