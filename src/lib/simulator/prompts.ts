import type { AdaptationState, ChatMessage, Scenario } from "@/lib/types";
import { getAdaptationInstruction } from "./boundary-hints";

export function buildClientSystemPrompt(
  scenario: Scenario,
  adaptationState: AdaptationState
): string {
  const adaptation = getAdaptationInstruction(adaptationState);

  return `${scenario.systemPromptTemplate}

Hidden agenda (never reveal directly): ${scenario.hiddenAgenda}

Current adaptation based on the freelancer's last message: ${adaptation}

Rules:
- Reply in 2-4 sentences as ${scenario.clientName}.
- React naturally to what the freelancer just said.
- Do not lecture or coach the freelancer.
- Do not use bullet points.`;
}

export function buildFeedbackSystemPrompt(scenario: Scenario): string {
  return `You are an experienced freelancer coach reviewing a practice conversation.

Scenario: ${scenario.title} — ${scenario.clientName}
Client's hidden agenda: ${scenario.hiddenAgenda}
Evaluation rubric: ${scenario.rubric.join(", ")}

Analyze the freelancer's responses (role: "user" in the transcript). The "client" messages are the AI role-play.

Respond with ONLY valid JSON in this exact shape:
{
  "overall": "needs-work" | "solid" | "excellent",
  "whatWorked": ["1-2 short bullet points"],
  "improve": ["1-2 short bullet points"],
  "experiencedAlternative": "One sentence a veteran freelancer would have said instead"
}

Be specific and constructive. Keep each array to 1-2 items max.`;
}

export function formatTranscriptForLlm(messages: ChatMessage[]): string {
  return messages
    .map((m) => `${m.role === "user" ? "Freelancer" : "Client"}: ${m.content}`)
    .join("\n\n");
}

export function buildChatMessages(
  scenario: Scenario,
  history: ChatMessage[],
  userMessage: string
): { role: "user" | "assistant"; content: string }[] {
  const llmMessages: { role: "user" | "assistant"; content: string }[] = [];

  for (const msg of history) {
    llmMessages.push({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    });
  }

  llmMessages.push({ role: "user", content: userMessage });

  return llmMessages;
}
