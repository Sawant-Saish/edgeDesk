import type { FeedbackResponse } from "@/lib/types";
import { USER_MESSAGES } from "@/lib/errors";

export class LlmError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = "LlmError";
  }
}

function getApiKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new LlmError(USER_MESSAGES.llmMissing, 503);
  }
  return key;
}

function getModel(): string {
  return process.env.LLM_MODEL ?? "gpt-4o-mini";
}

interface CompleteOptions {
  system: string;
  messages: { role: "user" | "assistant"; content: string }[];
  maxTokens?: number;
  jsonMode?: boolean;
  temperature?: number;
}

export async function complete({
  system,
  messages,
  maxTokens = 250,
  jsonMode = false,
  temperature = 0.8,
}: CompleteOptions): Promise<string> {
  const apiKey = getApiKey();
  const model = getModel();

  const body: Record<string, unknown> = {
    model,
    messages: [{ role: "system", content: system }, ...messages],
    max_tokens: maxTokens,
    temperature,
  };

  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 429) {
      throw new LlmError("Rate limit reached. Please wait a moment and try again.", 429);
    }
    throw new LlmError(`LLM request failed: ${errText.slice(0, 200)}`, res.status);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new LlmError("Empty response from LLM");
  }

  return content.trim();
}

export function parseFeedbackJson(raw: string): FeedbackResponse {
  try {
    const parsed = JSON.parse(raw) as Partial<FeedbackResponse>;

    const overall =
      parsed.overall === "excellent" ||
      parsed.overall === "solid" ||
      parsed.overall === "needs-work"
        ? parsed.overall
        : "solid";

    return {
      overall,
      whatWorked: Array.isArray(parsed.whatWorked)
        ? parsed.whatWorked.slice(0, 2).map(String)
        : ["You engaged with the client professionally."],
      improve: Array.isArray(parsed.improve)
        ? parsed.improve.slice(0, 2).map(String)
        : ["Try naming the boundary more explicitly."],
      experiencedAlternative:
        typeof parsed.experiencedAlternative === "string"
          ? parsed.experiencedAlternative
          : "I'd acknowledge their request and propose a clear next step with scope or payment terms.",
    };
  } catch {
    return {
      overall: "solid",
      whatWorked: ["You stayed engaged through a difficult conversation."],
      improve: ["Try naming boundaries earlier with a specific next step."],
      experiencedAlternative:
        "I'd acknowledge their request and propose a clear next step with scope or payment terms.",
    };
  }
}
