import type { AdaptationState, Scenario } from "@/lib/types";

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function containsAny(text: string, phrases: string[]): boolean {
  const normalized = normalize(text);
  return phrases.some((phrase) => normalized.includes(normalize(phrase)));
}

export function detectBoundarySignals(
  userMessage: string,
  scenario: Scenario
): AdaptationState {
  const caved = containsAny(userMessage, scenario.pressureTriggers);
  const held = containsAny(userMessage, scenario.boundarySignals);

  if (held && !caved) return "held";
  if (caved && !held) return "escalated";
  if (held && caved) return "held";
  return "neutral";
}

export function getAdaptationInstruction(state: AdaptationState): string {
  switch (state) {
    case "escalated":
      return "The freelancer just caved or agreed too easily. Push harder — add another small ask or express pleasant surprise and request more.";
    case "held":
      return "The freelancer held a clear boundary professionally. Back off slightly — try a softer angle, guilt trip lightly, or pivot to a smaller ask.";
    case "neutral":
      return "Stay in character. Maintain steady pressure without major escalation or retreat.";
  }
}
