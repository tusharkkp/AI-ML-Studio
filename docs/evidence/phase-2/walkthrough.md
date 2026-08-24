# Phase 2 — Unit 1 (Basics of AI) Complete Walkthrough

**Course:** Artificial Intelligence and Machine Learning (2304322T), MIT Academy of Engineering, Third Year B.Tech, Rev. 2023 NEP, AY 2025-26.  
**Unit 1 Allocated Hours:** 8 Hours.  
**Phase Status:** Complete, Verified, Green.  
**Bundle Size:** 182.59 KB gzip JS (Budget $\le$ 200 KB).  
**Test Suite:** 67 tests passing across 13 test files.  

---

## 1. Executive Summary

Phase 2 ships the entirety of **Unit 1: Basics of AI** with zero external backend dependencies ($0 client-side architecture), complete original pedagogical material, deterministic seeded execution, responsive design, and deep interactive simulation labs.

Every syllabus topic from foundational Turing tests through First-Order Logic, Expert Systems, autonomous vehicle sensor fusion, ELIZA pattern matching, and ethical fairness metrics has been realized as an interactive experience following the 14-section pedagogical template:
**Intuition → Interaction → Math → Code → Check**.

---

## 2. Unit 1 Topic Coverage Inventory

| Topic ID | Syllabus Specification | Route | Core Engine / Interactive Lab |
|---|---|---|---|
| **T2.01** | Unit 1 Landing Directory & Mastery Dashboard | `/learn/unit-1` | Unit 1 Syllabus Roadmap, CO1/CO4 badges, progress tracking |
| **T2.02** | Foundation & History of AI | `/learn/unit-1/history-foundations` | Dartmouth 1956 timeline, Turing Imitation Game interactive lab |
| **T2.03** | Applications & Types of AI (Narrow vs General, Acting/Thinking Humanly/Rationally) | `/learn/unit-1/types-applications` | 4-Quadrant Russell & Norvig taxonomy sorter with instant feedback |
| **T2.04** | Intelligent Agents, PEAS Framework & Environment Types | `/learn/unit-1/intelligent-agents` | Vacuum World Engine (`agent/vacuum`) with 3 agent architectures (Reflex, State-Based, Random) & 5 environment settings |
| **T2.05** | Propositional Logic & Knowledge Representation | `/learn/unit-1/knowledge-representation` | Boolean AST Parser, Truth Table Generator & Entailment Engine (`logic/truth-table`) |
| **T2.06** | First-Order Logic & Predicate Calculus | `/learn/unit-1/first-order-logic` | Robinson First-Order Unification Engine with Occurs-Check (`logic/unify`) |
| **T2.07** | Rule-Based Reasoning (Horn Clauses) | `/learn/unit-1/rule-based-reasoning` | Forward Chaining & Backward Chaining Engines (`rules/chaining`) with step-by-step firing queue |
| **T2.08** | Architecture of Expert Systems & Knowledge Acquisition | `/learn/unit-1/expert-systems` | Production System Architecture Lab, Knowledge Base Conflict Detector (`expert/knowledge-base`) |
| **T2.09** | **Case Study 1:** Medical Diagnosis System | `/case-studies/medical-diagnosis` | Shortliffe MYCIN Certainty Factor Engine (`expert/diagnosis`) with Why/How explanation trees & ABO-Rh transfusion crossmatch |
| **T2.10** | **Case Study 2:** Self-Driving Vehicle Simulation | `/case-studies/self-driving-vehicle` | Autonomous Vehicle Sensor Fusion Engine (`agent/self-driving`) with Camera, LiDAR, Radar, fog degradation & AEB |
| **T2.11** | Impact & Ethical Concerns of AI | `/learn/unit-1/ethics-impact` | Fairness Dilemma Lab, EEOC 4/5ths Disparate Impact Calculator, Kleinberg Impossibility Theorem |
| **T2.12** | **Self-Study:** Chatbot & Prompt Engineering Sandbox | `/learn/unit-1/chatbot-prompt-engineering` | Weizenbaum 1966 ELIZA Script Engine (`chatbot/eliza`) & 5-Technique Prompt Engineering Sandbox |
| **T2.13** | **Further Reading:** Artificial General Intelligence (AGI) | `/learn/unit-1/agi` | Searle Chinese Room Argument Interactive Lab, Bostrom Treacherous Turn simulator |
| **T2.14** | Unit 1 Assessment & Master Revision | `/learn/unit-1/exam`, `/cheatsheets/unit-1` | 20-Question Timed Exam Bank with seeded randomisation, full printable/foldable Unit 1 Revision Cheat Sheet |
| **T2.15** | Exit Gate Verification | `docs/evidence/phase-2/` | Automated L0–L5 Verification Loop: Green (67 tests, 182.59 KB) |

---

## 3. Pure TypeScript Algorithmic Engines Developed in Phase 2

All engines reside in `web/src/engines/` as pure, side-effect-free, deterministic TypeScript packages with zero browser DOM dependencies, testable via Vitest:

1. **`agent/vacuum`** (5 unit tests):
   - Grid-world simulation with dirt distribution.
   - Supports 3 agent types: Reflex (table-lookup condition-action), Reflex with State (memory of visited tiles), Random.
   - Supports 5 environment dimensions: fully/partially observable, deterministic/stochastic, static/dynamic, discrete/continuous, single/multi-agent.
2. **`logic/truth-table`** (8 unit tests):
   - Shunting-yard recursive descent AST parser for propositional logic (`¬`, `∧`, `∨`, `→`, `↔`).
   - Generates complete truth tables ($2^n$ worlds).
   - Knowledge-base entailment validator: checks whether $KB \models \alpha$ by verifying that every model of $KB$ is also a model of $\alpha$.
3. **`logic/unify`** (7 unit tests):
   - Robinson First-Order Unification algorithm.
   - Full occurs-check preventing circular self-reference (e.g., unifying $x$ with $f(x)$ fails gracefully).
   - Resolves composite predicates: e.g., $\text{knows}(John, x)$ with $\text{knows}(y, Mother(y))$.
4. **`rules/chaining`** (5 unit tests):
   - Forward Chaining (data-driven) using Horn clause agenda counters.
   - Backward Chaining (goal-driven) with depth-bounded and circular-reference-preventing goal stack.
5. **`expert/knowledge-base`** (4 unit tests):
   - Validates production rule sets against cyclical dependencies ($A \to B, B \to C, C \to A$), contradiction rules, and dead-end unfireable premises.
6. **`expert/diagnosis`** (7 unit tests):
   - Shortliffe MYCIN Certainty Factor calculus:
     $$CF_{comb}(CF_1, CF_2) = \begin{cases} CF_1 + CF_2 - CF_1 \cdot CF_2 & CF_1, CF_2 \ge 0 \\ \frac{CF_1 + CF_2}{1 - \min(|CF_1|, |CF_2|)} & CF_1 \cdot CF_2 < 0 \\ CF_1 + CF_2 + CF_1 \cdot CF_2 & CF_1, CF_2 \le 0 \end{cases}$$
   - Explanation facility generating interactive "Why" and "How" deductive derivation trees.
   - ABO-Rh blood bank compatibility crossmatch validator (e.g. O- universal donor, AB+ universal recipient).
7. **`agent/self-driving`** (5 unit tests):
   - Multi-sensor fusion engine combining monocular Camera ($P_{opt}$), LiDAR ($d_{TOF}$), and 77 GHz FMCW Radar ($v_{Doppler}$).
   - Atmospheric fog degradation model where optical confidence decays exponentially while radar remains 90%+ reliable.
   - Automatic Emergency Braking (AEB) physics calculation using kinematic stopping distances.
8. **`chatbot/eliza`** (6 unit tests):
   - Faithful recreation of Joseph Weizenbaum's 1966 DOCTOR script.
   - Regular expression pattern matching with pronoun transformations (`you` $\leftrightarrow$ `I`, `my` $\leftrightarrow$ `your`) and memory buffers.

---

## 4. Verification Evidence (All Gates Green)

```text
L0 Format: Prettier check passed (100% compliant)
L1 Typecheck: tsc --noEmit passed (0 errors)
L2 Lint: eslint . --max-warnings=0 passed (0 errors, 0 warnings, Math.random() banned)
L3 Test: vitest run passed (13 test files, 67 tests passing)
L4 Content: check-content, check-links, check-engine-ids, check-originality, check-coverage passed
L5 Bundle: 182.59 KB gzip JS (<= 200 KB budget preserved!)
```

Phase 2 is ready for user sign-off and transition to Phase 3 (Unit 2: AI Search Strategies).

