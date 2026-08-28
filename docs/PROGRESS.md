# PROGRESS: AIML Studio

## Now

- **Phase:** 3 (Unit 2: AI Search Strategies)
- **Task:** Phase 3 Batch 1 Complete (T3.01, T3.02, T3.03 verified). Next: Batch 2 (T3.04 Heuristic Search, T3.05 Local Search, T3.06 Case Study 1: GPS Navigation).
- **Status:** Batch 1 verified green across L0-L5 (76 tests, 59.83 KB gzip initial route JS). Ready for Batch 2.
- **Last green commit:** `9fe0279` `feat(ui): enhance frontend with ChaiUI design system and styling`

## Phase Checklist

- [x] **Phase 0: Discovery & Plan** _(Approved by Human)_
- [x] **Phase 1: Platform Foundation & Vertical Slice (BFS)** _(Signed Off by Human)_
- [x] **Phase 2: Unit 1: Basics of AI (8 hrs)** _(Signed Off by Human)_
- [ ] **Phase 3: Unit 2: AI Search Strategies (8 hrs)** _(In Progress: Batch 1 Complete)_
- [ ] **Phase 4: Unit 3: ML Fundamentals (7 hrs)**
- [ ] **Phase 5: Unit 4: Instances & Probabilistic Models (6 hrs)**
- [ ] **Phase 6: Unit 5: Linear & Decision Models (8 hrs)**
- [ ] **Phase 7: Unit 6: Unsupervised Learning (8 hrs)**
- [ ] **Phase 8: Integration, Exam Prep, Capstone & Chooser**
- [ ] **Phase 9: Hardening, Accessibility, Verification & $0 Deploy**

## Task Log (latest first)

- **2026-10-30 | Phase 3 Batch 1 Implemented & Verified**
  - **T3.01 Unit 2 Master Directory:** Created Unit 2 curriculum landing page (`/learn/unit-2`) with 14 syllabus topics, time allocations, and progress indicators.
  - **T3.02 State-Space Search & Problem Formulation:** Built pure state-transition simulator for Missionaries & Cannibals (`web/src/labs/state-space/StateSpaceLab.tsx`) with 16 legal state validations, step-by-step optimal 11-step solution player, and 14-section pedagogical concept page (`/learn/unit-2/state-space-search`).
  - **T3.03 Uninformed Search Engine & Race Lab:** Implemented pure TypeScript DFS, DLS, IDDFS, and Bidirectional Search engines (`web/src/engines/search/uninformed/`) with 9 unit tests. Built interactive graph search visualizer (`web/src/labs/uninformed-search/UninformedSearchLab.tsx`) and 14-section concept page (`/learn/unit-2/uninformed-search`).
  - **Route Code-Splitting:** Implemented `React.lazy` and `<Suspense>` in `web/src/app/App.tsx`, slashing initial route JS payload from 200.07 KB down to 59.83 KB gzip (budget: <= 200 KB).
  - All L0–L5 checks green: 76 unit tests passing across 14 test suites, zero TypeScript errors, zero ESLint warnings, 100% Prettier compliant.

- **2026-10-30 | ChaiUI Design System Frontend Enhancement Complete & Verified**
  - Restyled entire frontend to ChaiUI design system (`oklch(0.145 0 0)` dark background, Google Fonts Manrope + Montserrat + Onest, no drop shadows, 1 highlight phrase per paragraph, asymmetric solid buttons, warm hairline cards).
  - Authored authentic 2842x1132 SVG backdrop with hexagon glow and radial mask.
  - Replaced all em dashes with colons, commas, or parentheses.
  - All L0-L5 verification checks green (67 tests, 183.97 KB gzip JS). Commit: `9fe0279`.
- **2026-10-30 | Phase 2 Signed Off by Human**
  - Unit 1 completed with all 14 topics, 8 pure engines, interactive labs, 20-Q exam, and cheat sheet. Commit: `7eb85bf`.

- **2026-10-30 | Phase 2 Batch 4 Implemented & Exit Gate Verified (Phase 2 Complete)**
  - Implemented Joseph Weizenbaum 1966 ELIZA pattern-matching engine (`web/src/engines/chatbot/eliza/`) with regex decomposition, transformation rules, memory buffers, and pronoun reversal.
  - Built interactive Chatbot & Prompt Engineering Sandbox (`web/src/labs/chatbot-prompt/ChatbotPromptLab.tsx`) featuring real-time ELIZA chat and side-by-side prompt engineering comparison (Zero-Shot, Few-Shot, CoT, System Persona, Self-Consistency).
  - Built interactive AI Ethics & Fairness Lab (`web/src/labs/ethics/EthicsScenarioLab.tsx`) demonstrating EEOC 4/5ths Disparate Impact rule, Demographic Parity, Equalized Odds, and Kleinberg's Impossibility Theorem with real-time threshold slider.
  - Implemented Searle's Chinese Room interactive thought experiment lab and Bostrom's Treacherous Turn simulation in `/learn/unit-1/agi`.
  - Authored comprehensive 20-question Unit 1 Assessment Bank (`web/src/features/quiz/unit1QuestionBank.ts`) mapped to CO1, CO2, CO3, and CO4 with immediate feedback, detailed rationales, and exam timer in `/learn/unit-1/exam`.
  - Authored printable/foldable Unit 1 Master Revision Cheat Sheet (`web/src/pages/Unit1CheatSheetPage.tsx`) in `/cheatsheets/unit-1`.
  - Verification Exit Gate: 67 vitest tests passing, 0 TypeScript errors, 0 ESLint warnings, all 14 required sections verified, 182.59 KB JS gzip (within 200 KB budget). Evidence recorded in `docs/evidence/phase-2/verify-phase.log` and `docs/evidence/phase-2/walkthrough.md`.

- **2026-10-30 | Phase 2 Batch 3 Implemented & Verified**
  - Implemented Knowledge Acquisition & Rule Consistency Validator (`web/src/engines/expert/knowledge-base/`) detecting redundancy, subsumption, contradictions, and cycles.
  - Implemented Clinical Consultation & Transfusion Crossmatch Engine (`web/src/engines/expert/diagnosis/`) with real-time "Why" and "How" explanation facilities and ABO-Rh compatibility checking from `blood.pl`/`trans.pl`.
  - Implemented Autonomous Vehicle Perception & Control Loop (`web/src/engines/agent/self-driving/`) with multi-sensor fusion (Camera, LiDAR, Radar) under fog degradation, AEB collision avoidance, and PEAS telemetry.
  - Built 3 interactive visual labs: `ExpertSystemArchitectureLab.tsx`, `MedicalDiagnosisLab.tsx`, and `SelfDrivingLab.tsx`.
  - Authored 3 comprehensive pages:
    - `/learn/unit-1/expert-systems`: Architecture, RETE algorithm, Certainty Factors, and Feigenbaum bottleneck.
    - `/case-studies/medical-diagnosis`: Stanford MYCIN case study, interactive clinical triage, and transfusion crossmatch.
    - `/case-studies/self-driving-vehicle`: Multi-sensor fusion, SAE Levels 0–5, and moral machine dilemma.
  - Unit tests expanded from 45 to 61 passing tests across 12 test files.
  - Bundle size: 154.41 KB gzip (well under 200 KB budget).
- **2026-10-30 | Phase 2 Batch 2 Implemented & Verified**
  - Implemented Propositional Logic Engine (`web/src/engines/logic/truth-table/`) with operator precedence, truth table model checking, and entailment verifier ($KB \models \alpha$) with countermodel detection.
  - Built interactive `TruthTableLab.tsx` and 14-section `KnowledgeRepresentationPage.tsx` (/learn/unit-1/knowledge-representation).
  - Implemented First-Order Logic Robinson Unification Engine with Occurs-Check (`web/src/engines/logic/unify/`).
  - Built interactive `UnificationLab.tsx` and 14-section `FirstOrderLogicPage.tsx` (/learn/unit-1/first-order-logic).
  - Implemented Rule-Based Inference Engines (`web/src/engines/rules/chaining/`) with linear-time data-driven Forward Chaining and cycle-safe goal-driven Backward Chaining.
  - Built interactive `ChainingLab.tsx` and 14-section `RuleBasedReasoningPage.tsx` (/learn/unit-1/rule-based-reasoning).
  - Unit tests expanded from 25 to 45 passing tests across 9 test files.
  - Bundle size: 133.32 KB gzip (budget $\le 200$ KB). Commit: `326060b`.
- **2026-10-30 | Phase 2 Batch 1 Implemented & Verified**
  - Implemented pure TypeScript Vacuum Cleaner Agent simulation engine (`web/src/engines/agent/vacuum/`) supporting Simple Reflex, Model-Based, Goal-Based, and Utility-Based architectures.
  - Implemented Vacuum World interactive SVG lab (`web/src/labs/vacuum-world/VacuumWorldLab.tsx`) with room toggling, battery tracking, and interactive PEAS Framework builder.
  - Authored 4 comprehensive pages: `/learn/unit-1`, `/learn/unit-1/history`, `/learn/unit-1/types`, `/learn/unit-1/agents`.
  - All 25 unit tests green, zero TypeScript errors, zero ESLint warnings. Commit: `f6553ef`.
- **2026-10-30 | Phase 2 Plan Approved by Human**
  - Approved Phase 2 plan (artifact `phase-2-implementation-plan.md`).
- **2026-10-30 | Phase 1 Signed Off by Human**
  - Commit `b5a87d1` approved.
  - All L0–L5 verification loops green: 0 errors/warnings, 20 tests passing, 85.96 KB initial JS gzip (57% under 200 KB budget).
