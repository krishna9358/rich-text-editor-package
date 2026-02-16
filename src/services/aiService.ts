export type AIAction = "translate" | "rephrase" | "summarize" | "expand";

const DEFAULT_AI_BASE_URL =
  "https://able-marmot-loosely.ngrok-free.app/admin/ai-editor";

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
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
  baseUrl: string = DEFAULT_AI_BASE_URL,
): Promise<string> => {
  try {
    const result = await apiFetch<GenerateResult>(`${baseUrl}/generate`, {
      prompt,
      length,
      style,
    });
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
  baseUrl: string = DEFAULT_AI_BASE_URL,
): Promise<string> => {
  try {
    const result = await apiFetch<ExpandResult>(`${baseUrl}/expand`, {
      text,
      targetLength,
    });
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
  baseUrl: string = DEFAULT_AI_BASE_URL,
): Promise<string> => {
  try {
    const result = await apiFetch<RephraseResult>(`${baseUrl}/rephrase`, {
      text,
      tone,
      instructions,
    });
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
  baseUrl: string = DEFAULT_AI_BASE_URL,
): Promise<string> => {
  try {
    const result = await apiFetch<SummarizeResult>(`${baseUrl}/summarize`, {
      text,
      length,
      style,
    });
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
  baseUrl: string = DEFAULT_AI_BASE_URL,
): Promise<string> => {
  try {
    const result = await apiFetch<TranslateTextResult>(`${baseUrl}/translate`, {
      text,
      targetLanguage,
    });
    return result.newText;
  } catch (error) {
    console.error("AI Translate Error:", error);
    throw error;
  }
};

export const translateHtml = async (
  html: string,
  targetLanguage: string,
  baseUrl: string = DEFAULT_AI_BASE_URL,
): Promise<string> => {
  try {
    const result = await apiFetch<TranslateHtmlResult>(`${baseUrl}/translate`, {
      html,
      targetLanguage,
    });
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
  baseUrl: string = DEFAULT_AI_BASE_URL,
): Promise<string> => {
  switch (action) {
    case "expand":
      return expandText(text, "longer", baseUrl);
    case "rephrase":
      return rephraseText(
        text,
        "neutral",
        "Make it clearer and more engaging",
        baseUrl,
      );
    case "summarize":
      return summarizeText(text, "medium", "bullet-points", baseUrl);
    case "translate":
      return translateText(text, options?.targetLanguage || "English", baseUrl);
    default:
      throw new Error(`Unknown AI action: ${action}`);
  }
};
