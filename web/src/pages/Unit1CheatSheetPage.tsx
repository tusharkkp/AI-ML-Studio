import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Link } from 'react-router-dom';

export function Unit1CheatSheetPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 print:py-0 print:px-0">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden border-b border-warm-200 dark:border-warm-800 pb-4">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-warm-500 mb-1"
          >
            <Link to="/learn/unit-1" className="hover:text-warm-800 dark:hover:text-warm-200">
              Unit 1: Basics of AI
            </Link>
            <span>/</span>
            <span className="text-warm-900 dark:text-warm-100 font-semibold">
              Revision Cheat Sheet
            </span>
          </nav>
          <h1 className="text-2xl font-extrabold text-warm-950 dark:text-warm-50 font-serif">
            Unit 1: Basics of AI — Master Revision Sheet
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/learn/unit-1/exam">
            <Button size="sm" variant="outline">
              Take Practice Exam &rarr;
            </Button>
          </Link>
          <Button size="sm" variant="primary" onClick={() => window.print()}>
            🖨️ Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="space-y-4 print:text-black">
        {/* Row 1: PEAS & Agent Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
          {/* Card 1: PEAS Template */}
          <Card className="p-4 border-warm-300 dark:border-warm-700 text-xs">
            <div className="flex items-center justify-between border-b border-warm-200 pb-2 mb-2">
              <span className="font-bold text-sm uppercase tracking-wider text-warm-900 dark:text-warm-100">
                1. PEAS Framework Template
              </span>
              <Badge variant="unit" unit={1} size="sm">
                Syllabus Core
              </Badge>
            </div>
            <div className="space-y-1.5 leading-relaxed">
              <div>
                <strong>Performance (P):</strong> Metric being maximized (cleanliness, trip
                duration, zero crashes, diagnostic precision).
              </div>
              <div>
                <strong>Environment (E):</strong> External task domain (partially observable,
                stochastic, continuous, multi-agent).
              </div>
              <div>
                <strong>Actuators (A):</strong> Output effectors (wheels, steering, display advice,
                drug prescription, gripper).
              </div>
              <div>
                <strong>Sensors (S):</strong> Input transducers (dirt detector, RGB camera, LiDAR,
                blood lab panel, thermometer).
              </div>
            </div>
          </Card>

          {/* Card 2: 4 Agent Architectures */}
          <Card className="p-4 border-warm-300 dark:border-warm-700 text-xs">
            <div className="flex items-center justify-between border-b border-warm-200 pb-2 mb-2">
              <span className="font-bold text-sm uppercase tracking-wider text-warm-900 dark:text-warm-100">
                2. The 4 Intelligent Agent Types
              </span>
              <Badge variant="unit" unit={1} size="sm">
                Russell &amp; Norvig
              </Badge>
            </div>
            <div className="space-y-1.5 leading-relaxed">
              <div>
                <strong>Simple Reflex:</strong> Condition-Action rules (
                <code>IF dirty THEN suck</code>). Zero memory; loops in partially observable
                domains.
              </div>
              <div>
                <strong>Model-Based:</strong> Maintains internal state / history tracking unseen
                world aspects.
              </div>
              <div>
                <strong>Goal-Based:</strong> Combines state with explicit desirable goal states to
                plan actions.
              </div>
              <div>
                <strong>Utility-Based:</strong> Uses a real-valued utility function \(U(s)\) to
                resolve trade-offs between competing goals.
              </div>
            </div>
          </Card>
        </div>

        {/* Row 2: Propositional Logic & Entailment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
          {/* Card 3: Propositional Logic Cheat Sheet */}
          <Card className="p-4 border-warm-300 dark:border-warm-700 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-warm-200 pb-2 mb-2 font-sans">
              <span className="font-bold text-sm uppercase tracking-wider text-warm-900 dark:text-warm-100">
                3. Propositional Logic Foundations
              </span>
              <Badge variant="unit" unit={1} size="sm">
                Formal Logic
              </Badge>
            </div>
            <div className="space-y-1">
              <div>
                <strong>Precedence:</strong> ¬ &gt; ∧ &gt; ∨ &gt; → &gt; ↔
              </div>
              <div>
                <strong>Material Implication:</strong> P → Q ≡ ¬P ∨ Q
              </div>
              <div>
                <strong>Contrapositive:</strong> P → Q ≡ ¬Q → ¬P
              </div>
              <div>
                <strong>De Morgan&rsquo;s Laws:</strong>
              </div>
              <div className="pl-3">¬(P ∧ Q) ≡ ¬P ∨ ¬Q</div>
              <div className="pl-3">¬(P ∨ Q) ≡ ¬P ∧ ¬Q</div>
              <div className="pt-1">
                <strong>Entailment Definition:</strong> KB ⊨ α ⟺ M(KB) ⊆ M(α)
              </div>
              <div>
                <strong>Refutation:</strong> KB ⊨ α ⟺ (KB ∧ ¬α) is UNSATISFIABLE
              </div>
            </div>
          </Card>

          {/* Card 4: First-Order Logic & Unification */}
          <Card className="p-4 border-warm-300 dark:border-warm-700 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-warm-200 pb-2 mb-2 font-sans">
              <span className="font-bold text-sm uppercase tracking-wider text-warm-900 dark:text-warm-100">
                4. First-Order Logic &amp; Unification
              </span>
              <Badge variant="unit" unit={1} size="sm">
                Robinson MGU
              </Badge>
            </div>
            <div className="space-y-1">
              <div>
                <strong>Substitution:</strong> θ = &#123; v₁ ↦ t₁, v₂ ↦ t₂ &#125;
              </div>
              <div>
                <strong>Most General Unifier:</strong> SUBST(θ, α) = SUBST(θ, β)
              </div>
              <div>
                <strong>Occurs-Check Invariant:</strong> Fails if variable ?x occurs inside term t
                (e.g. ?x with f(?x)). Prevents infinite cyclic terms!
              </div>
              <div>
                <strong>Quantifier Duality:</strong>
              </div>
              <div className="pl-3">∀x ¬P(x) ≡ ¬∃x P(x)</div>
              <div className="pl-3">¬∀x P(x) ≡ ∃x ¬P(x)</div>
              <div className="pt-1 font-sans">
                <strong>Golden Rule:</strong> ∀x uses (P(x) → Q(x)); ∃x uses (P(x) ∧ Q(x))!
              </div>
            </div>
          </Card>
        </div>

        {/* Row 3: Chaining & Expert Systems */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
          {/* Card 5: Forward vs Backward Chaining */}
          <Card className="p-4 border-warm-300 dark:border-warm-700 text-xs">
            <div className="flex items-center justify-between border-b border-warm-200 pb-2 mb-2">
              <span className="font-bold text-sm uppercase tracking-wider text-warm-900 dark:text-warm-100">
                5. Forward vs Backward Chaining
              </span>
              <Badge variant="unit" unit={1} size="sm">
                Inference
              </Badge>
            </div>
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-warm-200">
                  <th className="py-1">Feature</th>
                  <th>Forward Chaining</th>
                  <th>Backward Chaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-200">
                <tr>
                  <td className="py-1 font-bold">Direction</td>
                  <td>Data &rarr; Facts (Bottom-up)</td>
                  <td>Query &rarr; Subgoals (Top-down)</td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Algorithm</td>
                  <td>Count-array Agenda O(N)</td>
                  <td>Recursive Goal Stack DFS</td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Best For</td>
                  <td>Monitoring, Synthesis</td>
                  <td>Diagnosis, Verification</td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">User Role</td>
                  <td>Passive data stream</td>
                  <td>Interactive targeted Q&amp;A</td>
                </tr>
              </tbody>
            </table>
          </Card>

          {/* Card 6: Expert Systems & Certainty Factors */}
          <Card className="p-4 border-warm-300 dark:border-warm-700 text-xs">
            <div className="flex items-center justify-between border-b border-warm-200 pb-2 mb-2">
              <span className="font-bold text-sm uppercase tracking-wider text-warm-900 dark:text-warm-100">
                6. Expert Systems &amp; Certainty Factors
              </span>
              <Badge variant="unit" unit={1} size="sm">
                Stanford MYCIN
              </Badge>
            </div>
            <div className="space-y-1.5 leading-relaxed">
              <div>
                <strong>6 Core Blocks:</strong> UI, Explanation Facility, Inference Engine, Working
                Memory, Knowledge Base, Knowledge Acquisition Subsystem.
              </div>
              <div className="font-mono text-[11px] bg-warm-100 p-1.5 rounded dark:bg-warm-800">
                CF(h, e) = MB(h, e) - MD(h, e) ∈ [-1.0, +1.0]
                <br />
                CF_combine = CF₁ + CF₂(1 - CF₁)
              </div>
              <div>
                <strong>Why/How Facility:</strong> &lsquo;Why&rsquo; shows the active rule currently
                being evaluated; &lsquo;How&rsquo; displays the post-hoc derivation proof tree.
              </div>
              <div>
                <strong>Feigenbaum Bottleneck:</strong> Difficulty of eliciting subconscious tacit
                heuristics from human specialists into formal production rules.
              </div>
            </div>
          </Card>
        </div>

        {/* Row 4: Ethics & Governance */}
        <Card className="p-4 border-warm-300 dark:border-warm-700 text-xs">
          <div className="flex items-center justify-between border-b border-warm-200 pb-2 mb-2">
            <span className="font-bold text-sm uppercase tracking-wider text-warm-900 dark:text-warm-100">
              7. AI Ethics, Bias &amp; EU AI Act Governance
            </span>
            <Badge variant="unit" unit={1} size="sm">
              Regulations
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <strong>EEOC 4/5ths Rule:</strong> Disparate Impact occurs if:
              <br />
              <code className="font-mono text-[11px]">
                Rate(Protected) / Rate(Majority) &lt; 0.80
              </code>
            </div>
            <div>
              <strong>Kleinberg Theorem:</strong> Calibration (Predictive Parity) and Equalized Odds
              (Equal False Positive Rates) are mathematically incompatible when base rates differ.
            </div>
            <div>
              <strong>EU AI Act Tiers:</strong>
              <br />
              &bull; <em>Unacceptable:</em> Social scoring (BANNED).
              <br />
              &bull; <em>High Risk:</em> Recruitment, Medical (Audited).
              <br />
              &bull; <em>Transparency:</em> Chatbots, Deepfakes.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
