# PROGRESS — AIML Studio

## Now
- **Phase:** 2 (Unit 1 — Basics of AI)
- **Task:** Completing Batch 1, Proceeding to Batch 2 (T2.05 Truth Table, T2.06 First-Order Logic, T2.07 Chaining)
- **Status:** Batch 1 verified green (`verify:fast` green, 25 tests passing). Starting Batch 2.
- **Last green commit:** `b5a87d1` `feat(phase1): foundation, design system, algorithm player and BFS vertical slice`

## Phase Checklist
- [x] **Phase 0 — Discovery & Plan** *(Approved by Human)*
- [x] **Phase 1 — Platform Foundation & Vertical Slice (BFS)** *(Signed Off by Human)*
- [ ] **Phase 2 — Unit 1: Basics of AI (8 hrs)** *(Batch 1 complete; Batch 2 in progress)*
- [ ] **Phase 3 — Unit 2: AI Search Strategies (8 hrs)**
- [ ] **Phase 4 — Unit 3: ML Fundamentals (7 hrs)**
- [ ] **Phase 5 — Unit 4: Instances & Probabilistic Models (6 hrs)**
- [ ] **Phase 6 — Unit 5: Linear & Decision Models (8 hrs)**
- [ ] **Phase 7 — Unit 6: Unsupervised Learning (8 hrs)**
- [ ] **Phase 8 — Integration, Exam Prep, Capstone & Chooser**
- [ ] **Phase 9 — Hardening, Accessibility, Verification & $0 Deploy**

## Task Log (latest first)
- **2026-10-30 | Phase 2 Batch 1 Implemented & Verified**
  - Implemented pure TypeScript Vacuum Cleaner Agent simulation engine (`web/src/engines/agent/vacuum/`) supporting Simple Reflex, Model-Based, Goal-Based, and Utility-Based architectures.
  - Implemented Vacuum World interactive SVG lab (`web/src/labs/vacuum-world/VacuumWorldLab.tsx`) with room toggling, battery tracking, and interactive PEAS Framework builder.
  - Authored 4 comprehensive pages:
    - `/learn/unit-1`: Unit 1 overview, curriculum progress tracker, and concept card directory.
    - `/learn/unit-1/history`: AI Foundations & History Timeline with interactive period filters and winter causes.
    - `/learn/unit-1/types`: AI Applications & Types Classifier with ANI/AGI/ASI interactive sorter.
    - `/learn/unit-1/agents`: 14-section Intelligent Agents deep dive with PEAS matrices and interactive vacuum player.
  - All 25 unit tests green, zero TypeScript errors, zero ESLint warnings.
- **2026-10-30 | Phase 2 Plan Approved by Human**
  - Approved Phase 2 plan (artifact `phase-2-implementation-plan.md`).
- **2026-10-30 | Phase 1 Signed Off by Human**
  - Commit `b5a87d1` approved.
  - All L0–L5 verification loops green: 0 errors/warnings, 20 tests passing, 85.96 KB initial JS gzip (57% under 200 KB budget).
