# LOOP ENGINEERING — How Antigravity Must Work on AIML Studio

A **loop** is a repeatable cycle with a goal, a verifiable exit condition, a retry cap, and an escalation path. Work happens inside loops; nothing is "done" because it feels done.

Nested structure:
```
PROJECT LOOP  (phases 0→9, human gated)
 └─ PHASE LOOP   (plan → tasks → gate → sign-off)
     └─ TASK LOOP    (plan → build → verify → reflect → commit)
         ├─ ENGINE LOOP    (algorithm correctness)
         ├─ CONTENT LOOP   (concept page quality)
         ├─ LAB LOOP       (visual/interactive quality)
         └─ RECOVERY LOOP  (when stuck)
 SESSION LOOP (start/end ritual around everything)
```

## 1. SESSION LOOP — every conversation
**Start (always, in this order):**
1. Read `AGENT.md`, `docs/PROGRESS.md`, the current phase plan artifact.
2. Run `git status` and `npm run verify:fast` → establish the baseline. If red before you touch anything, say so and fix/triage first.
3. State in ≤ 5 lines: current phase, current task, last known good state, what you will do now.

**End (always):**
1. Ensure the tree is committed or intentionally stashed with a note.
2. Update `docs/PROGRESS.md` (format in §7).
3. Report: done · verified (real output) · next · blockers · decisions needing the human.

## 2. TASK LOOP — the core cycle
```
PLAN     restate task + acceptance criteria (AC) + which verification levels apply
BUILD    smallest change that could satisfy the AC (test-first for engines)
VERIFY   run the narrow check → then verify:fast → then level-specific checks
REFLECT  compare result to AC line by line; look for what you did NOT test
FIX?     if any check/AC fails → RECOVERY LOOP (attempt counter++), else continue
RECORD   ADR if a decision was made; update PROGRESS.md; commit
```
**Exit condition:** every AC item ticked with evidence **and** `verify:fast` green **and** commit made.
**Task size:** if a task will touch > ~8 files or take > ~1 hour of work, split it first.
**Test-first for engines:** write the hand-worked-example test and invariants *before* the implementation; watch it fail; then implement.

## 3. ENGINE LOOP (algorithms)
1. Write the spec: inputs, outputs, `Step` state shape, pseudo-code, complexity.
2. Write tests: hand-worked example → invariants → edge cases → determinism → golden fixture (if library parity applies).
3. Implement as a pure generator yielding immutable snapshots with plain-language `description`s.
4. Run tests; iterate (RECOVERY LOOP on failures).
5. **Cross-check against an independent oracle** (scikit-learn fixture, a brute-force solver, or a simpler algorithm — e.g. A* vs UCS, alpha-beta vs minimax).
6. Property-test with ≥ 200 random seeds.
7. Perf sanity: default input completes < 50 ms to first step; full trace within `maxSteps`.
**Exit:** all of the above green + engine README (what/inputs/steps/limits).

## 4. CONTENT LOOP (concept pages)
```
DRAFT   follow Concept Page Template; write intuition + example FIRST
CHECK   machine: check:content, check:links, check:engine-ids, check:originality
REVIEW  self-review with the Pedagogy Checklist (below); list weaknesses honestly
REVISE  fix; re-run CHECK
STUDENT SIM  browser-agent plays "new student": time-to-first-insight, confusion log
REVISE  fix top 3 confusions; re-run
```
**Pedagogy Checklist (tick each, with a one-line justification):**
- [ ] Hook is concrete, ≤ 80 words
- [ ] Intuition precedes math; one analogy; one diagram
- [ ] A prediction prompt precedes the animation
- [ ] The step-through example is small enough to verify on paper — and a test asserts it
- [ ] Failure mode demonstrated
- [ ] Strengths / limitations / when-not-to-use present
- [ ] 2–4 misconceptions addressed, each tied to a quiz item
- [ ] Every quiz option has an explanation
- [ ] All jargon has a glossary entry
- [ ] Original wording (originality check passed, not just paraphrase-swapped)
- [ ] Exam/viva corner included
**Exit:** machine checks green + checklist fully ticked + student-sim confusions resolved.

## 5. LAB LOOP (interactive visualisations)
1. Define the **single learning goal** of the lab in one sentence ("see why a too-large learning rate diverges").
2. Define controls (≤ 5 primary), presets (incl. "breaks the algorithm"), metrics shown.
3. Build on the Player framework: engine → trace → view.
4. Verify: L2 component tests; L3 Playwright at 360/768/1280; axe; reduced-motion; keyboard-only run-through.
5. Browser agent: try to **break the lab** (extreme inputs, rapid clicking, resize mid-animation, back/forward). Fix everything found.
6. Learning-goal test: can a student answer the lab's "Check yourself" correctly *only by using the lab*? If the lab doesn't make the answer evident, redesign.
**Exit:** goal achieved, no console errors, 45 fps budget, a11y clean, URL-state round-trip works.

## 6. RECOVERY LOOP — when something fails
```
attempt = 1
repeat:
  1. READ the first error in full. Do not guess from the last line.
  2. REPRODUCE with the narrowest command (single test / single route).
  3. HYPOTHESISE (write 2–3 candidate causes; rank by likelihood and cost-to-check).
  4. TEST the top hypothesis with a diagnostic (log, assertion, minimal repro) — change ONE variable.
  5. FIX the root cause, not the symptom.
  6. RE-RUN narrow → level → verify:fast.
  attempt++
until green  OR  attempt > 3
```
**If attempt > 3 → STOP.** Write a Failure Report in the chat and `docs/PROGRESS.md`:
- Symptom (exact error / screenshot) · Expected vs actual
- Hypotheses tested and results
- Current best theory of root cause
- 2–3 options with trade-offs, and your recommendation
Then ask the human. Do **not** keep trying variations.

**Stuck signals (stop and re-plan when you notice any):** same error twice after "fixes" · fixing one test breaks another repeatedly · edits growing larger each attempt · you're adding workarounds around a workaround · you're tempted to weaken a test. → Revert to last green commit, re-read the AC, simplify the approach.

## 7. STATE & MEMORY — `docs/PROGRESS.md` format
Keep it short, current, and machine-readable enough to resume cold.
```md
# PROGRESS
## Now
Phase: 3 (Unit 2 — Search) | Task: T3.07 A* admissibility lab | Status: verifying
Last green commit: <hash> "feat(unit2): ucs+astar engines"
## Phase checklist
- [x] Phase 0 approved <date>   - [x] Phase 1 gate green <date>   - [ ] Phase 3 (in progress)
## Task log (latest first)
- T3.07 … status, evidence link, notes
## Open decisions / questions for human
1. …
## Risks & watch-list
- …
## Known gaps (links to GAP_ANALYSIS.md)
```
ADRs (`docs/DECISIONS.md`): `ADR-NNN | Date | Context | Options | Decision | Consequences`. Never edit past ADRs; supersede them.

**Context hygiene:** keep long outputs in files, not chat. When a conversation grows long or you notice repetition/forgetting, run the End ritual and tell the human to start a fresh session; the fresh session restores from `PROGRESS.md`.

## 8. PHASE LOOP
```
1 PLAN     implementation-plan artifact: tasks T#.##, AC, verification levels, risks, order
2 APPROVE  human approves or edits (do not build before this)
3 SLICE    build the thinnest vertical slice of the unit first (one concept end-to-end), verify, show
4 BUILD    remaining tasks via TASK LOOP; most-valuable-first order
5 INTEGRATE unit landing, nav, search index, glossary, cheat sheet, practice bank
6 GATE     verify:phase + browser walkthrough + coverage + pedagogy checklists
7 DEMO     walkthrough artifact w/ screenshots/recording; list open issues honestly
8 SIGN-OFF human says "proceed" (or lists changes → back to 4)
```
**Order of work inside a unit (default):** flagship lab engines → concept pages (simplest first) → case study → self-study/further reading → quizzes → cheat sheet → polish.

## 9. REVIEW LOOP (self-critique before showing the human)
Before presenting any phase demo, answer in writing:
1. What would a confused first-year hit first? 2. Which claim here am I least sure is correct, and how did I verify it? 3. Which test would catch me if I'm wrong? 4. What did I skip or defer? 5. What's the single biggest risk left?
Include the answers in the demo artifact. Honest weaknesses build trust; hidden ones destroy it.

## 10. ESCALATION RULES
Ask the human when: requirement ambiguity affects learning design · syllabus vs material conflict · design taste calls (2 options with a recommendation) · dependency licence/size trade-offs beyond ADR defaults · failure after 3 attempts · scope growth · anything destructive.
Do **not** ask about: naming, file placement within the layout, routine library API choices, test structure, formatting.

## 11. ANTI-PATTERNS (never do)
- Declaring done without running the checks · pasting a summary instead of real output
- Big-bang phases (building everything, testing at the end)
- Editing tests/fixtures/tolerances to match wrong output
- Algorithm logic inside React components
- Unseeded randomness in engines or labs
- Silent scope additions · silent dependency additions
- Copying instructor slides/book text/figures
- Cosmetic polish before correctness · animations with no learning goal
- Retrying the same fix hoping for a different result
- Leaving `PROGRESS.md` stale

## 12. QUICK REFERENCE — loop caps & budgets
| Loop | Cap | On exceed |
|---|---|---|
| Fix attempts per failure | 3 | Failure Report → human |
| Content revise cycles | 3 | Ask human to arbitrate |
| Task size | ~8 files / ~1 h | Split task |
| Chat context | until repetition appears | End ritual → new session |
| Phase demo rework rounds | unlimited, but each logged | — |
