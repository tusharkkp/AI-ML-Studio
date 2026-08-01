# skills.md — Reusable Skills for AIML Studio

Each skill = **When** to use it · **Inputs** · **Procedure** · **Outputs** · **Checks**. Follow the procedure; do not improvise around it. (Antigravity can also load these as individual skill folders under `.agent/skills/<name>/SKILL.md` — verify the folder convention in your installed version; the content below is the source of truth either way.)

---

## S1. Source Ingestion & Content Mapping
**When:** Phase 0; whenever new material is added to the workspace.
**Inputs:** syllabus PDF, `ML/` folder.
**Procedure:**
1. Inventory every file (path, type, size, unit). Skip nothing; note duplicates (e.g. `blood.pl` vs `blood(1).pl`).
2. Extract text to `tools/ingest/out/` (PDF → text with `pdftotext`/`pypdf`; notebooks → markdown cells + code cells separated; `.pl` as text; PPTX → slide text). **Analysis only — git-ignored, never shipped.**
3. Parse the syllabus into `docs/syllabus.json`: unit → topics → {id, name, kind: `core|self-study|further-reading|case-study`, hours}.
4. Map each topic → source files; classify `covered | partial | gap`; note which notebook/dataset can seed a demo.
5. Detect beyond-syllabus items; label "Beyond syllabus (optional)".
6. Write `docs/CONTENT_MAP.md`, `docs/content-map.json`, `docs/GAP_ANALYSIS.md`.
**Outputs:** the three docs + `docs/syllabus.json`.
**Checks:** every syllabus topic id appears exactly once in the map; every `ML/` file is accounted for.

---

## S2. Concept Page Authoring
**When:** writing any MDX concept page.
**Inputs:** syllabus topic id, source notes (for understanding only), engine/lab ids.
**Procedure:** follow Master Prompt §8 template in order. Start from the **hand-worked example** (numbers first), then intuition, then lab, then math. Write misconceptions *before* quiz items so each misconception has a matching item. Add glossary entries for new terms. Estimate minutes from word count (~200 wpm) + 1 min per interaction.
**Outputs:** `content/unit-N/<id>.mdx`, glossary additions, quiz items.
**Checks:** `check:content`, `check:originality`, pedagogy checklist (LOOP_ENGINEERING §4).
**Style rules:** second person, short sentences, ≤ 20 words average; define a term the first time; never open with a formula; at most one analogy per concept; Indian-context examples where they help.

---

## S3. Algorithm Engine (Engine → Trace)
**When:** implementing any algorithm.
**Procedure:**
1. Create `engines/<domain>/<algo>/{types.ts, engine.ts, engine.test.ts, README.md, fixtures/}`.
2. Define `In`, `S` (step state — plain serialisable data), metrics.
3. Test-first: hand-worked example → invariants (see Verification Loops §3 L1) → edge cases → determinism.
4. Implement as `function* run(input, opts)` yielding `Step`s with a human-readable `description`; accept `seed` and `maxSteps`; never mutate yielded state (copy-on-write or `structuredClone` of small state; use persistent structures for large).
5. Add an oracle cross-check test (library fixture or brute force).
6. Provide `pseudocode: string[]` with line ids; each `Step` carries `line` to highlight.
**Pitfalls:** hidden global state; floating-point equality (use tolerances); step explosion (cap + summarise); unseeded randomness; React imports in engines.
**Checks:** coverage ≥ 90 %, property tests with ≥ 200 seeds, determinism test.

**Engine catalogue (target ids):**
`agent/vacuum`, `logic/truth-table`, `logic/unify-resolve`, `rules/forward-chain`, `rules/backward-chain`, `expert/diagnosis`, `search/{bfs,dfs,dls,iddfs,bidir,ucs,greedy,astar}`, `search/hill-climb`, `search/genetic`, `csp/{backtrack,ac3,forward-check}`, `game/{minimax,alphabeta}`, `reg/{linear-gd,normal-eq,poly,lwr,ridge,lasso,elastic}`, `eval/{regression-metrics,classification-metrics,roc,kfold}`, `prob/{bayes,naive-bayes}`, `cls/{logistic,knn,tree,svm}`, `ens/{bagging,rf,adaboost,stacking}`, `assoc/apriori`, `cluster/{kmeans,hier,dbscan}`, `dimred/pca`, `anomaly/{zscore,pca-recon}`, `rl/qlearning-grid`.

---

## S4. Visualizer Component
**When:** building the view for a trace.
**Procedure:**
1. Pick renderer: **SVG** for ≤ ~500 elements and need for accessibility/hover; **Canvas** for dense plots (scatter ≥ 1k points, heatmaps, decision regions). Never animate the DOM at scale.
2. Component is a pure function of `(step, config)`. No algorithm logic; no timers inside (the Player owns time).
3. Support: highlight ids from `Step.highlights`, legend with shape+colour, tooltips on focus & hover, responsive via `viewBox`/ResizeObserver, high-DPI canvas.
4. Provide a text alternative: narrate `Step.description` into an `aria-live="polite"` region, throttled; offer a "Step log" tab.
5. Colour-blind-safe palette tokens only; categorical series get shape or pattern too.
6. Respect `prefers-reduced-motion` (jump between steps, no easing).
**Checks:** L2 + L3 at 360/768/1280, axe 0 violations, fps budget.

---

## S5. Interactive Lab Design
**When:** designing a lab (see LOOP_ENGINEERING §5).
**Template:** Goal sentence → Controls (≤ 5) → Presets (Easy · Tricky · **Breaks the algorithm**) → Metrics strip → Prediction prompt → Reveal → "What did you learn?" recap → "Make it fail" → Link to quiz.
**Rules:** state in URL hash/query (shareable); every control has a label, unit and helpful default; clamp ranges; show *why* a result happened (annotation), not just *what*; max one new concept per lab.
**Compare view:** where an algorithm family exists (BFS/DFS/IDDFS; k-means/DBSCAN; bagging/boosting), provide a side-by-side race with the same input and shared metrics.

---

## S6. Quiz & Assessment Authoring
**Procedure:**
1. Derive items from the concept's misconceptions and learning outcomes (Bloom: remember → apply → analyse; CO3/CO4 items are analyse-level).
2. Types: MCQ, multi-select, numeric (with tolerance), predict-the-next-step (uses the engine to generate the answer so it's never wrong), ordering, match-the-pairs.
3. Distractors must be *plausible errors* (the misconceptions), each with a one-line "why this is wrong".
4. Generated/numeric items compute answers from engines at runtime with a seed — answers can't drift from content.
5. Unit test: ≥ 20 items, blueprint covering every topic; viva list with model-answer outlines.
**Checks:** `check:content` (every option explained), unique ids, no answer leakage in hints.

---

## S7. Math & Notation (KaTeX)
**Rules:** introduce each symbol once in a "Notation" box; keep the same symbols across pages (θ for parameters, α learning rate, J cost, m samples, n features, ŷ prediction…); show a numeric substitution right after each formula; derive only when it builds understanding, else state and explain; formulas as **formula cards** (name, equation, meaning in words, when used, units/ranges).
**Checks:** KaTeX renders without error; formulas that appear in text are asserted by engine tests when numeric.

---

## S8. UI / Design System (frontend-design)
**When:** Phase 1 and any new component.
**Procedure:** propose 2 directions in Phase 0 (type pairing, palette, motif, density); implement tokens (colour roles, spacing, radius, elevation, motion) as CSS variables; light + dark from the start; unit accent colours; build components: Button, Card, Callout (Tip/Warning/Misconception), Tabs, Toggle ("Show the math"), Slider (labelled, keyboard), Stepper, Player, Quiz, FormulaCard, GlossaryTerm, ProgressRing, UnitMap.
**Rules:** avoid generic template look; purposeful motion only; touch targets ≥ 44 px; focus ring always visible; text ≥ 16 px body; contrast ≥ 4.5:1 (3:1 large).

---

## S9. In-Browser Python Lab (Pyodide)
**When:** hands-on code labs.
**Procedure:** lazy-load runtime behind an explicit "Run code" action in a Web Worker; show size warning + progress; preload only needed packages (NumPy, pandas, scikit-learn, matplotlib as feasible — check wheel availability and size in an ADR); timeouts (e.g. 15 s) and a Stop button; capture stdout/plots; provide "Reset code" and the original-solution reveal; **fallback:** pre-rendered output when runtime fails.
**Rules:** original code only (not copied from instructor notebooks); small data; deterministic seeds; no network from user code.
**Checks:** e2e: run → output; failure path; initial bundle excludes Pyodide.

---

## S10. Prolog / Rule Reasoning (Unit 1)
**When:** FOL, rule-based reasoning, expert system demos.
**Procedure:** ADR comparing (a) in-browser Prolog interpreter, (b) custom TS rule engine with forward/backward chaining traces. Prefer (b) for visual step-through; optionally offer (a) for "write your own facts/rules" sandboxes. Use the instructor's `.pl` files (family tree, ELIZA, recommendation, student-teacher) as *scenarios to re-create originally*.
**Checks:** rule-engine traces tested with hand-worked proofs; explanation facility ("why/how") asserted.

---

## S11. Golden Fixtures from Python
**When:** validating ML engines.
**Procedure:** in `tools/fixtures/` create a venv (`requirements.txt` pinned), one script per algorithm; fixed seeds; write JSON `{meta:{sklearn_version,seed}, input, expected}`; commit JSON (small). TS tests load and compare with documented tolerances. Regenerate only deliberately (never to "make tests pass").
**Checks:** fixture metadata present; tolerance justified in comment.

---

## S12. Originality & IP Guard
**When:** every content commit.
**Procedure:** run `check:originality`; for any flag, **rewrite from understanding** (close the source, explain from memory, then re-check) — never swap synonyms. Create own diagrams; cite concept sources in an "Further reading" list by title only (no text copied). Quiz items written fresh.
**Never ship:** textbook PDFs, lecture slide images/text, notebook code verbatim, datasets over size limit or with unclear origin.

---

## S13. Performance Tuning
**Procedure:** measure first (Lighthouse, Playwright trace, bundle analyser); code-split by route and lab; lazy-load KaTeX/D3 modules per need; Canvas for dense plots; move heavy compute to Web Workers (k-means on large n, SVM training, PCA); throttle step-description announcements; memoise derived data; compress/shrink datasets; font subsetting + `font-display: swap`; avoid layout thrash.
**Budgets:** initial JS ≤ 200 KB gz; lab chunk ≤ 150 KB gz; ≥ 45 fps at 4× CPU throttle.

---

## S14. Accessibility Pass
**Checklist:** landmarks & headings in order · skip link · keyboard path for every control (Space/Enter/Arrows; Player shortcuts documented) · visible focus · labels/ARIA for sliders and canvases (`role="img"` + text description + step log) · colour + shape redundancy · reduced-motion · zoom 200 % no loss · screen-reader narrated steps · error messages associated with inputs · quiz feedback announced.
**Checks:** axe in Playwright on all route types, manual keyboard-only script.

---

## S15. Debugging Protocol
Use LOOP_ENGINEERING §6 exactly. Tools: minimal repro in a scratch test; log the **trace** (not the UI) to isolate engine vs view bugs; compare to oracle; bisect by commit (`git bisect`) when a regression appears; add a regression test before the fix.

---

## S16. Progress, State & Handoff
**Procedure:** update `docs/PROGRESS.md` per LOOP_ENGINEERING §7 at each task boundary; ADRs for decisions; evidence folder per phase; at session end produce a ≤ 10-line handoff block (state, next 3 tasks, blockers).
**Checks:** a fresh session can resume from `PROGRESS.md` alone.

---

## S17. Phase Gate Review
**Procedure:** run `verify:phase`; save evidence (Verification Loops §6); run browser-agent student walkthrough; complete pedagogy checklists; regenerate coverage; write the demo artifact with the Review Loop answers (LOOP_ENGINEERING §9); request sign-off.

---

## S18. Deployment & Release
**Procedure:** static build; choose host (GitHub Pages / Netlify / Cloudflare Pages) via ADR; configure SPA fallback (404 → index) or use hash routing; set cache headers for hashed assets; add `robots.txt`, sitemap, OpenGraph tags; smoke-test deployed URL with Playwright; write README (run, build, test, add a concept, add an engine, add a lab), CONTRIBUTING, and a content authoring guide.

---

## S19. Domain Cheat-Sheet: What each unit's flagship must make *obvious*
- **U1 Agents/Logic/Expert systems:** the same environment, different agent types → different performance; FOL quantifier scope; why/how explanation from a rule trace.
- **U2 Search:** BFS optimal-but-memory-hungry, DFS cheap-but-not-optimal, IDDFS gets both; A* optimal *iff* h admissible (consistent for graph search); hill-climbing stuck on local maxima; alpha-beta gives the same answer with fewer nodes; CSP pruning power of AC-3/MRV.
- **U3 Regression:** loss surface + learning-rate behaviour; under/overfit via degree; bias–variance trade; regularisation shrinks weights (Lasso zeros them); metrics describe different things (RMSE penalises outliers more than MAE).
- **U4 Probabilistic/Classification:** base-rate neglect; independence assumption's power and risk; threshold moves you along the ROC curve; accuracy lies on imbalanced data; k-NN needs scaling.
- **U5 Trees/SVM/Ensembles:** purity measures choose splits; deep trees memorise; margin & support vectors; kernels lift data; bagging cuts variance, boosting cuts bias.
- **U6 Unsupervised:** support/confidence/lift meaning; k-means fails on non-spherical clusters, DBSCAN doesn't; dendrogram cut = choosing k; PCA = rotate to variance, drop weak axes.
