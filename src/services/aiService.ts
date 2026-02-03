export type AIAction = "translate" | "rephrase" | "summarize" | "expand";

interface GenerateContentResponse {
  generatedContent: string;
  originalPrompt: string;
  length: string;
  style: string;
  timestamp: string;
}

// Placeholder URL - User will update this later
const API_BASE_URL = "http://localhost:3001";

export const generateContent = async (
  prompt: string,
  length: "short" | "medium" | "long" = "medium",
  style: string = "professional",
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, length, style }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Request failed with status ${response.status}`,
      );
    }

    const data: GenerateContentResponse = await response.json();
    return data.generatedContent;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};

export const processSelectedText = async (
  text: string,
  action: AIAction,
): Promise<string> => {
  let prompt = "";
  switch (action) {
    case "translate":
      prompt = `Translate the following text to English (if not already) or refine it: "${text}"`;
      break;
    case "rephrase":
      prompt = `Rephrase the following text to be more clear and professional: "${text}"`;
      break;
    case "summarize":
      prompt = `Provide a concise summary of the following text: "${text}"`;
      break;
    case "expand":
      prompt = `Expand upon the following text with more details and context: "${text}"`;
      break;
    default:
      prompt = text;
  }

  return generateContent(prompt);
};
