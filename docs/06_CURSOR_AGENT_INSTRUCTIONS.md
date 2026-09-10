# INSTRUCTIONS FOR CURSOR — read this before writing any code

This is one module (the "Freelancer Readiness Module", FRM) being added to the existing IncomeX MERN
codebase. Six other files sit next to this one — read them in this order before starting:

1. `00_PROJECT_BRIEF.md` — what we're building and explicitly NOT building
2. `01_SYSTEM_ARCHITECTURE.md` — folder structure, tech stack, data flow
3. `02_DATA_MODELS.md` — exact Mongoose schemas
4. `03_API_CONTRACTS.md` — exact request/response shapes for every endpoint
5. `04_LLM_PROMPTS_AND_GUARDRAILS.md` — exact prompts and validation rules
6. `05_IMPLEMENTATION_PHASES.md` — build order and acceptance criteria per phase

## Ground rules while building

1. **Build one phase at a time**, in the order given in file 05. Do not jump ahead to Phase 3 while Phase 1's acceptance criteria are unmet.
2. **Do not invent fields, endpoints, or schema shapes** that aren't in files 02/03. If something seems missing or ambiguous, stop and ask rather than guessing — a wrong guess here becomes a data model migration later.
3. **Every LLM call goes through `shared/llmClient.js`.** If you find yourself calling the LLM API directly from a controller, stop — that's the pattern this architecture is explicitly designed to avoid.
4. **Never let the LLM be the source of truth for a closed vocabulary** (skill names, course data, role requirements, budget numbers). Those live in the seed files. The LLM reads language and writes language; deterministic code does the math and the lookups.
5. **Schema-validate before persisting or displaying.** If validation fails twice, surface an honest error state — never show partial or fabricated data to make the UI look like it "worked."
6. **Write the seed data files by hand/review them manually** (Phase 0) — don't let the LLM auto-generate the skill taxonomy or course list without a human pass, since that data becomes the ground truth everything else is checked against.
7. **Reuse existing IncomeX infrastructure** — auth middleware, User model, Mongo connection, IncomeX Score logic if it exists. Do not duplicate systems that already exist elsewhere in the repo.
8. **After each phase, run the acceptance criteria in file 05 before moving on**, and report back which passed/failed rather than assuming success.

## Style/conventions
- Match whatever ESLint/Prettier config already exists in the IncomeX repo — don't introduce a new style.
- Controllers stay thin (parse request, call service, format response). All logic lives in `*.service.js` files, since that's what makes deterministic pieces (skill gap math, course scoring) unit-testable in isolation from Express.
- Every service function that touches the LLM should be independently testable by mocking `llmClient.js` — this is what lets you verify guardrails without burning API calls on every test run.

## First message to send Cursor (paste this to kick off Phase 0)

> Read all 7 files in this spec folder. Start with Phase 0 from `05_IMPLEMENTATION_PHASES.md`: create the
> `modules/frm/` folder structure from `01_SYSTEM_ARCHITECTURE.md`, then write the four seed data files
> (`skillTaxonomy.data.js`, `roleRequirements.data.js`, `courses.seed.json`, `projectBriefs.seed.json`) and
> `validateSchema.js`. Do not touch any LLM integration yet. Show me the seed files before moving to Phase 1
> so I can review the skill taxonomy by hand.
