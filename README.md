# EdgeDesk — Freelancer Readiness Module (FRM)

Standalone MERN implementation of the IncomeX **Freelancer Readiness Module**, built from the project brief and architecture docs.

**Closed loop:** Resume intake → Skill gap → Course compare → Negotiation practice → Summary

## Stack

| Layer | Choice |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| DB | MongoDB + Mongoose (auto-falls back to in-memory if Mongo is down) |
| LLM | Anthropic or OpenAI via single `llmClient.js` choke point (`LLM_MOCK=true` for offline demo) |
| Validation | Zod schemas before any LLM JSON hits UI/DB |

## Quick start

```bash
# Backend
cd backend
npm install
cp .env.example .env   # already present; LLM_MOCK=true by default
npm run test           # Phase 0–2 acceptance tests
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 → register → use **Use sample resume** → walk the stepper.

### Live LLM (optional)

In `backend/.env`:

```
LLM_MOCK=false
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
LLM_MODEL=claude-sonnet-4-6
```

Or `LLM_PROVIDER=openai` + `OPENAI_API_KEY`.

## API (all under `/api/frm`, JWT required)

| Method | Path | Feature |
|---|---|---|
| POST | `/resume/upload` | F1 PDF or `{ pastedText }` |
| GET | `/skill-gap?skillProfileId=&targetRoleId=` | F2 deterministic gap |
| GET | `/courses?skillId=` | F3 rubric-ranked courses |
| POST | `/negotiation/start` | F4 start |
| POST | `/negotiation/:id/message` | F4 turn |
| POST | `/negotiation/:id/end` | F4 scorecard |

Auth: `POST /api/auth/register`, `POST /api/auth/login`.

## Architecture rules enforced

1. Every LLM call goes through `backend/modules/frm/shared/llmClient.js`.
2. Skill gap math and course scores are pure JS — no LLM arithmetic.
3. Skill IDs / courses / briefs / budgets come from seeded files only.
4. Invalid LLM JSON → one retry → honest `422`, never fabricated UI data.
5. Negotiation budget/objectionStyle stay server-side (not sent to the client).

## Folder map

```
edgedesk_cursor/
  backend/modules/frm/   # resume, skillGap, courses, negotiation, shared
  frontend/src/features/frm/
  docs/                  # copied specs + demo script
```

## Specs

See `docs/` for the original brief, architecture, data models, API contracts, prompts, phases, and Cursor instructions.
