const { validateSchema } = require('./validateSchema');

class LLMValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'LLMValidationError';
    this.details = details;
    this.statusCode = 422;
  }
}

class LLMProviderError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LLMProviderError';
    this.statusCode = 502;
  }
}

/**
 * Single choke-point for every LLM call in FRM.
 * Controllers must never call Anthropic/OpenAI directly.
 */
async function callLLM({
  systemPrompt,
  userPrompt,
  responseSchema,
  maxRetries = 1,
  temperature = 0,
  expectJson = true,
}) {
  const provider = (process.env.LLM_PROVIDER || 'anthropic').toLowerCase();
  const model = process.env.LLM_MODEL || defaultModel(provider);

  let lastError = null;
  let prompt = userPrompt;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const raw = await invokeProvider({
        provider,
        model,
        systemPrompt,
        userPrompt: prompt,
        temperature,
      });

      logPair({ model, systemPrompt, userPrompt: prompt, raw, attempt });

      if (!expectJson) {
        return { text: raw, model };
      }

      const parsed = parseJsonLoose(raw);
      if (responseSchema) {
        const validated = validateSchema(responseSchema, parsed);
        if (!validated.success) {
          lastError = validated.error;
          prompt = `${userPrompt}\n\nYour last response failed validation because: ${validated.error}. Return corrected JSON only. No markdown.`;
          continue;
        }
        return { data: validated.data, model, raw };
      }

      return { data: parsed, model, raw };
    } catch (err) {
      if (err instanceof LLMValidationError) throw err;
      lastError = err.message;
      if (attempt === maxRetries) {
        throw new LLMProviderError(lastError);
      }
    }
  }

  throw new LLMValidationError(
    'LLM output failed schema validation after retry',
    lastError
  );
}

function defaultModel(provider) {
  if (provider === 'openai') return 'gpt-4o-mini';
  return 'claude-sonnet-4-6';
}

async function invokeProvider({ provider, model, systemPrompt, userPrompt, temperature }) {
  // Demo/mock mode — no API key required for local UI walkthrough
  if (process.env.LLM_MOCK === 'true' || (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY)) {
    return mockResponse({ systemPrompt, userPrompt });
  }

  if (provider === 'openai') {
    return callOpenAI({ model, systemPrompt, userPrompt, temperature });
  }
  return callAnthropic({ model, systemPrompt, userPrompt, temperature });
}

async function callAnthropic({ model, systemPrompt, userPrompt, temperature }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new LLMProviderError('ANTHROPIC_API_KEY is not set');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 2048,
        temperature,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text();
      throw new LLMProviderError(`Anthropic ${res.status}: ${body.slice(0, 300)}`);
    }

    const json = await res.json();
    const text = (json.content || [])
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('\n');
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

async function callOpenAI({ model, systemPrompt, userPrompt, temperature }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new LLMProviderError('OPENAI_API_KEY is not set');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text();
      throw new LLMProviderError(`OpenAI ${res.status}: ${body.slice(0, 300)}`);
    }

    const json = await res.json();
    return json.choices?.[0]?.message?.content || '';
  } finally {
    clearTimeout(timeout);
  }
}

function parseJsonLoose(raw) {
  if (typeof raw !== 'string') return raw;
  let text = raw.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Response was not valid JSON');
  }
}

function logPair({ model, systemPrompt, userPrompt, raw, attempt }) {
  if (process.env.LLM_LOG === 'false') return;
  const entry = {
    ts: new Date().toISOString(),
    model,
    attempt,
    systemPrompt: systemPrompt.slice(0, 200),
    userPrompt: redact(userPrompt).slice(0, 400),
    raw: redact(String(raw)).slice(0, 400),
  };
  console.log('[llmClient]', JSON.stringify(entry));
}

function redact(text) {
  return text
    .replace(/[\w.+-]+@[\w.-]+\.\w+/g, '[email]')
    .replace(/\+?\d[\d\s\-()]{8,}\d/g, '[phone]');
}

/**
 * Deterministic mock responses for offline/demo runs.
 */
function mockResponse({ systemPrompt, userPrompt }) {
  const sys = systemPrompt.toLowerCase();

  if (sys.includes('extract skills')) {
    const skills = [];
    const catalog = [
      ['react', 'React'],
      ['javascript', 'JavaScript'],
      ['nodejs', 'Node'],
      ['express', 'Express'],
      ['mongodb', 'MongoDB'],
      ['typescript', 'TypeScript'],
      ['css', 'CSS'],
      ['html', 'HTML'],
      ['git', 'Git'],
      ['rest_api', 'REST'],
    ];
    for (const [id, needle] of catalog) {
      if (userPrompt.toLowerCase().includes(needle.toLowerCase()) || userPrompt.toLowerCase().includes(id)) {
        skills.push({
          skillId: id,
          confidence: 0.85,
          evidenceSnippet: `Mentioned ${needle} in resume`,
        });
      }
    }
    if (skills.length === 0 && /asdf|lorem|zzzz|gibberish/i.test(userPrompt)) {
      return JSON.stringify({ skills: [], yearsExperience: 0 });
    }
    if (skills.length === 0) {
      skills.push(
        { skillId: 'javascript', confidence: 0.7, evidenceSnippet: 'General web development experience' },
        { skillId: 'html', confidence: 0.65, evidenceSnippet: 'Web markup experience' },
        { skillId: 'css', confidence: 0.65, evidenceSnippet: 'Styling experience' }
      );
    }
    const yearsMatch = userPrompt.match(/(\d+)\+?\s*years?/i);
    return JSON.stringify({
      skills,
      yearsExperience: yearsMatch ? Number(yearsMatch[1]) : 2,
    });
  }

  if (sys.includes('encouraging but honest') || sys.includes('explanation')) {
    return JSON.stringify({
      explanationText:
        "You're solid on several core skills for this role, but the missing skills above are the main blockers to looking hire-ready. Close those gaps next.",
    });
  }

  if (sys.includes('impartial negotiation coach') || sys.includes('score the freelancer')) {
    const priceMatch = userPrompt.match(/\$(\d+)/g);
    const lastPrice = priceMatch ? Number(priceMatch[priceMatch.length - 1].replace('$', '')) : null;
    return JSON.stringify({
      finalAgreedPriceUSD: lastPrice,
      clarityScore: 7,
      boundaryScore: 6,
      professionalismScore: 8,
      summaryText:
        lastPrice == null
          ? 'No explicit price was agreed in the transcript. You stayed professional but left money on the table by not anchoring a number.'
          : `You communicated clearly and stayed professional. Final discussed figure around $${lastPrice} — watch conceding too quickly on price.`,
    });
  }

  if (sys.includes('roleplaying as a client')) {
    const replies = [
      "Thanks for the note — budget is tighter than that. What's your best number for the must-have scope?",
      "Can we shrink timeline without bloating scope? I need something shippable sooner.",
      "That helps. If we lock scope to the MVP only, what price and date can you commit to?",
      "I'm still comparing quotes. Why should I pick you at that rate?",
      "Okay, if we agree on that number with a clear revision limit, I can move forward.",
    ];
    const turn = (userPrompt.match(/turn/gi) || []).length;
    const reply = replies[Math.min(turn, replies.length - 1)];
    return JSON.stringify({ reply });
  }

  return JSON.stringify({ reply: 'Could you clarify your proposed price and timeline?' });
}

module.exports = {
  callLLM,
  LLMValidationError,
  LLMProviderError,
};
