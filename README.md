# AIML Studio: Interactive Learning Platform

> _"Don't just read the algorithm. Watch it think, break it, fix it, and then code it."_

**AIML Studio** is a free, zero-cost, browser-native learning platform specifically engineered for the undergraduate university course **Artificial Intelligence & Machine Learning (Course Code: 2304322T)** at **MIT Academy of Engineering (MIT AOE), Pune** (Third Year B.Tech, Rev. 2023 NEP, AY 2025-26).

---

## 1. Core Educational Promise

Most AI/ML textbooks and slides present formulas first and abstract code second. Students memorize definitions for exams without developing an intuitive geometric or algorithmic mental model.

AIML Studio reverses this paradigm using a **Predict-then-Reveal** laboratory model:

1. **Intuition First:** Plain-language real-world hook and geometric analogy before mathematical formalism.
2. **Interactive Simulation:** 28 pure TypeScript algorithm engines producing immutable step snapshots.
3. **Break It On Purpose:** Every algorithm features a dedicated "Make It Fail" mode (e.g., learning rate divergence, k=1 overfitting, inadmissible heuristics).
4. **Step-by-Step on Paper:** Hand-calculated numerical examples matching engine state step-by-step.
5. **Code & Verify:** Minimal clean Python implementations alongside unit-tested TypeScript engines.
6. **Assessment & Viva Prep:** 20-question timed exams per unit, oral viva flashcards, and a 30-question full-length mock examination.

---

## 2. Curriculum Coverage (58 Syllabus Topics Built)

The platform is mapped directly to the official MIT AOE syllabus and Course Outcomes (**CO1–CO4**):

| Unit       | Title                                    | Syllabus Scope                                                                                                 | Interactive Modules & Case Studies                                                                                                                           |
| ---------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Unit 1** | Basics of AI (8 Hrs)                     | PEAS framework, rational agents, propositional logic, FOL, inference rules, expert systems                     | Vacuum World simulator, Truth Table solver, Unification engine, Medical Diagnosis Expert System, Self-Driving Agent                                          |
| **Unit 2** | AI Search Strategies (8 Hrs)             | State-space, BFS, DFS, DLS, IDDFS, A\*, Greedy, Hill Climbing, Simulated Annealing, CSP, Minimax, Alpha-Beta   | Missionaries & Cannibals solver, Uninformed search race, GPS Navigation route planner, Australia Map Coloring, Chess Engine                                  |
| **Unit 3** | ML Fundamentals (7 Hrs)                  | ML paradigms, simple & multiple regression, gradient descent, polynomial curves, bias-variance, regularisation | Drag-the-points regression, Cost surface gradient descent animation, King County Real Estate case study, Healthcare Insurance case study                     |
| **Unit 4** | Instances & Probabilistic Models (6 Hrs) | Bayes theorem, Naive Bayes, Laplace smoothing, logistic regression, confusion matrix, ROC-AUC, k-NN            | 1,000-person natural frequency cohort, Spam token log-likelihood, 2D decision boundary studio, Telecom Customer Churn case study, Variational Inference ELBO |
| **Unit 5** | Linear & Decision Models (8 Hrs)         | Decision trees, Information Gain, Gini impurity, pruning, SVM margin, kernel trick, Random Forests, AdaBoost   | Play Tennis split builder, Alpha-pruning studio, SVM separating hyperplane & margin gutters, 3D parabolic lift, Pima Diabetes case study                     |
| **Unit 6** | Unsupervised Learning (8 Hrs)            | Association rules (Apriori), clustering, dimensionality reduction                                              | _PENDING_                                                                                                                                                    |

---

## 3. Platform Capabilities & Hubs

- **Algorithm Chooser & Duel Matrix (`/compare`):** An interactive 5-question multi-criteria recommender wizard, head-to-head algorithm duel simulator, and master cross-unit comparison matrix.
- **Practice & Examination Hub (`/practice`):** Full-length 30-question mock exam simulator (synthesizing 6 questions from each unit), 20-question unit assessments, and a 10-card oral viva flashcard deck.
- **Searchable Technical Glossary (`/glossary`):** 65+ technical definitions with A–Z alphabetical filtering, unit categorization, mathematical notation, and concept links.
- **Interactive Make It Fail Gallery (`/failure-gallery`):** 12 famous failure modes (e.g., BFS memory explosion, A\* inadmissible heuristics, Accuracy Paradox, Naive Bayes zero-frequency trap, SVM gamma island overfitting) with live interactive failure triggers.
- **Interactive Laboratories Directory (`/lab`):** Direct catalog access to all 24 standalone algorithm laboratories.
- **Revision Cheat Sheets (`/cheatsheets`):** High-density printable revision guides with formula cards and viva questions.
- **Global Search Modal (`Ctrl+K` or `/`):** Instant keyboard-navigable search across all concepts, labs, case studies, formulas, and glossary terms.
- **Teacher Presentation Mode:** Projector-optimized high-contrast styling and enlarged typography for classroom lectures.

---

## 4. Technical Architecture & Constraints

- **$0 Client-Only Static Hosting:** Zero backend servers, zero databases, zero cloud dependencies. Hosted as a static single-page application.
- **100% Privacy & Zero Tracking:** No third-party analytics, cookies, or telemetry. All user progress persists exclusively in browser `localStorage` via Zustand.
- **Engine-Trace-Player Pattern:** All algorithms run in pure, framework-agnostic TypeScript (`web/src/engines/`). Engines yield immutable `Step` objects consumed by visualizer players.
- **Deterministic Simulation:** Zero unseeded `Math.random()`. All simulations utilize `SeededRNG` for reproducible visualizations and property tests.
- **ChaiUI Design System:** Warm near-black aesthetic (`#0c0a09`), hairline borders (`#292524`), Manrope / Montserrat typography, single pale-cream accent per paragraph, asymmetric button corners, and zero em dashes.
- **Rigorous Verification Gates (L0–L5):**
  - **L0 Static:** TypeScript strict mode, zero ESLint warnings, 100% Prettier compliant.
  - **L1 Engine:** 179 passing unit, invariant, and property tests via Vitest.
  - **L4 Content:** Content schema validation, link verification, engine ID check, and originality verification.
  - **L5 Budgets:** Initial Route JS payload is **97.70 KB** gzip (budget: $\le 200\text{ KB}$); largest chunk is **52.31 KB** gzip (budget: $\le 150\text{ KB}$).

---

## 5. Development & Verification

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
# Clone the repository
git clone https://github.com/tusharkkp/AI-ML-Studio.git
cd AI-ML-Studio

# Install web dependencies
cd web
npm install
```

### Running Locally

```bash
# Start local Vite development server
npm run dev
```

### Running Automated Verification Loops

```bash
# Fast check: TypeScript + ESLint + Prettier + Vitest (32 test suites, 179 tests)
npm run verify:fast

# Content integrity check: Schema, links, engine IDs, originality, syllabus coverage
npm run verify:content

# Production build & bundle budget audit
npm run build
npm run check:bundle
```

---

## 6. Course Information & Credits

- **Institution:** MIT Academy of Engineering (MIT AOE), Alandi, Pune
- **Course:** Artificial Intelligence & Machine Learning (2304322T)
- **Academic Year:** 2025-26 (Rev. 2023 NEP Curriculum)
- **Author:** Tushar Kaldate
- **License:** MIT License
