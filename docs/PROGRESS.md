# PROGRESS — AIML Studio

## Now
- **Phase:** 0 (Discovery & Plan)
- **Task:** T0.01 Workspace Audit, Content Mapping, Gap Analysis, ADRs & Master Plan
- **Status:** Phase 0 deliverables produced; waiting for human review & approval
- **Last green commit:** Pending initial git commit upon plan approval

## Phase Checklist
- [ ] **Phase 0 — Discovery & Plan** *(In Progress: Deliverables Complete, Awaiting Approval)*
- [ ] **Phase 1 — Platform Foundation & Vertical Slice (BFS)** *(Ready to start upon approval)*
- [ ] **Phase 2 — Unit 1: Basics of AI (8 hrs)**
- [ ] **Phase 3 — Unit 2: AI Search Strategies (8 hrs)**
- [ ] **Phase 4 — Unit 3: ML Fundamentals (7 hrs)**
- [ ] **Phase 5 — Unit 4: Instances & Probabilistic Models (6 hrs)**
- [ ] **Phase 6 — Unit 5: Linear & Decision Models (8 hrs)**
- [ ] **Phase 7 — Unit 6: Unsupervised Learning (8 hrs)**
- [ ] **Phase 8 — Integration, Exam Prep, Capstone & Chooser**
- [ ] **Phase 9 — Hardening, Accessibility, Verification & $0 Deploy**

## Task Log (latest first)
- **2026-10-30 | T0.01: Discovery, Content Mapping, Gap Analysis, ADRs & Implementation Plan**
  - Completed comprehensive workspace audit of all 100 source files across Units 1–5.
  - Successfully extracted text/metadata into `tools/ingest/out/` for analysis.
  - Authored authoritative `docs/syllabus.json` (6 units, 45 hours, Course Outcomes CO1–CO4).
  - Generated `docs/content-map.json` and `docs/CONTENT_MAP.md` mapping 74 syllabus topics to sources.
  - Authored `docs/GAP_ANALYSIS.md` detailing resolution plans for 26 gap and partial topics (including full Unit 6).
  - Drafted `docs/COVERAGE.md` syllabus coverage matrix skeleton.
  - Established ADR-001 through ADR-006 in `docs/DECISIONS.md`.
  - Created root `.gitignore` protecting copyrighted textbooks and ingestion caches.
  - Formulated two cohesive design system directions (Editorial Studio vs Cyber-Lab).
  - Authored comprehensive Phase-by-Phase implementation plan and Phase 1 vertical-slice plan (BFS).

## Open Decisions / Questions for Human (from Master Plan §14)
1. **Design Direction Selection:** Choose between Direction A ("Modern Editorial Studio" - warm paper/deep slate, typography-first) or Direction B ("Cyber-Lab Dark Mode" - high-tech neon accents, terminal-inspired).
2. **Missing Syllabus PDF in Root:** The file `1793355289410_AIML_TH_2023.pdf` was not in the root directory, but all syllabus specifications are present in `01_MASTER_PROMPT.md` and captured in `docs/syllabus.json`. Confirm that this parsed specification is accepted as the official ground truth.
3. **Reference Textbooks Protection:** Confirm that the two reference textbooks (`RusselAndNorving.pdf` and `RichAndKnight.pdf`) are excluded from build artifacts and git commits via `.gitignore`.
4. **Pyodide Code Lab Strategy:** Confirm agreement with ADR-004 (lazy-loading Pyodide in a Web Worker only on user click, with instant pre-rendered static fallbacks for low bandwidth).
5. **Logic & Rule Engine Strategy:** Confirm agreement with ADR-005 (pure TypeScript rule engine for step-by-step visual proof trees and "Why/How" explanations, rather than an opaque external Prolog runtime).
6. **Unit 6 Authoring Baseline:** Confirm agreement that Unit 6 will be authored from the syllabus and canonical ML literature (Bishop, Hastie/Tibshirani, Scikit-Learn documentation), marked with `source: syllabus-only`.
7. **Vertical Slice Concept for Phase 1:** Confirm Breadth-First Search (BFS) on an Amazon Warehouse Grid Robot as the vertical slice demonstrating Engine → Trace → Player → KaTeX Math → Quiz → Progress.

## Risks & Watch-List
- **Scope Magnitude (6 Units, 74 Topics, 48+ Labs):** Strictly enforced phase gates and modular vertical slices prevent runaway scope.
- **Client-Side Bundle Weight & Pyodide:** Route-based code splitting and on-demand Pyodide workers ensure initial route JS ≤ 200 KB gzip.
- **Solver Parity vs Scikit-Learn:** Golden fixture JSON tests with explicit numeric tolerances for iterative solvers.
- **Mobile Performance:** 2D Canvas rendering for dense points, throttling step speech narration, strictly avoiding heavy 3D runtimes.
- **Copyright & Plagiarism Guard:** Original text, custom SVGs, and automated originality checking via `tools/check-originality.ts`.

## Known Gaps (see `docs/GAP_ANALYSIS.md`)
- All 12 topics of Unit 6 (Unsupervised Learning)
- Unit 1: Self-Driving Vehicle case study, Prompt Engineering sandbox, AGI further reading
- Unit 2: Full GPS navigation map graph, Chess evaluation explainer, Game Theory payoff matrix
- Unit 3: Healthcare cost case study, Elastic Net, K-Fold CV visualizer
- Unit 4: ROC-AUC threshold sweeper, Customer Churn case study, Variational Inference
- Unit 5: Decision tree cost-complexity pruning, AdaBoost reweighting animation, Stacking architecture

