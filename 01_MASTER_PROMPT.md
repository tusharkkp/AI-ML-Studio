# MASTER PROMPT — "AIML Studio": An Interactive Learning Platform for Artificial Intelligence & Machine Learning

> Paste this entire prompt into Antigravity **in Planning mode** as the first message of the project.
> Prerequisite: `AGENT.md` is already in the workspace root. Read it first, then this prompt.

---

## 0. HOW TO START (read this first)

1. You are in **PLAN MODE for Phase 0 only**. Do **not** write application code until I approve the Phase 0 plan.
2. Your first response must be the **Phase 0 deliverables** listed in Section 14, produced as Antigravity Artifacts (implementation plan + task list), then **stop and wait for my approval**.
3. After approval, work **one phase at a time**. Never start the next phase until the current phase's Exit Gate (Section 5) is green and I have said "proceed".
4. Follow the loops in `LOOP_ENGINEERING.md`, the gates in `Automated Verification Loops.md`, and the procedures in `skills.md`. If any of these files are missing from the workspace root, tell me before doing anything else.

---

## 1. MISSION

Build a **web learning platform** where a student who has never seen AI/ML can arrive, follow a guided path, and **leave with genuine, clear understanding** of every topic in the course **Artificial Intelligence and Machine Learning (2304322T), MIT Academy of Engineering, Third Year B.Tech, Rev. 2023 NEP, AY 2025-26**.

The platform's promise: **"Don't just read the algorithm. Watch it think, break it, fix it, and then code it."**

Success looks like a student being able to:

- explain each algorithm in plain language, then with math;
- predict what an algorithm will do on a new input before running it;
- tune parameters and _see_ the consequence (learning rate too high, k too small, depth too large);
- compare algorithms and say when each one fails;
- answer exam / viva questions with confidence (Course Outcomes CO1–CO4).

**Course outcomes the platform must serve**

- CO1 (L3): Apply principles of Perception, Knowledge Representation, Inference, Reasoning and Search.
- CO2 (L3): Use ML statistical algorithms on real-world applications.
- CO3 (L4): Evaluate ML models through systematic hyper-parameter optimization.
- CO4 (L4): Analyze strengths and limitations of different AI and ML approaches.

---

## 2. AUDIENCE & LEARNING PRINCIPLES

**Primary audience:** third-year engineering students (mixed ability, many on phones, many on limited bandwidth, English as a second/third language). **Secondary:** first-years exploring AI, and teachers who want a classroom demo tool.

**Pedagogical principles (non-negotiable — every page must reflect them):**

1. **Intuition → Interaction → Math → Code → Check.** Never open with a formula.
2. **Predict-then-reveal.** Before an animation runs, ask the student to predict the outcome. Learning sticks when prediction fails.
3. **Break it on purpose.** Every algorithm gets a "Make it fail" mode (high learning rate, k=1, overfit tree, bad heuristic, non-admissible h).
4. **One idea per screen.** Short sections, progressive disclosure ("Show me the math" toggle).
5. **Same example, many lenses.** Reuse a running example per unit (e.g. the Amazon-style warehouse robot for search, house prices for regression, play_tennis for trees).
6. **Misconception-first.** Each concept lists 2–4 common misconceptions and directly dispels them.
7. **Immediate feedback.** Micro-quizzes after each concept; explanations for _wrong_ answers, not just right ones.
8. **Plain-language first, jargon defined on hover** via a glossary.
9. **Honest about limits.** Every algorithm page has "Strengths / Limitations / When NOT to use" (serves CO4).

---

## 3. SOURCE OF TRUTH & MATERIALS

The workspace root contains:

- `1793355289410_AIML_TH_2023.pdf` — **the official syllabus**. This is the authority on scope, topic names, unit hours, case studies, self-study and further-reading items.
- `ML.zip` and/or its extracted `ML/` folder — the instructor's unit-wise teaching material.

**Known inventory of `ML/` (verify in Phase 0, do not trust blindly):**

| Folder         | Contents (summary)                                                                                                                                                                                                                                                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Unit 1`       | 4 lecture PDFs (AI intro & applications, rational agents, history/foundations, logic); Prolog files (`eliza.pl`, `FamilyTree.pl`, `Recommendation.pl`, `STUDENT_TEACHER.pl`, `blood.pl`, `trans.pl`, `Firstexample.pl`); `Vaccum_Cleaner.ipynb`; two reference textbooks (Russell & Norvig; Rich & Knight)                                                          |
| `UNIT II`      | PDFs: uninformed, informed, local search, CSP, adversarial, genetic algorithm; notebooks: DFS, A\*, MinMax, AlphaBeta, NQueen, Missionaries & Cannibals (BFS), hill climbing (`AIHC`), GeneticAlgorithm; `MAZE/` solver (`maze.py`, mazes); `BFS DEMO.pptx`                                                                                                         |
| `UNIT III ...` | 7 lecture PDFs (intro to ML, ML task/features, linear regression, cost function, polynomial regression, bias-variance, locally weighted regression); `Linear Regression/` notebooks (simple, multiple, gradient descent, LWR, Ridge/Lasso) + datasets (`kc_house_data.csv`, `Salary_Data.csv`, etc.); `Feature Engineering/` (NumPy, Pandas, FeatureEngg notebooks) |
| `UNIT IV ...`  | KNN notebooks, Naive Bayes notebooks, `glass.csv`, `Social_Network_Ads.csv`; Study Notes PDFs (Bayesian Belief Network, Classification, KNN, Logistic Regression, Naive Bayes, Probability)                                                                                                                                                                         |
| `UNIT V ...`   | Decision Tree notebooks (CART, library & scratch) + `play_tennis.csv`; SVM notebooks (scratch + library) + PDF; Ensemble / Bagging / Random Forest notebooks + PDF                                                                                                                                                                                                  |
| **Unit VI**    | **No folder found in the archive.** Content for Unit 6 must be authored from the syllabus (see gap rules below).                                                                                                                                                                                                                                                    |

**Material handling rules (strict):**

1. **Read-only.** Never modify, move, rename or delete anything in the workspace root that isn't yours. The app lives in `web/`; tooling in `tools/`; docs in `docs/`.
2. **Source material is for _understanding_, not for copying.** Lecture slides and the two textbooks are copyrighted. **Do not reproduce their text, figures or slides.** Write original explanations, draw original diagrams/visuals, create original quiz questions. Short factual definitions and standard formulas are fine. Do not copy the two textbook PDFs into `web/` or any build output; add them to `.gitignore`/deploy exclusions.
3. **Notebooks and datasets** may be used as _reference_ for algorithm behaviour and as seeds for demos. Re-implement algorithms cleanly instead of pasting notebook code. Datasets: check size/licence signals; ship only small sampled subsets (≤ 200 KB each) in the web build; flag any dataset whose origin is unclear.
4. **Syllabus wins conflicts.** If a lecture PDF covers something beyond the syllabus, mark it "Beyond syllabus (optional)". If the syllabus lists something the material lacks, it goes in the **Gap Analysis** and **must still be covered**.
5. **Unit 6 + other gaps:** author from the syllabus and standard knowledge; label provenance in front-matter (`source: syllabus-only`), and list them in `docs/GAP_ANALYSIS.md` for my review. Likely gaps to verify: Unit 5 boosting/stacking/pruning depth, AdaBoost; Unit 4 ROC-AUC & metrics; Unit 3 K-fold CV, Elastic Net; all of Unit 6.

---

## 4. SYLLABUS → PHASE MAP

Syllabus hours total 45. Each unit becomes a **Phase**. Each phase ships a _complete, polished, tested unit_ — the platform is usable after every phase.

| Phase | Unit                                                                    | Hrs | Case studies                                         | Self-study                             | Further reading                    |
| ----- | ----------------------------------------------------------------------- | --- | ---------------------------------------------------- | -------------------------------------- | ---------------------------------- |
| 0     | Discovery, plan, content map                                            | —   | —                                                    | —                                      | —                                  |
| 1     | Platform foundation, design system, Algorithm Player framework          | —   | —                                                    | —                                      | —                                  |
| 2     | **Unit 1 — Basics of AI**                                               | 8   | Medical Diagnosis System, Self-Driving Vehicle       | Chatbot, Prompt Engineering            | Artificial General Intelligence    |
| 3     | **Unit 2 — AI Search Strategies**                                       | 8   | GPS Navigation, Chess                                | Genetic Algorithm                      | Game Theory                        |
| 4     | **Unit 3 — ML Fundamentals**                                            | 7   | Real-Estate Price Prediction, Healthcare Application | Ridge, Lasso, Elastic Net              | K-Fold Cross-Validation case study |
| 5     | **Unit 4 — Instances & Probabilistic Models**                           | 6   | Customer Churn Prediction                            | k-NN (regression & classification)     | Variational Inference              |
| 6     | **Unit 5 — Linear & Decision Models**                                   | 8   | Pima Diabetes Prediction                             | AdaBoost                               | Decision Tree for Regression       |
| 7     | **Unit 6 — Unsupervised Learning**                                      | 8   | Anomaly Detection & Noise Reduction                  | Probability-Distribution-Based Methods | Linear Discriminant Analysis       |
| 8     | Integration: learning paths, exam mode, capstone, cross-unit comparison | —   | —                                                    | —                                      | —                                  |
| 9     | Hardening, accessibility, performance, deploy, handoff                  | —   | —                                                    | —                                      | —                                  |

### Topic scope per unit (from the syllabus — all must be covered)

**Unit 1 — Basics of AI:** foundation & history; applications & types of AI; impact & ethical concerns; intelligent agents (rational agents, PEAS, environment types, agent types); introduction to reasoning & knowledge representation; first-order logic; rule-based reasoning; architecture of expert systems; knowledge acquisition.
**Unit 2 — Search:** state-space search; uninformed (BFS, DFS, depth-limited, iterative deepening, bidirectional); heuristic (greedy best-first, A*, admissibility of A*); hill climbing; CSP, constraint propagation & inference, local search & backtracking in CSP; adversarial search, minimax, alpha-beta pruning; (self-study) genetic algorithm.
**Unit 3 — ML Fundamentals:** supervised / unsupervised / reinforcement overview; simple & multiple linear regression; polynomial regression; MSE, RMSE, MAE, R²; (plus material shows: cost function, gradient descent, bias-variance, locally weighted regression, feature engineering); (self-study) Ridge, Lasso, Elastic Net; (further) K-fold CV.
**Unit 4 — Instances & Probabilistic:** Bayes' theorem; Naive Bayes & independence assumption; logistic regression for classification; accuracy, precision, recall, F1, confusion matrix, ROC-AUC; (self-study) k-NN for regression & classification; (further) variational inference.
**Unit 5 — Linear & Decision Models:** decision trees, Gini impurity, information gain, pruning; SVM: hyperplane, support vectors, kernels; ensembles: significance, bagging, boosting, stacking; performance evaluation of ML models; (self-study) AdaBoost; (further) decision tree for regression.
**Unit 6 — Unsupervised:** association rules, Apriori; clustering: partitional, hierarchical, density-based; dimensionality reduction, feature selection vs extraction, PCA; (self-study) probability-distribution-based methods; (further) LDA.

### Flagship interactive modules (minimum set — Phase 0 plan may add, not remove)

**Unit 1:** AI timeline explorer · Agent–environment simulator (vacuum world; reflex / model-based / goal-based / utility agents compared; PEAS builder) · Task-environment classifier game · Logic playground (truth tables, FOL quantifiers over a small world, unification & resolution steps) · Forward vs backward chaining visualizer · **Mini expert system builder** (Medical Diagnosis case study, with "why/how" explanation facility) · Ethics scenario cards (self-driving dilemmas, bias demo) · ELIZA-style chatbot demo (pattern matching) + prompt-engineering sandbox (static, no live LLM calls).
**Unit 2:** State-space graph builder · BFS/DFS/DLS/IDDFS/Bidirectional **race view** (nodes expanded, frontier size, path cost, completeness/optimality badges) on grid maze, graph, 8-puzzle, Missionaries & Cannibals · Greedy vs A\* with heuristic picker; **admissibility/consistency checker** · GPS navigation on a map graph · Hill-climbing landscape (local maxima, plateau, ridge; random restart) · CSP: N-Queens, map colouring, Sudoku-lite with AC-3, forward checking, MRV/LCV · Minimax tree builder with alpha-beta pruning counter · Play-vs-AI (tic-tac-toe) and a chess-evaluation explainer for the Chess case study · Genetic algorithm lab (selection, crossover, mutation sliders) · Prisoner's-dilemma payoff matrix (Game Theory reading).
**Unit 3:** Paradigm sorter (supervised / unsupervised / RL) + tiny RL grid-world · **Drag-the-points regression** with live residuals & MSE · Cost-surface contour + **gradient descent animation** (learning-rate slider incl. divergence) · Multiple regression on house-price sample · Polynomial degree slider → under/overfit · Bias–variance explorer · Locally weighted regression (bandwidth slider) · Metric calculator (MSE/RMSE/MAE/R²) · Regularisation path (Ridge/Lasso/Elastic Net coefficient shrinkage) · K-fold CV visualiser · Feature-engineering lab (scaling, encoding, imputation).
**Unit 4:** Bayes natural-frequency visual (medical test paradox) · Naive Bayes calculator step-by-step (+ Laplace smoothing) · Sigmoid & logistic regression decision-boundary lab with threshold slider · **Confusion matrix → precision/recall/F1 → ROC curve & AUC** linked interactively · k-NN: k slider, distance metric, decision regions, scaling effect, curse of dimensionality · Churn-prediction mini pipeline · (optional) small Bayesian-network explorer.
**Unit 5:** Decision-tree split builder (entropy, Gini, information gain computed live on play_tennis) · Tree growth animation + pruning controls (max depth, min samples, cost-complexity) · SVM margin/support-vector lab, C slider, **kernel trick 2D→3D lift** · Bagging (bootstrap) → Random Forest → AdaBoost (reweighting animation) → Stacking diagram · Pima-diabetes pipeline · Model comparison dashboard.
**Unit 6:** Apriori step-by-step on a basket (support/confidence/lift) · k-means animation + elbow + silhouette · Hierarchical clustering dendrogram builder (linkage choice) · DBSCAN eps/minPts with noise points · Anomaly-detection lab (z-score, DBSCAN, PCA reconstruction error) · **PCA**: rotate axes, variance explained, projection, noise-reduction demo · Feature selection vs extraction explainer · GMM/EM visual (self-study).

---

## 5. PHASES, DELIVERABLES & EXIT GATES

Each phase: Plan → Build → Verify → Review → Handoff (see `LOOP_ENGINEERING.md`). A phase is **done only when its Exit Gate is green and evidence is saved in `docs/evidence/phase-N/`.**

### Phase 0 — Discovery & Plan _(plan mode, no app code)_

Deliverables: content inventory (`docs/content-map.json` + `docs/CONTENT_MAP.md`), syllabus coverage matrix, `docs/GAP_ANALYSIS.md`, architecture & ADRs, design direction, phase-by-phase implementation plan, risk register, task list.
Exit gate: I approve.

### Phase 1 — Foundation

Deliver: Vite + React + TypeScript app scaffold in `web/`; design system (tokens, typography, light/dark, components); routing; MDX content pipeline with front-matter schema + KaTeX; **Algorithm Player framework** (Section 7.3); progress store (localStorage) + export/import; glossary system; quiz component; layout shell (unit navigation, breadcrumbs, search); CI scripts (`verify:*`); one **vertical-slice demo concept** (e.g. BFS) proving the entire pipeline end to end.
Exit gate: `npm run verify:phase` green; slice demo passes all five verification levels; I review the slice on desktop + phone viewport.

### Phases 2–7 — One per Unit (identical shape)

Per unit deliver:

1. **Unit landing page:** why it matters, learning outcomes (mapped to CO1–CO4), concept map, estimated time, prerequisites, case studies.
2. **Concept pages** for every syllabus topic using the Concept Page Template (Section 8).
3. **Flagship interactive modules** listed in Section 4, plus any others the plan adds.
4. **Case-study page(s)** — end-to-end story with data → model → evaluation → limitations.
5. **Self-study & further-reading pages** — clearly badged; lighter depth but complete.
6. **Quiz bank:** ≥ 4 questions per concept (mix of MCQ, predict-the-output, numeric), unit test of ≥ 20 questions, viva question list.
7. **Unit cheat-sheet** (printable one-pager via print stylesheet).
8. **Hands-on code labs** (editable Python via in-browser runtime — Section 7.5) mirroring the instructor's notebooks, with original code.
9. Updated syllabus-coverage matrix and `docs/PROGRESS.md`.
   Exit gate: unit verification suite green + pedagogy review checklist (Section 8) complete + I sign off.

### Phase 8 — Integration

Guided learning paths ("Zero to exam-ready in N days", "Search only", "ML only"); cross-unit **algorithm comparison tables** ("Which algorithm should I use?" decision helper); exam-prep mode (syllabus-keyed question practice, timed unit tests, weak-topic recap); capstone mini-projects; global search; spaced-repetition flashcards from glossary; "Make it fail" gallery.

### Phase 9 — Hardening & Release

Accessibility audit, performance budgets, offline/PWA (optional), SEO/meta, error boundaries, 404/empty states, content proof-read, deploy to free static hosting, README + CONTRIBUTING + content authoring guide, final handoff doc.

---

## 6. PRODUCT SPECIFICATION

**Information architecture**

```
/                         Landing: promise, start-here, syllabus map, progress resume
/learn                    Path overview: Unit 1 → Unit 6 as a visual journey
/learn/unit-N             Unit landing
/learn/unit-N/<concept>   Concept page (template in §8)
/lab                      All interactive labs index (filter by unit/type)
/lab/<lab-id>             Full-screen lab (shareable via URL state)
/case-studies/<id>        End-to-end case studies
/practice                 Quizzes, unit tests, viva Qs (Phase 8 adds exam mode)
/glossary                 Searchable glossary
/cheatsheets              Printable per-unit sheets
/compare                  Algorithm comparison & chooser (Phase 8)
/about  /syllabus         Syllabus mapping, COs, credits, how to use
```

**Core features:** persistent progress per concept (read / lab tried / quiz passed); resume where you left; lab state encoded in URL (shareable); keyboard-friendly; light/dark; reduced-motion; responsive 360 px → desktop; global search (client-side index); glossary hover cards; "Show the math" toggle; "Make it fail" button on every lab; "Explain like I'm new" / "Go deeper" level switch where it earns its place; print stylesheet for cheat sheets; in-page feedback link ("Report an error / unclear") that opens a prefilled mailto or GitHub issue URL (no backend).
**No accounts, no backend, no tracking in v1.** Privacy-first: no third-party analytics. All data stays in the browser.

---

## 7. TECHNICAL ARCHITECTURE

### 7.1 Default stack (Phase 0 may propose changes via an ADR with trade-offs)

- **Vite + React 18 + TypeScript (strict)**, React Router, **Tailwind CSS**, MDX (`@mdx-js/rollup`) with remark-math + **KaTeX**, Zustand (state), Framer Motion (UI motion only).

- You can use the installed Ui skill.
- Visuals: **SVG + Canvas** with D3 utility modules (scales, shapes, force where useful) — React owns the DOM, D3 only computes. 3-D (kernel lift, cost surface) via a light library only if justified (bundle budget).
- Tests: **Vitest**, Testing Library, **fast-check** (property tests), **Playwright** (e2e + screenshots), **axe-core**, Lighthouse CI, ESLint, Prettier, `tsc --noEmit`.
- Hosting target: static (GitHub Pages / Netlify / Cloudflare Pages) — **$0**.

### 7.2 Repository layout

```
/ (workspace root)           <- materials stay untouched here
  AGENT.md  skills.md  LOOP_ENGINEERING.md  Automated Verification Loops.md  RECOMMENDED_WORKFLOW.md
  docs/        PROGRESS.md  DECISIONS.md (ADRs)  GAP_ANALYSIS.md  CONTENT_MAP.md  content-map.json  evidence/phase-N/
  tools/       ingest/ (extract text from sources for analysis, NOT shipped)  fixtures/ (Python → golden JSON)  check-*.ts (content & originality checks)
  web/
    src/
      app/ (routes, layout)   components/ (design system)   features/ (progress, search, glossary, quiz)
      engines/<domain>/<algo>/   engine.ts  types.ts  engine.test.ts  fixtures/
      viz/ (player, canvas/svg primitives, charts)
      labs/<lab-id>/             Lab.tsx  config.ts
      content/unit-N/<concept>.mdx
      data/ (small datasets)
    e2e/   public/
```

### 7.3 THE core pattern: Engine → Trace → Player

Every algorithm is a **pure, framework-free TypeScript engine** that produces a **trace** of immutable step snapshots. Visualisers are _players_ over traces. This makes algorithms testable, replayable, steppable backwards, and reusable across pages.

```ts
export interface Step<S = unknown> {
  index: number;
  description: string; // plain-language "what just happened"
  highlights: string[]; // ids of nodes/cells/points to emphasise
  state: S; // serialisable snapshot (no functions, no mutation after yield)
  metrics?: Record<string, number>; // nodesExpanded, frontierSize, cost, loss...
}
export interface Engine<In, S> {
  id: string;
  run(
    input: In,
    opts?: { maxSteps?: number; seed?: number },
  ): Generator<Step<S>, Result, void>;
}
```

Player controls (shared): play / pause / step forward / **step back** / scrub / speed / reset / "jump to end" / seeded randomness / show-explanation panel / pseudo-code panel with current line highlighted / metrics strip. **Every random element is seeded** (reproducible labs, deterministic tests).

### 7.4 ML engines

Implement teaching-grade algorithms **from scratch in TypeScript** (linear/logistic regression with GD, k-NN, Naive Bayes, decision tree, k-means, DBSCAN, hierarchical, PCA, Apriori, SVM via a simple SMO or sub-gradient solver, AdaBoost, bagging). Cross-validate against **scikit-learn golden fixtures** generated offline by scripts in `tools/fixtures/` (Python), stored as JSON; tests compare within tolerance. Where exact match is impossible (e.g. SVM solver differences) assert on invariants and accuracy ranges instead and document why.

### 7.5 Hands-on code labs

Provide an **in-browser Python runtime (Pyodide, lazy-loaded only when the student clicks "Run code")** with NumPy / pandas / scikit-learn / matplotlib as feasible. Show an honest loading indicator and size warning; never block the page. Fallback: static, pre-rendered output with the code. For Prolog topics (Unit 1) evaluate an in-browser Prolog (e.g. tau-prolog) vs. rule-engine-in-TS in an ADR. **No API keys, no server execution.**

### 7.6 Performance & accessibility budgets

- Initial route JS ≤ 200 KB gzip; per-unit and per-lab code-split; Pyodide never in initial bundle.
- Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90.
- Labs maintain ≥ 45 fps on a mid-range phone for default inputs; cap input sizes sensibly.
- WCAG 2.2 AA: keyboard operable, focus visible, colour never the only signal, ARIA for custom widgets, **text alternatives that narrate algorithm steps** (screen-reader log of the "description" strings), `prefers-reduced-motion` respected.

---

## 8. CONTENT STANDARDS — THE CONCEPT PAGE TEMPLATE

Every concept page (MDX with validated front-matter) contains, in this order:

1. **Header:** title · unit · estimated minutes · syllabus topic id · CO tags (CO1–CO4) · prerequisites (linked) · source flag (`material` | `syllabus-only` | `self-study` | `further-reading`).
2. **The hook (≤ 80 words):** a real-world question or story.
3. **Intuition:** plain language, analogy, one diagram.
4. **Try it:** embedded lab with a **predict-then-reveal** prompt.
5. **Step-through:** the algorithm on a _small hand-checkable_ example (numbers a student can verify on paper).
6. **The math (collapsible):** definitions, formula cards, derivation only where it builds understanding. KaTeX.
7. **Pseudo-code** (+ complexity: time / space).
8. **Code lab:** original, minimal Python (and the TS engine link for curious students).
9. **Make it fail:** deliberate failure demo and what it teaches.
10. **Strengths · Limitations · When NOT to use** (CO4).
11. **Common misconceptions** (2–4).
12. **Check yourself:** ≥ 4 quiz items with explained distractors.
13. **Exam & viva corner:** typical questions + model answer outlines.
14. **Summary card** (5 bullets) + "Next up" link.

**Pedagogy review checklist (per concept, tick before Exit Gate):** intuition before math · at least one prediction prompt · small verifiable example · failure mode shown · no unexplained jargon · quiz covers each misconception · original wording/visuals (originality check passed) · reading level ≈ grade 10–12 for explanations · every claim checkable against syllabus or standard texts.

**Voice:** friendly, direct, second person, short sentences. No condescension, no hype, no filler. Indian-context examples welcome (UPI fraud detection, Pune/Mumbai house prices, cricket, monsoon, railways) where they clarify.

---

## 9. DESIGN DIRECTION

Distinctive, modern, calm — a "study studio," not a generic template. Each **Unit gets an accent colour and a visual motif** (e.g. Unit 2 = maps/graphs, Unit 3 = scatter & curves, Unit 6 = clusters) while sharing one coherent design system. Strong typographic hierarchy, generous whitespace, a legible monospace for code, high-contrast dark mode, subtle purposeful motion only. Visuals use a **colour-blind-safe palette** with shape/pattern redundancy. Read `frontend-design` guidance in `skills.md` §8 and propose 2 design directions in Phase 0 for my choice (moodboard described in text + token proposal).

---

## 10. CONSTRAINTS

- **Cost: $0** — static hosting, no paid services, no required API keys.
- **No backend, no user accounts, no tracking** in v1.
- **Low-bandwidth friendly** (students in India on mobile data): lazy-load, compress, no autoplay video, no huge assets.
- **Copyright:** original text/visuals/questions only (Section 3).
- **Language:** English now; structure content so a Hindi/Marathi translation is possible later (strings in content files, no text baked into images).
- **Scope discipline:** do not add features outside this prompt without proposing them in the plan and getting approval.

---

## 11. WORKING AGREEMENT WITH ANTIGRAVITY

- Use **Artifacts** for: Phase plan, task list, per-phase walkthrough, and verification report (with screenshots / recordings from the browser agent as evidence).
- **Plan first, then build.** For every phase begin with an implementation-plan artifact; build only after approval.
- Keep `docs/PROGRESS.md` updated at every task boundary (this is your memory across sessions — see `LOOP_ENGINEERING.md` §7).
- Record every significant decision as an ADR in `docs/DECISIONS.md`.
- Small, reviewable commits with conventional messages; one task ≈ one commit.
- When uncertain about a _requirement_, ask me. When uncertain about a _technical detail_, decide, record an ADR, and move on.
- Be honest: if a gate fails and you cannot fix it within the retry budget, **stop and report**; never weaken a test, skip a gate or fake evidence.

---

## 12. ADDITIONAL INSTRUCTIONS (things you might not think of)

1. **Accuracy over polish.** A beautiful wrong visualisation is worse than none. Every engine has tests; every formula is checked against a golden fixture or a hand-worked example.
2. **Hand-worked examples are tested.** If the page says "after step 3 the frontier is {C, D}", a test asserts it — so content and engine cannot drift apart.
3. **Content–engine linking:** MDX references engines/labs by id; a build-time check fails if an id doesn't exist.
4. **Syllabus-coverage matrix** (`docs/COVERAGE.md`, auto-generated by `tools/check-coverage.ts`): every syllabus bullet → page(s) → lab(s) → quiz count. Build fails if any bullet is uncovered.
5. **Originality check:** `tools/check-originality.ts` compares page text against extracted source text and fails on long n-gram overlaps.
6. **Learner safety nets:** "I'm lost" button on every concept → shows prerequisites and a simpler explanation; glossary hover everywhere.
7. **Time estimates are honest** (measured from word count + interaction count, not guessed).
8. **Seeded presets:** every lab ships 3–5 named presets ("Easy", "Tricky", "Breaks the algorithm").
9. **Static, deterministic builds;** no network calls at runtime other than lazy-loading our own chunks and Pyodide.
10. **Error-proof labs:** invalid inputs are impossible by construction (clamped sliders, validated text) and every lab has an empty/loading/error state.
11. **Content versioning:** syllabus revision (Rev 2023 NEP, AY 2025-26) recorded in site config so future revisions can be diffed.
12. **Teacher mode (stretch, Phase 8):** projector-friendly full-screen lab with larger fonts, hide-solution toggle.
13. **Ethics & honesty page:** AI limits, bias, responsible use — ties to Unit 1 "Impact and ethical concerns" and is surfaced again in case studies.
14. **No dark patterns.** No streak-guilt, no nagging. Progress is encouraging, optional, local.

---

## 13. RISKS TO ADDRESS IN THE PLAN

Scope size (6 units × many labs) → vertical slices + strict phase gates · Pyodide weight → lazy load + fallbacks · SVM/solver parity with sklearn → invariant-based tests · Unit 6 has no source material → author from syllabus + review · copyright on slides/textbooks → original content + originality check · mobile performance for animations → Canvas, frame budgets, capped sizes · content-engine drift → hand-worked-example tests · reviewer fatigue → per-phase review checklist and evidence artifacts.

---

## 14. YOUR FIRST TASK — PHASE 0 (PLAN MODE, NO APPLICATION CODE)

Produce and then **STOP for approval**:

1. **Workspace audit:** list what you actually found (confirm/correct Section 3's inventory; extract text of PDFs/notebooks into `tools/ingest/out/` for analysis only; do not ship it).
2. **`docs/content-map.json` + `docs/CONTENT_MAP.md`:** for each syllabus topic → source files in `ML/` → status (`covered` / `partial` / `gap`).
3. **`docs/GAP_ANALYSIS.md`:** every gap, with proposed authoring approach.
4. **Syllabus coverage matrix** skeleton (`docs/COVERAGE.md`).
5. **Architecture proposal + ADRs** (stack confirmation, state, visualisation approach, Pyodide vs alternatives, Prolog approach, hosting) with trade-offs.
6. **Two design directions** to choose from.
7. **Phase-by-phase implementation plan** with task breakdown, per-task acceptance criteria, estimated effort, risks, and the exact verification commands per phase.
8. **Phase 1 detailed plan** including the vertical-slice concept (recommend one; default BFS).
9. **Questions for me** (max 8, prioritised).
10. A short **"how I will keep quality high"** summary referencing the loops and gates.

Then wait. I will reply with approval or changes.
