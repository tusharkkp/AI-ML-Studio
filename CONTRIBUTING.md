# Contributing to AIML Studio

Thank you for your interest in contributing to **AIML Studio**! This platform is built to provide third-year engineering students at MIT Academy of Engineering with intuitive, interactive, and mathematically sound AI/ML learning experiences.

---

## 1. Non-Negotiable Core Rules

1. **100% Original Content:** All explanations, diagrams, micro-quizzes, analogies, and code examples must be original. Never copy verbatim text, slides, or figures from textbooks, lecture notes, or external copyrighted websites.
2. **Zero Em Dashes (`—`):** Never use em dashes anywhere in prose or code comments. Use commas, colons, full stops, or parentheses instead.
3. **Deterministic Visuals:** Never call raw `Math.random()`. Use `SeededRNG` from `@/utils/rng` so every simulation, visualization, and test is reproducible.
4. **Pure TypeScript Engines:** Algorithm logic must live in `web/src/engines/` as pure, framework-free generators yielding immutable `Step` snapshots. Never import React or DOM APIs inside engines.
5. **ChaiUI Design System:**
   - Background: near-black `#0c0a09`, borders `border-orange-50/15`.
   - Typography: Manrope for headlines, Montserrat for body, Onest for wordmark.
   - Accent: Single pale-cream highlight phrase per paragraph (`font-montserrat font-medium text-yellow-800 dark:text-orange-100`).
   - Buttons: Solid asymmetric corners (`rounded-lg rounded-br-none`), zero drop shadows (`shadow-none`).
   - Headings: Sentence case (e.g., `Decision boundary studio`, not `Decision Boundary Studio`).

---

## 2. Concept Page Structure (14-Section Template)

Every concept page in `web/src/pages/` must follow the standard 14-section pedagogical template:

1. **Header & Badges:** Title, unit badge, estimated study time, CO alignment (CO1–CO4).
2. **The Real-World Hook:** Real-world motivating question (≤ 80 words).
3. **Intuition:** Plain-language explanation with geometric analogy before formulas.
4. **Interactive Laboratory:** Embedded laboratory with predict-then-reveal prompt.
5. **Step-by-Step on Paper:** Small hand-calculated example verifiable by hand with matching unit test.
6. **Mathematical Foundations:** Formal definitions, formula cards, KaTeX expressions.
7. **Algorithm Pseudocode:** Clean algorithmic steps and asymptotic time/space complexities.
8. **Code It in Python:** Minimal clean Python implementation using standard libraries.
9. **Make It Fail:** Demonstrating how and why the algorithm breaks under adverse conditions.
10. **Strengths, Limitations & When NOT to Use:** Critical engineering tradeoffs (serves CO4).
11. **Common Misconceptions:** 2 to 4 prevailing myths directly dispelled.
12. **Check Yourself (Micro-Quiz):** ≥ 4 questions with thorough explanations for wrong options.
13. **Exam & Viva Corner:** University-style questions with model answer outlines.
14. **Summary & Key Takeaways:** 5 bullet takeaways and next concept link.

---

## 3. Developing a New Algorithm Engine

To add a new algorithm:

1. Create a folder in `web/src/engines/<domain>/<algorithm>/`:
   - `types.ts`: Define inputs, outputs, options, and the `Step<S>` snapshot shape.
   - `engine.ts`: Pure generator function yielding `Step` objects.
   - `engine.test.ts`: Unit tests verifying hand-worked numerical calculations, mathematical invariants, determinism under seed, and edge cases.
   - `index.ts`: Clean module export.
2. Register the engine ID in `tools/check-engine-ids.ts`.
3. Register the topic ID in `tools/check-coverage.ts`.

---

## 4. Verification & Quality Gates

Before opening a pull request or submitting code, ensure all verification gates are green:

```bash
# 1. Format code with Prettier
npm --prefix web run format

# 2. Fast verification: TypeScript + ESLint + Prettier check + Vitest
npm --prefix web run verify:fast

# 3. Content and syllabus coverage audit
npm --prefix web run verify:content

# 4. Production build and bundle size audit
npm --prefix web run build
npm --prefix web run check:bundle
```

All 32 test files must pass with zero TypeScript errors and zero ESLint warnings. Initial route JS payload must remain $\le 200\text{ KB}$ gzip, and each individual chunk must be $\le 150\text{ KB}$ gzip.
