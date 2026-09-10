# Demo script (2–3 minutes)

## Setup (30s before judges)

1. Backend running (`npm run dev` in `backend`) — health check shows `ok: true`.
2. Frontend at http://localhost:5173.
3. Fresh account: register with any email.

## Walkthrough

### 1. Resume → skills (40s)

- Click **Use sample resume** → **Extract skills**.
- Point at confidence badges and evidence snippets.
- Say: *“Every skill ID is checked against a closed taxonomy. Unknown names are dropped — we never invent skills.”*

### 2. Skill gap (30s)

- Pick **Frontend React Developer** → **Compute gap**.
- Show match % bar + missing chips.
- Say: *“The percentage is plain set-difference in JavaScript. The LLM only writes the one-sentence explanation.”*

### 3. Course compare (30s)

- Click a missing skill (e.g. `typescript`).
- Show sortable table + score breakdown (value / time / quality).
- Say: *“Scores are a fixed rubric on seeded course data — no marketplace scraping, no LLM vibes.”*

### 4. Negotiate (45s)

- Start **medium** session.
- Send 2–3 turns: propose a price, defend scope, hold a timeline.
- **End & score** → show scorecard.
- Say: *“The client’s budget is seeded and hidden. Scoring uses a separate coach prompt so the persona doesn’t grade itself.”*

### 5. Close (15s)

- Open **Summary** — IncomeX readiness contribution.
- Pitch line: *“One loop: measure the gap, learn the skill, practice selling it.”*

## If something fails

- Extraction error → show the honest red banner (no fake skills). That’s a feature.
- No Mongo → API still works via in-memory store; mention it only if asked.
