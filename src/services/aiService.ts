export type AIAction = "translate" | "rephrase" | "summarize" | "expand";

export interface LanguageOption {
  code: string;
  label: string;
}

// Fallback languages used when the API is unavailable
const FALLBACK_LANGUAGES: LanguageOption[] = [
  { code: "hi", label: "Hindi" },
  { code: "en", label: "English" },
];

// ---------------------------------------------------------------------------
// Fetch available languages from ${adminUserApiUrl}/multi-lingual
// ---------------------------------------------------------------------------
export const fetchLanguages = async (
  adminUserApiUrl: string,
  token?: string,
): Promise<LanguageOption[]> => {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${adminUserApiUrl}/multi-lingual`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      console.warn("[AI Service] Failed to fetch languages, using fallback");
      return FALLBACK_LANGUAGES;
    }

    const json = await response.json();
    // Expecting { data: { languages: [{ code, label }] } } or similar
    const languages =
      json?.data?.languages || json?.data || json?.languages || json;

    if (Array.isArray(languages) && languages.length > 0) {
      return languages.map((lang: any) => ({
        code: lang.code || lang.language_code || lang.id,
        label: lang.label || lang.name || lang.language_name || lang.code,
      }));
    }

    console.warn(
      "[AI Service] Unexpected language response format, using fallback",
    );
    return FALLBACK_LANGUAGES;
  } catch (error) {
    console.error("[AI Service] Error fetching languages:", error);
    return FALLBACK_LANGUAGES;
  }
};

// ---------------------------------------------------------------------------
// Wrapper response shape from the backend
// Every endpoint returns: { statusCode, message, data: { aiEditor: { ... } } }
// ---------------------------------------------------------------------------
interface APIResponse<T> {
  statusCode: number;
  message: string;
  data: {
    aiEditor: T;
  };
}

// ---------------------------------------------------------------------------
// Inner response types (what lives inside data.aiEditor)
// ---------------------------------------------------------------------------
interface GenerateResult {
  originalPrompt: string;
  generatedContent: string;
  length: string;
  style: string;
  timestamp: string;
}

interface ExpandResult {
  originalText: string;
  newText: string;
  targetLength: string;
  originalLength: number;
  expandedLength: number;
  timestamp: string;
}

interface RephraseResult {
  originalText: string;
  newText: string;
  tone: string;
  instructions: string;
  timestamp: string;
}

interface SummarizeResult {
  originalText: string;
  newText: string;
  length: string;
  style: string;
  originalLength: number;
  summaryLength: number;
  compressionRatio: string;
  timestamp: string;
}

interface TranslateTextResult {
  originalText: string;
  newText: string;
  targetLanguage: string;
  timestamp: string;
}

interface TranslateHtmlResult {
  originalHTML: string;
  translatedHTML: string;
  targetLanguage: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Shared fetch helper — unwraps data.aiEditor automatically
// ---------------------------------------------------------------------------
async function apiFetch<T>(
  url: string,
  body: Record<string, unknown>,
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData as { message?: string }).message ||
        `Request failed with status ${response.status}`,
    );
  }

  const json = (await response.json()) as APIResponse<T>;
  console.log("[AI Service] Raw API response:", JSON.stringify(json, null, 2));
  console.log("[AI Service] Extracted data.aiEditor:", json.data?.aiEditor);
  return json.data.aiEditor;
}

// ---------------------------------------------------------------------------
// /generate – Generate content from a prompt
// ---------------------------------------------------------------------------
export const generateContent = async (
  prompt: string,
  length: "short" | "medium" | "long" = "medium",
  style: string = "professional",
  baseUrl?: string,
  token?: string,
): Promise<string> => {
  if (!baseUrl)
    throw new Error("AI base URL is required. Pass it via the aiBaseUrl prop.");
  try {
    const result = await apiFetch<GenerateResult>(`${baseUrl}/generate`, {
      prompt,
      length,
      style,
    }, token);
    return result.generatedContent;
  } catch (error) {
    console.error("AI Generate Error:", error);
    throw error;
  }
};

// ---------------------------------------------------------------------------
// /expand – Expand selected text with more detail
// ---------------------------------------------------------------------------
export const expandText = async (
  text: string,
  targetLength: string = "longer",
  baseUrl?: string,
  token?: string,
): Promise<string> => {
  if (!baseUrl)
    throw new Error("AI base URL is required. Pass it via the aiBaseUrl prop.");
  try {
    const result = await apiFetch<ExpandResult>(`${baseUrl}/expand`, {
      text,
      targetLength,
    }, token);
    return result.newText;
  } catch (error) {
    console.error("AI Expand Error:", error);
    throw error;
  }
};

// ---------------------------------------------------------------------------
// /rephrase – Rephrase selected text
// ---------------------------------------------------------------------------
export const rephraseText = async (
  text: string,
  tone: string = "neutral",
  instructions: string = "Make it clearer and more engaging",
  baseUrl?: string,
  token?: string,
): Promise<string> => {
  if (!baseUrl)
    throw new Error("AI base URL is required. Pass it via the aiBaseUrl prop.");
  try {
    const result = await apiFetch<RephraseResult>(`${baseUrl}/rephrase`, {
      text,
      tone,
      instructions,
    }, token);
    return result.newText;
  } catch (error) {
    console.error("AI Rephrase Error:", error);
    throw error;
  }
};

// ---------------------------------------------------------------------------
// /summarize – Summarize selected text
// ---------------------------------------------------------------------------
export const summarizeText = async (
  text: string,
  length: string = "medium",
  style: string = "bullet-points",
  baseUrl?: string,
  token?: string,
): Promise<string> => {
  if (!baseUrl)
    throw new Error("AI base URL is required. Pass it via the aiBaseUrl prop.");
  try {
    const result = await apiFetch<SummarizeResult>(`${baseUrl}/summarize`, {
      text,
      length,
      style,
    }, token);
    return result.newText;
  } catch (error) {
    console.error("AI Summarize Error:", error);
    throw error;
  }
};

// ---------------------------------------------------------------------------
// /translate – Translate text or HTML to target language
// ---------------------------------------------------------------------------
export const translateText = async (
  text: string,
  targetLanguage: string,
  baseUrl?: string,
  token?: string,
): Promise<string> => {
  if (!baseUrl)
    throw new Error("AI base URL is required. Pass it via the aiBaseUrl prop.");
  try {
    const result = await apiFetch<TranslateTextResult>(`${baseUrl}/translate`, {
      text,
      targetLanguage,
    }, token);
    return result.newText;
  } catch (error) {
    console.error("AI Translate Error:", error);
    throw error;
  }
};

export const translateHtml = async (
  html: string,
  targetLanguage: string,
  baseUrl?: string,
  token?: string,
): Promise<string> => {
  if (!baseUrl)
    throw new Error("AI base URL is required. Pass it via the aiBaseUrl prop.");
  try {
    const result = await apiFetch<TranslateHtmlResult>(`${baseUrl}/translate`, {
      html,
      targetLanguage,
    }, token);
    return result.translatedHTML;
  } catch (error) {
    console.error("AI Translate HTML Error:", error);
    throw error;
  }
};

// ---------------------------------------------------------------------------
// Convenience wrapper used by AIBubbleMenu
// ---------------------------------------------------------------------------
export const processSelectedText = async (
  text: string,
  action: AIAction,
  options?: { targetLanguage?: string },
  baseUrl?: string,
  token?: string,
): Promise<string> => {
  switch (action) {
    case "expand":
      return expandText(text, "longer", baseUrl, token);
    case "rephrase":
      return rephraseText(
        text,
        "neutral",
        "Make it clearer and more engaging",
        baseUrl,
        token,
      );
    case "summarize":
      return summarizeText(text, "medium", "bullet-points", baseUrl, token);
    case "translate":
      return translateText(text, options?.targetLanguage || "English", baseUrl, token);
    default:
      throw new Error(`Unknown AI action: ${action}`);
  }
};
