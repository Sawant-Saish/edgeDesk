# SYSTEM ARCHITECTURE — Freelancer Readiness Module

## 1. Tech stack (fixed — do not substitute without asking)

- **Frontend:** React + Vite (matches IncomeX)
- **Backend:** Node.js + Express (matches IncomeX)
- **Database:** MongoDB + Mongoose
- **LLM:** Anthropic Claude API (or OpenAI — pick ONE, set in `.env` as `LLM_PROVIDER`). No local model training. No fine-tuning.
- **File parsing:** `pdf-parse` (Node) for resume PDFs; plain text also accepted.
- **Auth:** reuse IncomeX's existing JWT auth middleware — do not build a second auth system.

## 2. Module boundary

This is a new set of folders inside the existing IncomeX backend, not a new repo:

```
backend/
  modules/
    frm/                        <- Freelancer Readiness Module lives here, isolated
      resume/
        resume.controller.js
        resume.service.js       <- calls LLM, validates output
        resume.model.js
      skillGap/
        skillGap.controller.js
        skillGap.service.js     <- pure logic, NO LLM call (see below)
        skillTaxonomy.data.js   <- static seed data, source of truth for valid skills
      courses/
        courses.controller.js
        courses.service.js
        courses.seed.json       <- static seeded course dataset
      negotiation/
        negotiation.controller.js
        negotiation.service.js  <- LLM roleplay + scoring
        negotiation.model.js
      shared/
        llmClient.js            <- single wrapper around the LLM API, used by ALL of the above
        validateSchema.js       <- shared JSON-schema validator
frontend/
  src/
    features/
      frm/
        ResumeUpload/
        SkillGapView/
        CourseCompare/
        NegotiationChat/
```

**Rule:** every LLM call in the entire module goes through `shared/llmClient.js`. No controller calls the LLM API directly. This is the single point where we log prompts/responses, enforce timeouts, and enforce schema validation. This is the #1 anti-hallucination control — one choke point, one place to fix things.

## 3. Data flow per feature

### F1 — Resume Intake
```
User uploads PDF/paste text
  → resume.controller.js receives file
  → pdf-parse extracts raw text (no LLM yet — this is deterministic)
  → resume.service.js sends raw text + STRICT extraction prompt to llmClient
  → llmClient returns JSON, validateSchema.js checks it against resumeSchema
  → if valid: save to resume.model.js, return to frontend
  → if invalid: retry once with a stricter "fix this JSON" prompt; if still invalid, return error state
```

### F2 — Skill Gap Engine
```
Structured skill profile (from F1) + target role (user-selected, from a FIXED dropdown list)
  → skillGap.service.js does a DETERMINISTIC set-difference against skillTaxonomy.data.js
  → NO LLM call here. This is plain JS logic: role's required skills MINUS user's extracted skills = gap
  → LLM is only used AFTER this, to write a 1-2 sentence human-readable explanation of the gap
    (explanation is cosmetic text, never used for scoring/logic)
```
This is the most important architectural decision in this doc: **the gap calculation itself must be deterministic code, not an LLM guess.** The LLM explains; it does not decide.

### F3 — Course Comparator
```
Gap skill (e.g. "GraphQL") 
  → courses.service.js filters courses.seed.json where skill matches
  → scores each course on a FIXED rubric (see 03_API_CONTRACTS.md) using plain arithmetic, not LLM opinion
  → returns top 3-5 sorted by score
```
No LLM call in this feature at all in v1. Rubric scoring is arithmetic on seeded fields (price, hours, rating, recency). This guarantees comparisons are consistent and explainable — critical, since "compare courses" implies the user trusts the ranking.

### F4 — Negotiation Simulator
```
User starts session → negotiation.service.js builds a persona from:
  - a randomized project brief template (seeded, not LLM-invented budget ranges)
  - the user's own skill profile (from F1) — so the "client" references real skills
  → conversation loop: user message → llmClient (persona-locked system prompt) → assistant reply
  → session ends → llmClient called ONCE MORE with a separate "scorer" system prompt
    (scoring prompt is isolated from roleplay prompt so the client persona can't grade its own performance)
  → scorecard schema-validated before display
```

## 4. Anti-hallucination checkpoints (summary — full detail in file 04)

1. Skill names are always matched against `skillTaxonomy.data.js` (a closed vocabulary), never free text from the LLM.
2. Course data is never LLM-generated — always from `courses.seed.json`.
3. Every LLM JSON output passes through `validateSchema.js` before use.
4. Negotiation persona budget/scope numbers are seeded server-side, not invented by the LLM mid-chat.
5. The LLM never writes directly to the database — only validated service-layer functions do.

## 5. Environment variables needed

```
LLM_PROVIDER=anthropic        # or openai
ANTHROPIC_API_KEY=...         # or OPENAI_API_KEY
LLM_MODEL=claude-sonnet-4-6   # pin an exact model string, don't leave it implicit
MONGO_URI=...                 # reuse existing IncomeX connection
JWT_SECRET=...                # reuse existing IncomeX secret
```
