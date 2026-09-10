# API CONTRACTS

> All endpoints are prefixed `/api/frm/...` and sit behind the existing IncomeX JWT auth middleware.
> All request/response bodies below are the CONTRACT. Cursor must not add/remove fields silently —
> if a field seems missing while implementing, stop and flag it rather than inventing one.

## F1 — Resume Intake

### `POST /api/frm/resume/upload`
Request: `multipart/form-data` with `file` (PDF) OR JSON `{ "pastedText": "..." }`

Response `200`:
```json
{
  "skillProfileId": "665f...",
  "extractedSkills": [
    { "skillId": "react", "displayName": "React", "confidence": 0.92, "evidenceSnippet": "Built 3 React dashboards..." }
  ],
  "yearsExperience": 2,
  "lowConfidenceWarning": false
}
```
Response `422` (validation failed twice):
```json
{ "error": "extraction_failed", "message": "Could not confidently extract skills. Try pasting text instead of PDF." }
```

## F2 — Skill Gap

### `GET /api/frm/skill-gap?skillProfileId=...&targetRoleId=...`

Response `200`:
```json
{
  "targetRoleId": "frontend_react_dev",
  "matchPercentage": 64,
  "matchedSkills": ["react", "javascript", "css"],
  "missingSkills": ["typescript", "testing_jest", "graphql"],
  "explanationText": "You're solid on core React fundamentals but haven't shown TypeScript or testing experience yet."
}
```
`targetRoleId` must come from a fixed enum the frontend renders as a dropdown (source: `roleRequirements.data.js`). Never accept free-text role names.

## F3 — Course Comparator

### `GET /api/frm/courses?skillId=typescript`

Response `200`:
```json
{
  "skillId": "typescript",
  "courses": [
    {
      "courseId": "ts-101",
      "title": "TypeScript Fundamentals",
      "provider": "Coursera",
      "priceUSD": 49,
      "durationHours": 12,
      "rating": 4.6,
      "score": 82.4,
      "scoreBreakdown": { "valueForMoney": 30, "timeEfficiency": 22.4, "quality": 30 },
      "url": "https://..."
    }
  ]
}
```
Scoring rubric (fixed formula, implement exactly, do not let LLM adjust weights):
- `valueForMoney` (0-30) = inverse-normalized priceUSD within result set
- `timeEfficiency` (0-30) = inverse-normalized durationHours within result set
- `quality` (0-40) = `(rating / 5) * 40`, with a recency penalty of −5 if `lastUpdated` is >2 years old

## F4 — Negotiation Simulator

### `POST /api/frm/negotiation/start`
Request: `{ "skillProfileId": "665f...", "difficultyLevel": "medium" }`

Response `200`:
```json
{
  "sessionId": "667a...",
  "clientPersona": { "name": "Priya, Startup Founder", "difficultyLevel": "medium" },
  "openingMessage": "Hi! I need a landing page built in 2 weeks, budget is tight..."
}
```
Note: `budgetRangeUSD` and `objectionStyle` are stored server-side on the session but NOT sent to the frontend — the user shouldn't see the client's hidden constraints, same as real negotiation.

### `POST /api/frm/negotiation/:sessionId/message`
Request: `{ "text": "I can do it for $800 in 10 days." }`

Response `200`:
```json
{ "reply": "That's a bit above what I budgeted — can you do $600?", "turnCount": 3 }
```
Server enforces a max turn count (e.g. 12) — after that, force session to `completed` and require scoring, so the LLM can't loop indefinitely.

### `POST /api/frm/negotiation/:sessionId/end`

Response `200`:
```json
{
  "scorecard": {
    "finalAgreedPriceUSD": 700,
    "clarityScore": 7,
    "boundaryScore": 6,
    "professionalismScore": 9,
    "summaryText": "You communicated clearly and stayed professional, but conceded on price faster than needed given your stated experience level."
  }
}
```

## Error contract (applies to all endpoints)

Every error response uses this shape, so the frontend has one error-handling path:
```json
{ "error": "machine_readable_code", "message": "human readable sentence" }
```
