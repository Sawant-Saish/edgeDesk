export interface ApiErrorBody {
  error: string;
}

export function isApiErrorBody(data: unknown): data is ApiErrorBody {
  return (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof (data as ApiErrorBody).error === "string"
  );
}

export function parseApiError(data: unknown, fallback = "Something went wrong"): string {
  if (isApiErrorBody(data)) return data.error;
  return fallback;
}

export function toUserMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (typeof error === "string") return error;
  return fallback;
}

export const USER_MESSAGES = {
  network: "Network error — check your connection and try again.",
  radarFailed: "Could not load tool recommendations. Please try again.",
  chatFailed: "Could not get a client reply. Please try again.",
  feedbackFailed: "Could not load coaching feedback. Please try again.",
  resumeParseFailed:
    "Could not analyze your document. Try a .txt or .md file, or edit the fields manually.",
  resumeTooLarge: "File is too large. Please use a document under 1 MB.",
  resumeUnsupported:
    "Unsupported file type. Upload a .pdf, .txt, or .md resume.",
  llmMissing:
    "AI features require an API key. Add OPENAI_API_KEY to .env.local (or Vercel env vars).",
  invalidInput: "Please check your input and try again.",
  serverError: "Server error — please try again in a moment.",
} as const;
