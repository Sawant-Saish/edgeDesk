# EdgeDesk — Freelancer AI Co-pilot

Hackathon MVP for **AI for Business & Productivity**. Helps established freelancers:

1. **Tool/Trend Radar** — ranked AI & productivity tool recommendations by niche
2. **Client-Scenario Simulator** — practice difficult client conversations with AI feedback

## Quick demo

```bash
npm install
cp .env.local.example .env.local   # add OPENAI_API_KEY for simulator
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → click **Load demo profile →**

Full walkthrough: [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)

**Expected demo radar results** (writer · seo, blogging, email-copy · excluding Grammarly + Notion):

1. Surfer SEO (~88)
2. Jasper (~75)
3. Copy.ai (~73)

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- JSON datasets: 20 tools, 4 client scenarios
- OpenAI `gpt-4o-mini` for simulator (minimal token usage)
- Profile persisted in `localStorage`

## Project structure

```
src/
├── app/                    # Routes + API
├── components/             # UI, radar, simulator, demo
├── data/                   # tools.json, scenarios.json, demo-profile.json
├── hooks/                  # useFreelancerProfile
└── lib/                    # scoring, LLM, storage, errors
```

## Phase status

| Phase | Status |
|-------|--------|
| 1 — Foundations | ✅ Complete |
| 2 — Tool Radar | ✅ Complete |
| 3 — Client Simulator | ✅ Complete |
| 4 — Integration | ✅ Complete |
| 5 — Demo prep | ✅ Complete |

## Environment

```bash
cp .env.local.example .env.local
```

| Variable | Required | Notes |
|----------|----------|-------|
| `OPENAI_API_KEY` | Simulator only | Tool Radar works without it |
| `LLM_MODEL` | Optional | Defaults to `gpt-4o-mini` |

## Deploy to Vercel

1. Push repo to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add `OPENAI_API_KEY` in **Settings → Environment Variables**
4. Deploy

```bash
# Or via CLI
npx vercel
# Set OPENAI_API_KEY when prompted or in the Vercel dashboard
```

Tool Radar runs with zero env vars. Simulator needs `OPENAI_API_KEY` in production.

## API routes

| Route | Method | LLM calls |
|-------|--------|-----------|
| `/api/radar` | POST | 0 |
| `/api/simulator/chat` | POST | 1 per turn |
| `/api/simulator/feedback` | POST | 1 per session |
