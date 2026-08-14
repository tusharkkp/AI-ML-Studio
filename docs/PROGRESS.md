# PROGRESS — AIML Studio

## Now
- **Phase:** 2 (Unit 1 — Basics of AI)
- **Task:** Completed Batch 2 (T2.05, T2.06, T2.07). Ready for Batch 3 (T2.08 Expert Systems, T2.09 Medical Case Study, T2.10 Self-Driving Case Study).
- **Status:** Batch 2 verified green (`verify:fast` green, `verify:content` green, 45 tests passing, 133.32 KB gzip).
- **Last green commit:** `f6553ef` `feat(unit1): foundations, history timeline, types classifier, and vacuum agent lab`

## Phase Checklist
- [x] **Phase 0 — Discovery & Plan** *(Approved by Human)*
- [x] **Phase 1 — Platform Foundation & Vertical Slice (BFS)** *(Signed Off by Human)*
- [ ] **Phase 2 — Unit 1: Basics of AI (8 hrs)** *(Batch 1 & Batch 2 complete; Batch 3 in progress)*
- [ ] **Phase 3 — Unit 2: AI Search Strategies (8 hrs)**
- [ ] **Phase 4 — Unit 3: ML Fundamentals (7 hrs)**
- [ ] **Phase 5 — Unit 4: Instances & Probabilistic Models (6 hrs)**
- [ ] **Phase 6 — Unit 5: Linear & Decision Models (8 hrs)**
- [ ] **Phase 7 — Unit 6: Unsupervised Learning (8 hrs)**
- [ ] **Phase 8 — Integration, Exam Prep, Capstone & Chooser**
- [ ] **Phase 9 — Hardening, Accessibility, Verification & $0 Deploy**

## Task Log (latest first)
- **2026-10-30 | Phase 2 Batch 2 Implemented & Verified**
  - Implemented Propositional Logic Engine (`web/src/engines/logic/truth-table/`) with operator precedence, truth table model checking, and entailment verifier ($KB \models \alpha$) with countermodel detection.
  - Built interactive `TruthTableLab.tsx` and 14-section `KnowledgeRepresentationPage.tsx` (/learn/unit-1/knowledge-representation).
  - Implemented First-Order Logic Robinson Unification Engine with Occurs-Check (`web/src/engines/logic/unify/`).
  - Built interactive `UnificationLab.tsx` and 14-section `FirstOrderLogicPage.tsx` (/learn/unit-1/first-order-logic).
  - Implemented Rule-Based Inference Engines (`web/src/engines/rules/chaining/`) with linear-time data-driven Forward Chaining and cycle-safe goal-driven Backward Chaining.
  - Built interactive `ChainingLab.tsx` and 14-section `RuleBasedReasoningPage.tsx` (/learn/unit-1/rule-based-reasoning).
  - Unit tests expanded from 25 to 45 passing tests across 9 test files.
  - Bundle size: 133.32 KB gzip (budget $\le 200$ KB).
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
