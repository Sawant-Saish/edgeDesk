# DATA MODELS — Mongoose Schemas

> Cursor: create these exactly as named. Do not add fields beyond what's here without flagging it —
> extra fields are usually a sign the LLM is trying to store something it should be validating instead.

## SkillProfile (output of F1, consumed by F2 & F4)

```js
const SkillProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sourceType: { type: String, enum: ['pdf', 'pasted_text'], required: true },
  rawTextHash: { type: String, required: true }, // sha256 of input, so we can dedupe/cache LLM calls
  extractedSkills: [{
    skillId: { type: String, required: true },      // MUST match an id in skillTaxonomy.data.js
    confidence: { type: Number, min: 0, max: 1 },    // from LLM, surfaced in UI, never hidden
    evidenceSnippet: { type: String, maxlength: 200 } // the resume text that justified this skill
  }],
  yearsExperience: { type: Number, default: 0 },
  extractionModel: { type: String, required: true }, // e.g. "claude-sonnet-4-6", for auditability
  createdAt: { type: Date, default: Date.now }
});
```

**Note:** `skillId` is a foreign-key-style reference into the static taxonomy, not a free string the LLM can invent. If the LLM returns a skill name that doesn't match any taxonomy entry (even after fuzzy match), it is dropped and logged — never silently stored as a new canonical skill.

## SkillGapResult (output of F2)

```js
const SkillGapResultSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetRoleId: { type: String, required: true },     // FIXED dropdown value, e.g. "frontend_react_dev"
  missingSkills: [{ type: String }],                   // skillIds, computed by set-difference (plain JS)
  matchedSkills: [{ type: String }],
  matchPercentage: { type: Number, min: 0, max: 100 }, // matchedSkills.length / required.length * 100
  explanationText: { type: String, maxlength: 400 },   // LLM-written, cosmetic only, never used in scoring
  computedAt: { type: Date, default: Date.now }
});
```

## Course (seeded, read-mostly — see courses.seed.json)

```js
const CourseSchema = new Schema({
  courseId: { type: String, required: true, unique: true },
  title: String,
  provider: String,          // "Coursera", "Udemy", "YouTube - freeCodeCamp", etc.
  skillIds: [String],        // which taxonomy skills this course covers
  priceUSD: Number,
  durationHours: Number,
  rating: { type: Number, min: 0, max: 5 },
  lastUpdated: Date,         // for recency scoring
  url: String
});
```

## NegotiationSession (F4)

```js
const NegotiationSessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  briefId: { type: String, required: true },   // references a seeded project-brief template
  clientPersona: {
    name: String,
    budgetRangeUSD: { min: Number, max: Number }, // SEEDED from briefId template, never LLM-invented
    difficultyLevel: { type: String, enum: ['easy', 'medium', 'hard'] },
    objectionStyle: { type: String, enum: ['price_focused', 'scope_creep', 'deadline_pressure'] }
  },
  messages: [{
    role: { type: String, enum: ['user', 'client'] },
    text: String,
    timestamp: { type: Date, default: Date.now }
  }],
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  scorecard: {
    finalAgreedPriceUSD: Number,
    clarityScore: { type: Number, min: 0, max: 10 },
    boundaryScore: { type: Number, min: 0, max: 10 },   // did they hold scope/price boundaries
    professionalismScore: { type: Number, min: 0, max: 10 },
    summaryText: { type: String, maxlength: 500 }
  }
});
```

## Static seed files (not Mongo collections — plain JS/JSON, version-controlled)

- `skillTaxonomy.data.js` — array of `{ skillId, displayName, category }`. This is the closed vocabulary. Start with 40–60 entries covering common web dev + a couple of adjacent stacks. **Cursor: generate this list once, review it manually, do not let it grow dynamically at runtime.**
- `roleRequirements.data.js` — array of `{ roleId, displayName, requiredSkillIds: [...] }` — powers F2's set-difference.
- `courses.seed.json` — 30–50 real courses (title/provider/url should be real, verifiable links — do not let the LLM invent fake course URLs).
- `projectBriefs.seed.json` — 10–15 negotiation scenario templates with fixed budget ranges and objection styles.
