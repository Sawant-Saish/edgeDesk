import { NextResponse } from "next/server";
import { USER_MESSAGES } from "@/lib/errors";
import { getScenarioById } from "@/lib/scenarios-loader";
import { detectBoundarySignals } from "@/lib/simulator/boundary-hints";
import { complete, LlmError } from "@/lib/simulator/llm";
import {
  buildChatMessages,
  buildClientSystemPrompt,
} from "@/lib/simulator/prompts";
import type { ChatMessage, ChatRequest, ChatResponse } from "@/lib/types";

function parseBody(body: unknown): ChatRequest | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Request body must be a JSON object" };
  }

  const { scenarioId, messages, userMessage } = body as Record<string, unknown>;

  if (!scenarioId || typeof scenarioId !== "string") {
    return { error: "scenarioId is required" };
  }

  if (!userMessage || typeof userMessage !== "string" || !userMessage.trim()) {
    return { error: "userMessage is required" };
  }

  if (!Array.isArray(messages)) {
    return { error: "messages must be an array" };
  }

  const parsedMessages: ChatMessage[] = messages
    .filter(
      (m): m is ChatMessage =>
        typeof m === "object" &&
        m !== null &&
        (m as ChatMessage).role !== undefined &&
        typeof (m as ChatMessage).content === "string"
    )
    .map((m) => ({
      role: m.role === "client" ? "client" : "user",
      content: m.content,
      timestamp: typeof m.timestamp === "number" ? m.timestamp : Date.now(),
    }));

  return {
    scenarioId,
    messages: parsedMessages,
    userMessage: userMessage.trim(),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseBody(body);

    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const scenario = getScenarioById(parsed.scenarioId);
    if (!scenario) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }

    const adaptationNote = detectBoundarySignals(parsed.userMessage, scenario);
    const systemPrompt = buildClientSystemPrompt(scenario, adaptationNote);
    const llmMessages = buildChatMessages(
      scenario,
      parsed.messages,
      parsed.userMessage
    );

    const clientReply = await complete({
      system: systemPrompt,
      messages: llmMessages,
      maxTokens: 200,
    });

    const userTurns =
      parsed.messages.filter((m) => m.role === "user").length + 1;

    const response: ChatResponse = {
      clientReply,
      adaptationNote,
      turnCount: userTurns,
    };

    return NextResponse.json(response);
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
