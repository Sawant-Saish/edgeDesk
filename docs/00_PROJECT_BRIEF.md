# PROJECT BRIEF — Freelancer Readiness Module (FRM)

> Read this file first. It defines WHAT we're building and WHAT WE ARE NOT BUILDING.
> If Cursor/AI is ever unsure whether something is in scope, it must check this file, not assume.

## 1. Problem statement

Freelancers learn a tech stack but have never:
1. Negotiated a real client deal (scope, price, deadline pushback).
2. Had their actual skill gaps measured against real market demand.
3. Compared learning options (courses) on criteria that matter to them (cost, time, outcome), not marketing copy.

Existing tools solve ONE of these in isolation (negotiation simulators OR resume analyzers OR course marketplaces). Nobody chains them into one flow: **upload resume → see your real skill gap → get a ranked learning path with comparable courses → practice negotiating with a simulated client who knows your actual profile.**

## 2. Product scope (v1 — hackathon/MVP-realistic)

This is built as a **module inside IncomeX** (not a new standalone product), reusing IncomeX's auth, user model, and MERN backend. It adds four features:

| # | Feature | One-line definition |
|---|---|---|
| F1 | Resume/PDF Intake | User uploads resume or pastes text → structured skill/experience data extracted |
| F2 | Skill Gap Engine | Extracted skills compared against a target-role skill taxonomy → gap list + IncomeX Score contribution |
| F3 | Course Comparator | Given a gap, return 3–5 real courses scored on a fixed rubric (not vibes) |
| F4 | Negotiation Simulator | Chat interface where an LLM roleplays a client with a defined persona/budget/objections, scored against the user's actual skill profile |

## 3. Explicit non-goals (v1)

Do NOT build these unless a later phase file says so. This list exists specifically so the AI doesn't scope-creep or hallucinate features:

- No voice/audio negotiation (text chat only).
- No biometric/stress tracking.
- No fine-tuning or training a custom LLM. We use an existing LLM API only (see 04_LLM_PROMPTS_AND_GUARDRAILS.md).
- No live scraping of course marketplaces at runtime. Course data comes from a **static/seeded dataset** we control (see Data Models). Scraping is a post-MVP task, not v1.
- No payment/checkout for courses — we only compare and link out.
- No multi-language support in v1.

## 4. Success criteria (how we know it's done)

- A user can upload a PDF resume and get back a structured JSON skill profile in under 10 seconds, with a visible confidence indicator (never a silent guess).
- A user can see a skill-gap list for at least 1 target role, backed by a fixed taxonomy (not free-text LLM invention).
- A user can compare at least 3 courses per gap skill on identical criteria columns.
- A user can complete one full negotiation chat session (5–10 turns) with a client persona derived from their own profile + a randomized project brief, and get a post-session scorecard.
- Every LLM output that becomes structured data (skills, scores, course rubric numbers) is **schema-validated before it touches the UI or database.** If validation fails, the system retries once, then shows a "couldn't analyze this, try again" state — it never shows fabricated data.

## 5. Why this is different (for pitch/deck use, not for engineering)

Most competitors are single-purpose. Our differentiator is the **closed loop**: resume → gap → course → practice negotiating that exact gap with that exact client scenario. Keep this framing for the pitch deck; it is not an engineering requirement, just context for why decisions below favor a connected data model over four separate tools.
