# IMPLEMENTATION PHASES

> Build in this order. Do not start a phase until the previous one's acceptance criteria pass.
> This order exists so that deterministic/testable pieces (seed data, schemas) exist BEFORE any LLM call
> depends on them — the taxonomy and course data must be real before F1/F3 can be verified as non-hallucinating.

## Phase 0 — Foundations (no LLM yet)
- Create `modules/frm/` folder structure (per 01_SYSTEM_ARCHITECTURE.md).
- Write `skillTaxonomy.data.js` (40-60 real skills, reviewed by hand).
- Write `roleRequirements.data.js` (start with 2-3 roles: e.g. Frontend React Dev, Backend Node Dev, Full-Stack).
- Write `courses.seed.json` with real, verifiable course URLs (30-50 entries).
- Write `projectBriefs.seed.json` (10-15 negotiation scenarios).
- Write `validateSchema.js` using `zod` (recommended over hand-rolled checks — less room for edge-case bugs).
- **Acceptance:** all four seed files exist, are valid JSON/JS, and a unit test confirms every `skillId` referenced in `roleRequirements` and `courses.seed.json` exists in `skillTaxonomy.data.js` (catches typos before they become silent bugs later).

## Phase 1 — Resume Intake (F1)
- Implement `resume.controller.js`, `resume.service.js`, `resume.model.js`.
- Wire `pdf-parse` for PDF text extraction.
- Implement `shared/llmClient.js` (generic, reusable — build it once here, all later phases reuse it).
- Wire the extraction prompt (04, section 2) + schema validation + skillId cross-check.
- Frontend: `ResumeUpload` component — file input, loading state, results view showing skills with confidence badges.
- **Acceptance:** upload 3 different real resumes (varied formats), confirm extracted skills are all valid taxonomy entries, confidence scores render in UI, and at least one deliberately malformed/gibberish input correctly triggers the `422 extraction_failed` path instead of returning garbage.

## Phase 2 — Skill Gap + Course Comparator (F2, F3)
- Implement `skillGap.service.js` as pure deterministic set-difference logic (no LLM call for the math).
- Add the cosmetic explanation LLM call (04, section 3), clearly separated from the gap calculation.
- Implement `courses.service.js` with the fixed scoring rubric (03, F3) — write this as a pure function with unit tests using hardcoded inputs/expected outputs.
- Frontend: `SkillGapView` (progress bar + missing skill chips) and `CourseCompare` (table view, sortable by score).
- **Acceptance:** given a fixed test skill profile and role, matchPercentage and missingSkills are 100% reproducible across repeated calls (proves determinism). Course scores match hand-calculated expected values for at least 3 test cases.

## Phase 3 — Negotiation Simulator (F4)
- Implement `negotiation.model.js`, `negotiation.service.js`, `negotiation.controller.js`.
- Wire session start (persona construction from seeded brief + user's real skill profile).
- Wire the message loop with turn-cap enforcement (server-side counter, not trusted from client).
- Wire the separate scorecard call (04, section 5).
- Frontend: `NegotiationChat` — chat bubble UI, turn counter, end-session button, scorecard result screen.
- **Acceptance:** run 3 full sessions end-to-end at different difficulty levels; confirm the client never reveals its exact hidden budget mid-chat, the turn cap forces completion, and the scorecard's `finalAgreedPriceUSD` matches what was actually typed in the transcript (spot-check manually, don't just trust the LLM's math here either — this is exactly the kind of thing to sanity-check by eye during testing).

## Phase 4 — Integration, polish, demo readiness
- Connect all four features into one user journey: Resume Upload → Skill Gap → Course Compare → Negotiate.
- Add a dashboard/summary screen showing the user's IncomeX Score contribution from this module (reuse existing IncomeX Score logic if already built — do not build a second scoring system).
- Error-state pass: confirm every LLM-touching endpoint has a visible, honest failure state in the UI (no infinite spinners, no fake data on failure).
- Write a 2-3 minute demo script that walks a judge through the closed loop (this is where the "uniqueness" pitch — combining all four in one flow — actually gets shown, not just claimed).
- **Acceptance:** a single click-through from resume upload to negotiation scorecard works without manual backend intervention, on a fresh test account.

## What to explicitly punt to "v2" (write these down so they don't quietly creep into v1 scope)
- Fuzzy/semantic skill matching via embeddings (v1 uses exact taxonomy match only).
- Live course marketplace scraping/API integration.
- Voice-based negotiation.
- Multiple simultaneous target roles per user.
- Admin panel for editing seed data (v1: edit the JSON/JS files directly).
