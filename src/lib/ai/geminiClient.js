import { GEMINI_API_BASE, GEMINI_MODEL } from "../utils/constants";
import { GeminiError, mapHttpStatusToErrorKind } from "./geminiErrors";

// Calls the Gemini Generative Language REST API directly from the browser —
// its CORS headers permit this, so no backend/proxy is required. The API key
// is supplied by the user and lives only in their browser's localStorage.
export async function generateText(prompt, apiKey) {
  if (!apiKey) {
    throw new GeminiError("missing-key");
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
    throw new GeminiError("network");
  }

  if (!response.ok) {
    throw new GeminiError(mapHttpStatusToErrorKind(response.status));
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
  if (!text) {
    throw new GeminiError("generic");
  }
  return text.trim();
}
