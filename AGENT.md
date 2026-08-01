# AGENT.md — Project Guardrails for "AIML Studio"

> Antigravity reads this file on startup. These rules apply to **every** task, in every session, unless the human owner explicitly overrides them in the current conversation.

## 1. Project in one paragraph
**AIML Studio** is a free, static, interactive web platform that teaches the course *Artificial Intelligence and Machine Learning (2304322T)*, MIT Academy of Engineering, Third Year B.Tech (Rev. 2023 NEP, AY 2025-26). Students learn each algorithm visually and interactively (watch → predict → tweak → break → code → quiz). Phases map to syllabus units (Unit 1–6). The full brief is in `01_MASTER_PROMPT.md`.

## 2. Authority order (when instructions conflict)
1. The human owner's latest message
2. This `AGENT.md`
3. `01_MASTER_PROMPT.md`
4. `LOOP_ENGINEERING.md`, `Automated Verification Loops.md`, `skills.md`, `RECOMMENDED_WORKFLOW.md`
5. The syllabus PDF (authority on **scope/topics**)
6. Your own judgement

## 3. Workspace map
- **Root:** the syllabus PDF, `ML/` (or `ML.zip`) — **instructor source material. READ-ONLY. Never modify, move, rename, delete or commit-over it.**
- `web/` — the application (Vite + React + TypeScript).
- `tools/` — ingestion, golden-fixture generators (Python), content/originality/coverage checkers.
- `docs/` — `PROGRESS.md`, `DECISIONS.md` (ADRs), `GAP_ANALYSIS.md`, `CONTENT_MAP.md`, `COVERAGE.md`, `evidence/phase-N/`.
- Do not create files outside these locations without recording why in `docs/DECISIONS.md`.

## 4. Operating mode
- **Plan before you build.** Every phase starts with an implementation-plan Artifact; do not write app code for a phase until the human approves that plan.
- **One phase at a time.** Never begin phase N+1 until phase N's Exit Gate is green and the human says "proceed".
- **One task at a time** inside a phase, each with explicit acceptance criteria, ending in a verification run and a commit.
- **Read `docs/PROGRESS.md` at the start of every session and update it at the end of every task.** It is your memory.
- If a required file (`PROGRESS.md`, gates, skills) is missing, say so and recreate it before continuing.

## 5. Non-negotiable rules

### Safety & scope
- **Never** run destructive commands (`rm -rf`, force-push, `git reset --hard`, dropping directories, overwriting source material) without explicit human approval in this conversation. Never touch anything outside the workspace.
- **No secrets.** No API keys, tokens, or credentials in code, config, logs or commits. The app needs none.
- **No backend, no accounts, no third-party analytics/trackers.** Everything runs in the browser. Cost must stay **$0**.
- **No scope creep.** Features not in the master prompt need a proposal and approval first.
- Do not install dependencies casually: prefer what's already approved in the ADRs; justify any new one (size, licence, maintenance) in an ADR. Pin versions.

### Copyright & originality
- Lecture slides, PDFs and the two textbooks in `ML/` are copyrighted. **Use them to understand scope and behaviour only.** Write original explanations, original diagrams, original quiz items and original code. Never paste their text/figures/code into the product. Never copy the textbook PDFs into `web/` or build output.
- Datasets: ship only small sampled subsets (≤ 200 KB each); flag unclear provenance in `docs/GAP_ANALYSIS.md`.
- Run `npm run check:originality` before any content commit.

### Honesty & integrity
- **Never fake evidence.** Do not claim tests passed unless you ran them and saw them pass. Attach real output/screenshots to the verification artifact.
- **Never weaken verification to get green:** no deleting/skipping tests, loosening tolerances, adding `@ts-ignore`, `eslint-disable`, or `any` to dodge errors, unless an ADR documents why and the human approved.
- If you cannot fix a failure within the retry budget (see `LOOP_ENGINEERING.md`), **stop and report** with what you tried. Do not thrash.
- If syllabus content is missing from the source material, say so (`docs/GAP_ANALYSIS.md`) and author it from standard knowledge, marked `source: syllabus-only`. Never silently invent facts.

## 6. Architecture rules
- **Engine → Trace → Player.** Every algorithm is a pure, framework-free TypeScript engine in `web/src/engines/**` that yields immutable `Step` snapshots. UI components never contain algorithm logic. Engines never import React/DOM.
- **All randomness is seeded.** No bare `Math.random()` in engines or labs; use the project's seeded RNG utility.
- **Immutability:** step snapshots are never mutated after being yielded.
- **TypeScript strict mode** on; no implicit `any`; no unused exports in engines.
- **Code-split** by route and by lab. Pyodide loads only on explicit user action. Initial route JS ≤ 200 KB gzip.
- React owns the DOM; D3 is used for scales/shapes/math only.
- Content lives in MDX with validated front-matter; labs/engines are referenced by id and the build fails on dangling ids.
- Small datasets in `web/src/data/`; each with a `README` noting origin and licence status.

## 7. Content & pedagogy rules
- Follow the **Concept Page Template** (Master Prompt §8) exactly. Order: hook → intuition → try-it (predict-then-reveal) → step-through → math (collapsible) → pseudo-code → code lab → make-it-fail → strengths/limitations → misconceptions → quiz → exam/viva → summary.
- **Intuition before math. One idea per screen.** Define jargon on first use (glossary entry required).
- Every algorithm page shows a **failure mode** and **limitations** (serves CO4).
- Every hand-worked example in prose has a **unit test** asserting the same numbers.
- Quiz items must explain **why each wrong option is wrong**.
- Voice: friendly, direct, second person, short sentences, no hype, no filler.

## 8. UX, accessibility, performance (hard requirements)
- WCAG 2.2 AA: keyboard operable, visible focus, colour never the only signal, ARIA on custom widgets, narrated step descriptions for screen readers, `prefers-reduced-motion` honoured.
- Responsive from 360 px wide. Test every lab at 360, 768, 1280.
- Colour-blind-safe palette; add shape/pattern redundancy to categorical colours.
- Lighthouse mobile targets: Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 90.
- Every lab has loading, empty and error states; inputs are clamped/validated; no way to crash the page from the UI.
- Every lab has: Reset, Presets (incl. a "breaks the algorithm" preset), step-back, speed control, and "Make it fail".

## 9. Verification (summary — details in `Automated Verification Loops.md`)
Before declaring any task done: `npm run verify:fast` green.
Before declaring any phase done: `npm run verify:phase` green + browser-agent walkthrough evidence + pedagogy checklist + human sign-off.
Levels: L0 static · L1 engine unit/property/golden · L2 component · L3 e2e + browser agent · L4 content (schema, links, coverage, originality) · L5 quality (a11y, perf, bundle).

## 10. Git hygiene
- Conventional commits (`feat(unit2): add A* admissibility lab`), one task ≈ one commit, never commit failing code to the main working branch, never commit `node_modules`, build output, extracted source text, or anything from `ML/` copyrighted books.
- Maintain `.gitignore` for: `ML/**/*.pdf` books, `tools/ingest/out/`, `web/dist/`, `node_modules/`, `.venv/`.

## 11. Communication style
- Be concise and concrete. Lead with outcome, then evidence, then next step.
- At the end of each task: **what changed · how it was verified (real output) · what's next · any decisions/risks**.
- Ask the human only about **requirements or taste**; decide technical details yourself and log an ADR.
- Never apologise at length or pad. Never say "done" without evidence.

## 12. Definition of Done (task)
- [ ] Acceptance criteria met
- [ ] `verify:fast` green (real output attached)
- [ ] Tests added/updated for any logic or content claim
- [ ] No lint/type suppressions added
- [ ] Originality check passed (if content)
- [ ] `docs/PROGRESS.md` updated
- [ ] Committed with a conventional message

## 13. Definition of Done (phase)
- [ ] All phase tasks done
- [ ] `verify:phase` green (L0–L5), evidence in `docs/evidence/phase-N/`
- [ ] Browser-agent walkthrough at 360/768/1280 with screenshots/recording
- [ ] Syllabus coverage matrix updated; no uncovered bullet for this unit
- [ ] Pedagogy checklist completed for every new concept page
- [ ] Gap items for this unit listed for human review
- [ ] Human has said "proceed"

## 14. When to stop and ask
Stop immediately and ask the human if: a required decision isn't covered here · a destructive action seems necessary · source material contradicts the syllabus · a gate fails after the retry budget · you're tempted to weaken a test · a dependency has an unclear licence · the scope seems to be growing.
