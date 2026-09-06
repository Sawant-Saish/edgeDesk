import scenariosData from "@/data/scenarios.json";
import type { Scenario, ScenariosDataset } from "./types";

function validateScenario(scenario: Scenario, index: number): void {
  if (!scenario.id || !scenario.title) {
    throw new Error(`Scenario at index ${index} is missing id or title`);
  }

  if (!scenario.openingMessage || !scenario.systemPromptTemplate) {
    throw new Error(`Scenario "${scenario.id}" is missing required prompt fields`);
  }

  if (!scenario.pressureTriggers?.length || !scenario.boundarySignals?.length) {
    throw new Error(`Scenario "${scenario.id}" must have pressure and boundary signals`);
  }
}

function validateDataset(data: ScenariosDataset): Scenario[] {
  if (!data.scenarios?.length) {
    throw new Error("scenarios.json must contain at least one scenario");
  }

  const ids = new Set<string>();
  for (let i = 0; i < data.scenarios.length; i++) {
    const scenario = data.scenarios[i];
    validateScenario(scenario, i);

    if (ids.has(scenario.id)) {
      throw new Error(`Duplicate scenario id: ${scenario.id}`);
    }
    ids.add(scenario.id);
  }

  return data.scenarios;
}

const validatedScenarios = validateDataset(
  scenariosData as unknown as ScenariosDataset
);

export function loadScenarios(): Scenario[] {
  return validatedScenarios;
}

export function getScenarioById(id: string): Scenario | undefined {
  return validatedScenarios.find((s) => s.id === id);
}
