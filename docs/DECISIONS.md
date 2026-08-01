# Architectural Decision Records (ADRs) — AIML Studio

> Every significant architectural, technology, and pedagogical engineering decision is recorded here. Never edit past ADRs; supersede them with new records. Format: `ADR-NNN | Date | Context | Options | Decision | Consequences`.

---

## ADR-001: Technology Stack & Core Framework Selection

- **Status:** ACCEPTED
- **Date:** 2026-10-30
- **Context:** AIML Studio requires an interactive, static web platform delivering high-performance algorithm visualisations, responsive mathematical notation, and fast mobile loading for third-year engineering students on low bandwidth without backend costs ($0).
- **Options Considered:**
  1. *Next.js (App Router)*: Strong SSR/SSG, but larger client hydration payload, heavier build pipeline, unnecessary server features for a purely static app.
  2. *Vite + React 18 + TypeScript (Strict)*: Instant HMR, minimal static bundle size (sub-200 KB initial target), full tree-shaking, robust ecosystem for canvas/SVG, predictable static deployment.
  3. *Astro + Starlight*: Great for documentation, but complex state sharing across custom dynamic interactive canvas labs.
- **Decision:** Vite + React 18 + TypeScript (strict mode enabled with `noUncheckedIndexedAccess`, `noImplicitOverride`) + Tailwind CSS + Zustand + React Router + `@mdx-js/rollup` with `remark-math` and `KaTeX`.
- **Consequences:**
  - Build output is 100% static HTML/CSS/JS, deployable to GitHub Pages, Cloudflare Pages, or Netlify at $0 cost.
  - React 18 concurrent features permit smooth UI interactions while state updates.
  - Strict typing prevents undefined access bugs across multi-step algorithm traces.

---

## ADR-002: Algorithm Architecture — The Engine → Trace → Player Pattern

- **Status:** ACCEPTED
- **Date:** 2026-10-30
- **Context:** Visualising algorithms directly within React UI components leads to state synchronization issues, non-deterministic renders, untestable logic, and inability to step backwards or scrub time.
- **Options Considered:**
  1. *Direct Animation in React State / `useEffect`*: Animate via `setTimeout`/`requestAnimationFrame` mutating React state. Highly prone to drift, impossible to unit test purely, difficult to step backwards.
  2. *Pure Engine Generator producing Immutable Trace Snapshots*: Algorithms implemented as framework-free pure TypeScript generator functions yielding a sequence of immutable `Step<S>` snapshots.
- **Decision:** Adopt the **Engine → Trace → Player** architecture strictly across all 32+ algorithms:
  ```ts
  export interface Step<S = unknown> {
    index: number;
    description: string;       // Screen-reader narrated plain language explanation
    highlights: string[];      // Node/cell/sample IDs currently active
    state: S;                  // Deep-frozen, serialisable state snapshot
    metrics?: Record<string, number>; // nodesExpanded, frontierSize, cost, loss...
    line?: number;             // Matching line in pseudocode
  }
  export interface Engine<In, S> {
    id: string;
    run(input: In, opts?: { maxSteps?: number; seed?: number }): Generator<Step<S>, Result, void>;
  }
  ```
- **Consequences:**
  - Engines are 100% pure TypeScript with 0 UI or DOM dependencies; testable via standard Vitest suites and fast-check property testing.
  - Player framework enables universal controls: Play, Pause, Step Forward, Step Backward, Scrub, Speed, Reset, and Seed selection.
  - Trace snapshots can be inspected for automated regression testing against hand-worked textbook examples.

---

## ADR-003: Visualisation & Rendering Strategy (SVG vs Canvas vs 3D)

- **Status:** ACCEPTED
- **Date:** 2026-10-30
- **Context:** The platform requires diverse visualisations ranging from discrete state graphs (BFS/DFS, decision trees, min-max trees) to dense mathematical plots (cost surfaces, SVM decision boundaries, k-Means, PCA projection).
- **Options Considered:**
  1. *SVG for everything*: Highly accessible and scalable, but degrades to < 15 fps on mobile when rendering > 1,000 points (scatter plots, heatmaps, dense search grids).
  2. *Canvas for everything*: Fast, but poor accessibility, no DOM tree for screen readers, difficult tooltips on individual graph nodes.
  3. *Heavy 3D Engine (Three.js)*: Adds > 600 KB to bundle, excessive battery drain on mobile phones.
  4. *Hybrid SVG + Canvas with D3 Math Utilities*: React owns DOM; D3 provides mathematical utilities (scales, projections, shapes, force); CSS 3D transforms / 2.5D Canvas for 3D lifts.
- **Decision:** Hybrid approach:
  - **SVG**: For discrete structures ≤ 500 elements (search trees, maze graphs, decision trees, neural diagrams, confusion matrices, ROC curves, workflow diagrams). Full keyboard focus, SVG tooltips, and ARIA labels.
  - **Canvas 2D**: For dense numerical data (regression scatter plots with 1,000+ points, decision region heatmaps, k-Means clusters, PCA rotations). High-DPI canvas scaling with pixel-ratio awareness.
  - **3D Features (SVM Kernel Trick 2D→3D, Gradient Descent Cost Surface)**: Lightweight isometric projection or custom 2.5D Canvas rendering (< 15 KB overhead), avoiding Three.js bundle penalty.
- **Consequences:**
  - Guarantees 60 fps (≥ 45 fps on CPU-throttled mobile devices).
  - Eliminates large 3D bundle dependencies, preserving the initial JS budget ≤ 200 KB.

---

## ADR-004: In-Browser Code Runtime Strategy (Pyodide vs Static Fallbacks)

- **Status:** ACCEPTED
- **Date:** 2026-10-30
- **Context:** Students need to experience real Python implementations of algorithms without external servers or API keys. However, full Python WebAssembly engines (Pyodide) are heavy (10–25 MB).
- **Options Considered:**
  1. *Backend Python Execution API (JupyterHub/Docker)*: Requires servers, authentication, recurring hosting costs, violating the $0 cost and privacy constraints.
  2. *Bundle Pyodide on Page Load*: Ruins mobile loading performance, exceeding the 200 KB initial JS budget.
  3. *Lazy-Loaded Pyodide Web Worker with Pre-Rendered Static Fallback*: Initial page loads only static code snippets with pre-computed output plots. Only when the student explicitly clicks "Run Code (Interactive)" does a Web Worker fetch Pyodide with an honest progress indicator.
- **Decision:** Option 3. Pyodide is completely isolated in a Web Worker, loaded strictly on-demand.
  - Preload packages only as needed (`numpy`, `pandas`, `scikit-learn`, `matplotlib`).
  - Worker execution is sandboxed with a strict 15-second execution timeout and a manual "Stop" button.
  - If WebAssembly or network fails, the interactive runner seamlessly displays the verified pre-rendered output and a copyable script.
- **Consequences:**
  - Initial route payload remains < 200 KB gzip.
  - Low-bandwidth mobile users are never penalized unless they explicitly choose interactive execution.
  - Zero server maintenance, zero API keys, 100% client privacy.

---

## ADR-005: Logic & Expert Systems Architecture (Pure TS Rule Engine vs Tau-Prolog)

- **Status:** ACCEPTED
- **Date:** 2026-10-30
- **Context:** Unit 1 covers First-Order Logic, Rule-Based Reasoning (forward and backward chaining), and Expert Systems architecture with explanation facilities ("Why" and "How").
- **Options Considered:**
  1. *Tau-Prolog / Web Prolog Interpreter*: Runs actual Prolog code in browser, but opaque execution stack makes step-by-step graphical proof-tree visualization difficult and adds bundle weight.
  2. *Custom Pure TypeScript Rule & Inference Engine*: Native TS implementation supporting Horn clauses, forward chaining, backward chaining, unification, and explicit resolution steps yielding `Step` traces with structured proof trees and "Why/How" explanation facilities.
- **Decision:** Implement a **custom Pure TypeScript Rule Engine** (`web/src/engines/rules/`) as the core interactive engine.
  - Replicate the exact logic from instructor files (`blood.pl`, `FamilyTree.pl`, `eliza.pl`, `Recommendation.pl`) as clean, tested TypeScript rules.
  - Provide an optional syntax viewer / mini playground showcasing the equivalent declarative Prolog syntax for curriculum alignment.
- **Consequences:**
  - Enables rich visual step-through of unification and proof-tree construction in the Player UI.
  - Full type safety, zero external Prolog library dependencies, guaranteed deterministic snapshots.

---

## ADR-006: Client-Only Zero-Cost Deployment, Persistence & Privacy

- **Status:** ACCEPTED
- **Date:** 2026-10-30
- **Context:** The platform must cost $0 indefinitely, collect zero student telemetry or personal data, work offline or on spotty connections, and preserve student progress (reading, lab completions, quiz results).
- **Options Considered:**
  1. *Firebase / Supabase Auth & Database*: Requires backend configuration, data privacy compliance, potential billing surprises, and online connectivity.
  2. *Browser LocalStorage + State Serializer*: 100% client-side persistence using Zustand with a LocalStorage sync adapter, schema versioning, and JSON import/export.
- **Decision:** Option 2. Client-only architecture:
  - State persisted under versioned key `aiml_studio_progress_v1`.
  - Schema migration and corruption recovery built-in (falls back safely to empty state if invalid JSON detected).
  - Shareable URL state: Every lab encodes parameters and inputs in URL hash parameters for 1-click sharing between students and teachers.
  - Deployed to static hosts: Cloudflare Pages / GitHub Pages / Netlify with automated CI.
- **Consequences:**
  - Absolute privacy; no cookies, no tracking scripts, GDPR/FERPA compliant by default.
  - $0 hosting cost forever.

