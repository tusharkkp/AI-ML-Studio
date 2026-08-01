# Automated Verification Loops — AIML Studio

Purpose: make "is it correct?" a **command you run**, not an opinion. Every task and phase passes through these loops. Evidence is real output, saved to `docs/evidence/phase-N/`.

## 1. The six verification levels

| Level | Name | What it proves | Tooling | When |
|---|---|---|---|---|
| **L0** | Static | Code compiles, is typed, formatted, lint-clean | `tsc --noEmit`, ESLint, Prettier | every task |
| **L1** | Engine correctness | Algorithms are *right* | Vitest, fast-check, golden fixtures vs scikit-learn | every engine task |
| **L2** | Component | UI pieces behave and are accessible | Vitest + Testing Library + jest-axe | every component task |
| **L3** | End-to-end + agent walkthrough | Real flows work in a real browser | Playwright; Antigravity browser agent | every lab/page, every phase |
| **L4** | Content integrity | Content is valid, complete, original | custom `tools/check-*.ts` | every content task |
| **L5** | Quality budgets | Fast, accessible, small, resilient | Lighthouse CI, axe, bundle analyser | per phase |

## 2. Commands (create these npm scripts in Phase 1)

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings=0",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:engines": "vitest run src/engines",
    "test:components": "vitest run src/components src/features",
    "e2e": "playwright test",
    "e2e:shots": "playwright test --project=shots",
    "check:content": "tsx ../tools/check-content.ts",
    "check:links": "tsx ../tools/check-links.ts",
    "check:coverage": "tsx ../tools/check-coverage.ts",
    "check:originality": "tsx ../tools/check-originality.ts",
    "check:engine-ids": "tsx ../tools/check-engine-ids.ts",
    "check:a11y": "playwright test --project=a11y",
    "check:bundle": "tsx ../tools/check-bundle.ts",
    "lhci": "lhci autorun",
    "verify:fast": "npm run typecheck && npm run lint && npm run format:check && npm run test",
    "verify:content": "npm run check:content && npm run check:links && npm run check:engine-ids && npm run check:originality && npm run check:coverage",
    "verify:phase": "npm run verify:fast && npm run verify:content && npm run build && npm run e2e && npm run check:a11y && npm run check:bundle && npm run lhci",
    "verify:full": "npm run verify:phase"
  }
}
```
Paths adjust to final layout; keep the **names** stable so docs stay true.

## 3. Level details

### L0 — Static
- TypeScript `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`.
- ESLint: react-hooks, jsx-a11y, import rules; **ban**: `Math.random` in `engines/` and `labs/`, `any`, `@ts-ignore`, `eslint-disable` (allowed only via ADR-listed exceptions), `console.log` in `src/`.
- Zero warnings policy.

### L1 — Engine correctness (the heart of trust)
For **every** engine:
1. **Hand-worked examples:** the exact numbers shown on the content page are asserted (e.g. "BFS on graph G expands A,B,C,D in that order"; "information gain of Outlook on play_tennis = 0.247").
2. **Invariants / properties (fast-check):**
   - Search: BFS path length is minimal on unweighted graphs; A* with an admissible heuristic returns optimal cost = UCS cost; DFS visits ⊆ reachable set; alpha-beta returns the **same value as minimax** on random trees while expanding ≤ nodes; IDDFS result depth = BFS depth.
   - CSP: every returned assignment satisfies all constraints; AC-3 never removes a value that appears in some solution.
   - Regression: GD loss is non-increasing for a sufficiently small learning rate; closed-form normal-equation solution ≈ converged GD; R² ∈ (−∞,1], = 1 on exact fit.
   - Classification: probabilities sum to 1; confusion-matrix counts sum to N; ROC AUC ∈ [0,1], AUC of perfect separator = 1; threshold→0 gives recall=1.
   - Trees: leaf purity improves or equals parent weighted impurity; pruned tree never deeper than the original.
   - Clustering: k-means inertia non-increasing per iteration; DBSCAN labels deterministic under seed; PCA components orthonormal, explained-variance ratios sum to ≤ 1 and descend.
   - Apriori: downward-closure holds (every subset of a frequent itemset is frequent); support ∈ [0,1]; confidence = supp(A∪B)/supp(A).
3. **Golden fixtures vs scikit-learn:** `tools/fixtures/*.py` generate JSON (inputs, seed, expected outputs, library versions). TS tests load them and compare within tolerance (default `1e-6` closed-form, `1e-3` iterative). Where parity is impossible (e.g. SVM solver, k-means++ init differences), assert **invariants + accuracy/inertia range** and write the reason in the test file header.
4. **Determinism:** same seed → identical trace (deep equality). Different seed → allowed to differ.
5. **Trace contract:** every `Step` has non-empty `description`, serialisable `state`, monotonic `index`; traces terminate within `maxSteps`; snapshots not mutated after yield (deep-freeze in tests).
6. **Edge cases:** empty input, single node, disconnected graph, unsolvable puzzle, all-same labels, k > n, collinear points, zero variance feature, division-by-zero guards.
7. **Coverage:** engines ≥ 90 % lines/branches.

### L2 — Component
- Player: play/pause/step/back/scrub/speed/reset operate against a fake engine; keyboard shortcuts work; ARIA live region receives step descriptions.
- Quiz: correct/incorrect feedback, explanation per option, state persisted.
- Progress store: persistence, export/import round-trip, corrupted-JSON recovery.
- Glossary hover, MDX components render, error boundaries show friendly fallback.
- `jest-axe` has zero violations on each component story.

### L3 — End-to-end & browser-agent walkthrough
**Playwright (automated, CI-style):**
- For each unit: landing → first concept → open lab → run → step back → change param → "Make it fail" → complete quiz → progress persists after reload.
- Viewports: **360×740, 768×1024, 1280×800**. Capture screenshots to `docs/evidence/phase-N/shots/`.
- **Zero console errors/warnings**, zero failed network requests (other than intentionally lazy Pyodide).
- Offline-ish check: block third-party hosts; app must still work.
- Lab URL state: copy URL → reopen → identical state.
- Pyodide lab: click Run → loading UI → result; failure path shows fallback output.

**Antigravity browser-agent walkthrough (per phase, recorded):** the agent follows a written script (`docs/evidence/phase-N/walkthrough.md`) as a *new student*: finds the topic, predicts, runs the lab, breaks it, takes the quiz. It must report **confusing moments** (unclear label, jargon without hover, dead end). Each reported confusion becomes a fix task.

### L4 — Content integrity (custom scripts in `tools/`)
- `check-content`: MDX front-matter validates against schema (id, unit, order, minutes, COs, prerequisites, source flag, syllabus topic ids); required template sections all present and in order; each concept has ≥ 4 quiz items; every wrong option has an explanation; every glossary term used is defined; KaTeX parses (no red error spans); no empty headings; images have alt text.
- `check-links`: internal links/anchors resolve; prerequisite graph has **no cycles**; no orphan pages.
- `check-engine-ids`: every `<Lab id>` / `<Engine id>` in MDX exists.
- `check-coverage`: every syllabus bullet (maintained in `docs/syllabus.json`) maps to ≥ 1 concept page, ≥ 1 lab (where applicable) and ≥ 4 quiz items. **Fails build on any uncovered bullet.** Generates `docs/COVERAGE.md`.
- `check-originality`: extracts text from `ML/` PDFs/notebooks (cached in `tools/ingest/out/`, git-ignored); fails if any page has a run of **≥ 8 consecutive identical words** (stop-word-aware) or ≥ 25 % shingle overlap with a single source. Reviewer decides on flagged items; do not "fix" by superficial synonym swaps — rewrite the explanation.
- Reading-level report (informational): Flesch–Kincaid per page; flag > grade 13.

### L5 — Quality budgets
- **Lighthouse CI (mobile)**: Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO ≥ 90 on landing, a concept page, a heavy lab.
- **axe** via Playwright on every route type: 0 serious/critical.
- **Bundle:** initial route JS ≤ 200 KB gzip; no single lab chunk > 150 KB gzip (excluding Pyodide); Pyodide absent from initial network log.
- **Runtime:** lab default scenario ≥ 45 fps on CPU 4× throttle (Playwright trace); no layout shift > 0.1.
- **Resilience:** reduced-motion mode renders without animation; high-contrast/dark mode screenshots pass visual diff against baseline (threshold 0.2 %).

## 4. Phase gates (what "green" means)

**Task gate (every task):** L0 + L1/L2 for touched code · `check:originality` if content · commit.

**Phase gate (every phase):**
1. `npm run verify:phase` fully green (paste the real tail of the output).
2. L3 screenshots at three viewports saved; browser-agent walkthrough report saved with confusion list resolved.
3. L5 report saved (Lighthouse JSON/summary, bundle table).
4. `docs/COVERAGE.md` regenerated; this unit shows 100 %.
5. Pedagogy checklist signed for each new concept (list ids).
6. Gap items for this unit surfaced in `docs/GAP_ANALYSIS.md`.
7. Human sign-off recorded in `docs/PROGRESS.md`.

### Per-phase extra checks
- **Phase 1:** vertical slice (BFS) passes L0–L5 end-to-end; template, player, quiz, glossary, progress, search all demonstrated.
- **Phases 2–7:** unit-specific invariants in §3/L1 all implemented; every flagship module from Master Prompt §4 present, or explicitly deferred with human approval.
- **Phase 8:** learning-path integrity (no dead ends), exam-mode timers, cross-unit comparison data matches engine metrics.
- **Phase 9:** full audit — `verify:full` ×2 consecutively green (flake check), manual keyboard-only + screen-reader spot-check script, production build smoke test on the deployed URL.

## 5. Failure protocol (summary — full loop in `LOOP_ENGINEERING.md`)
1. Read the **first** failure, not the last. Reproduce with the narrowest command.
2. Form a hypothesis; change **one** thing; re-run the narrow command, then the level, then `verify:fast`.
3. Max **3 fix attempts** per distinct failure; on the 3rd failure stop, write a **Failure Report** (symptom, hypotheses tried, evidence, suspected root cause, proposed options) and ask the human.
4. Forbidden fixes: skipping/deleting a test, loosening tolerance without an ADR, `any`/ts-ignore/eslint-disable, mocking away the thing under test, editing golden fixtures to match output.
5. A flaky test is a bug: reproduce 10×, fix the cause (usually unseeded randomness or timing), never retry-until-green.

## 6. Evidence format (`docs/evidence/phase-N/`)
```
verify-phase.log          # real terminal tail of verify:phase
shots/<route>-<w>.png     # screenshots 360/768/1280
walkthrough.md            # browser-agent script + findings + resolutions
lighthouse-summary.md     # scores + budgets
coverage-snapshot.md      # copy of COVERAGE.md at gate time
pedagogy-checklist.md     # concept id → ticked items
signoff.md                # date, human decision, open items
```

## 7. Mutation sanity check (optional but recommended per unit)
Pick 3 engines; deliberately introduce a bug (e.g. swap BFS queue→stack, drop the `+1` in Laplace smoothing). Confirm tests **fail**. Revert. This proves the tests can actually catch errors. Log result in the phase evidence.
