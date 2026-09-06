import { NextResponse } from "next/server";
import { USER_MESSAGES } from "@/lib/errors";
import { getScenarioById } from "@/lib/scenarios-loader";
import { complete, LlmError, parseFeedbackJson } from "@/lib/simulator/llm";
import {
  buildFeedbackSystemPrompt,
  formatTranscriptForLlm,
} from "@/lib/simulator/prompts";
import type { ChatMessage, FeedbackRequest, FeedbackResponse } from "@/lib/types";

const MIN_USER_MESSAGES = 2;

function parseBody(body: unknown): FeedbackRequest | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Request body must be a JSON object" };
  }

  const { scenarioId, messages } = body as Record<string, unknown>;

  if (!scenarioId || typeof scenarioId !== "string") {
    return { error: "scenarioId is required" };
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return { error: "messages must be a non-empty array" };
  }

  const parsedMessages: ChatMessage[] = messages
    .filter(
      (m): m is ChatMessage =>
        typeof m === "object" &&
        m !== null &&
        typeof (m as ChatMessage).content === "string"
    )
    .map((m) => ({
      role: m.role === "client" ? "client" : "user",
      content: m.content,
      timestamp: typeof m.timestamp === "number" ? m.timestamp : Date.now(),
    }));

  return { scenarioId, messages: parsedMessages };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseBody(body);

    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const userMessageCount = parsed.messages.filter((m) => m.role === "user").length;
    if (userMessageCount < MIN_USER_MESSAGES) {
      return NextResponse.json(
        {
          error: `Send at least ${MIN_USER_MESSAGES} replies before requesting feedback.`,
        },
        { status: 400 }
      );
    }

    const scenario = getScenarioById(parsed.scenarioId);
    if (!scenario) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }

    const systemPrompt = buildFeedbackSystemPrompt(scenario);
    const transcript = formatTranscriptForLlm(parsed.messages);

    const raw = await complete({
      system: systemPrompt,
      messages: [{ role: "user", content: transcript }],
      maxTokens: 350,
      jsonMode: true,
    });

    const feedback: FeedbackResponse = parseFeedbackJson(raw);

    return NextResponse.json(feedback);
  } catch (err) {
    if (err instanceof LlmError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    return NextResponse.json(
      { error: USER_MESSAGES.serverError },
      { status: 500 }
    );
  }
}
