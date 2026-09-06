# EdgeDesk — 2–3 Minute Live Demo Script

Use **Load demo profile →** on the home page for a one-click start.

---

## Pre-demo checklist

- [ ] `OPENAI_API_KEY` set in `.env.local` (local) or Vercel env vars (deployed)
- [ ] `npm run dev` running, or production URL open
- [ ] Browser at `http://localhost:3000` (or your Vercel URL)
- [ ] Optional: clear localStorage if you want a fresh demo (`localStorage.removeItem('edgedesk-profile')`)

---

## Script (≈2 min 30 sec)

### 0:00 — Hook (15 sec)

**Say:**  
*"EdgeDesk is an AI co-pilot for established freelancers — not beginners. It does two things: tells you which AI tools you're missing in your niche, and lets you practice difficult client conversations before they cost you money."*

**Do:** Open home page. Point at the 3-step workflow bar.

---

### 0:15 — Load demo profile (15 sec)

**Say:**  
*"Meet our demo freelancer: a writer doing SEO, blogging, and email copy. They already use Grammarly and Notion."*

**Do:** Click **Load demo profile →**  
→ Lands on `/radar` with form pre-filled.

---

### 0:30 — Tool Radar (45 sec)

**Say:**  
*"This isn't a static list. We retrieve from a curated dataset, score by niche match, skill overlap, and ROI, then rank the top three — zero LLM calls."*

**Do:** Click **Run Radar →**

**Expected top 3 (verify live):**

| Rank | Tool       | ~Score |
|------|------------|--------|
| #1   | Surfer SEO | 88     |
| #2   | Jasper     | 75     |
| #3   | Copy.ai    | 73     |

**Do:** Expand **show breakdown** on #1 — point at niche + skills + ROI bars.

**Say:**  
*"Surfer wins because SEO and blogging overlap directly, and the writer niche match is maxed out."*

---

### 1:15 — Simulator setup (15 sec)

**Do:** Nav → **Simulator** (profile bar should still show Writer + skills).

**Say:**  
*"Same profile carries across the app. Now we practice client judgment with a two-agent setup."*

**Do:** Select **The Scope Creeper**.

---

### 1:30 — Cave and escalate (30 sec)

**Do:** Reply with something soft:

> *"Sure, I can add the landing page and deck — shouldn't take too long."*

**Say:**  
*"I caved. Watch the adaptation tag."*

**Expected:** `[Client escalated — you caved]` and client pushes for more.

---

### 2:00 — Hold boundary (30 sec)

**Do:** Reply with a boundary:

> *"Those items are outside our original scope. Happy to send a revised quote for the extra work."*

**Expected:** `[Client eased off — boundary held]` and client softens or pivots.

**Do:** Send one more short reply, then click **End Session & Get Feedback**.

---

### 2:30 — Coach feedback (30 sec)

**Say:**  
*"Second agent — the coach — runs once at the end. One LLM call, not per turn."*

**Do:** Read aloud one *What worked* and the *Veteran move* line.

**Say:**  
*"Tool radar for staying current, client simulator for judgment — both in one workflow. Questions?"*

---

## Hackathon track tie-in (if asked)

| Track focus              | How EdgeDesk shows it                          |
|--------------------------|------------------------------------------------|
| Multi-Agent Workflows    | Client agent + coach agent, adaptation loop    |
| Knowledge Retrieval/RAG  | Radar: profile → retrieve dataset → rank       |
| Intelligent Analytics    | Transparent score breakdown per recommendation |
| Workspace Automation     | Profile persists; radar pre-fills simulator    |

---

## Fallbacks if something breaks

| Issue | Recovery |
|-------|----------|
| Radar empty | Re-click Run Radar; same input returns cached result instantly |
| Simulator 503 | Say: *"Needs API key in production"* — show Tool Radar only |
| Slow LLM | Keep replies short; end session after 2 user messages |
| Wrong rankings | Change skills live to show order changing — proves it's not static |

---

## Quick keyboard path (rehearsal)

1. Home → **Load demo profile**
2. **Run Radar** → show #1 breakdown
3. Nav → Simulator → **Scope Creeper**
4. Cave message → boundary message → **End Session**
5. Read coach feedback

Total: **~6 clicks** after landing on home.
