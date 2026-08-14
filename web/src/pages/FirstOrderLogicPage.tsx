import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Callout } from '@/components/ui/Callout';
import { Quiz } from '@/features/quiz/Quiz';
import { UnificationLab } from '@/labs/unification/UnificationLab';
import { Link } from 'react-router-dom';

const FOL_QUIZ = [
  {
    id: 'fol-q1',
    question:
      'Why is the sentence "All birds fly" correctly represented in First-Order Logic as ∀x (Bird(x) → Fly(x)) rather than ∀x (Bird(x) ∧ Fly(x))?',
    options: [
      {
        id: 'opt-a',
        text: 'Because ∀x (Bird(x) ∧ Fly(x)) asserts that EVERY object in the universe is both a bird and flies (including rocks, tables, and humans)',
        isCorrect: true,
        explanation:
          'Correct! Universal quantification (∀) binds with implication (→). Using conjunction (∧) asserts that every single entity in the universe has both properties, which is false if even one non-bird exists.',
      },
      {
        id: 'opt-b',
        text: 'Because the universal quantifier ∀ cannot syntactically accept the ∧ operator',
        isCorrect: false,
        explanation:
          'Incorrect. Any well-formed formula can be quantified, but semantically ∧ asserts universal coexistence of both traits across all entities.',
      },
      {
        id: 'opt-c',
        text: 'Because birds that cannot fly (like penguins) cause syntax errors',
        isCorrect: false,
        explanation: 'Incorrect. Semantic truth is distinct from grammar syntax.',
      },
      {
        id: 'opt-d',
        text: 'Because First-Order Logic does not have conjunction',
        isCorrect: false,
        explanation:
          'Incorrect. First-Order Logic contains all standard boolean connectives: ∧, ∨, ¬, →, ↔.',
      },
    ],
  },
  {
    id: 'fol-q2',
    question: 'What is the purpose of the "Occurs-Check" in the Robinson Unification algorithm?',
    options: [
      {
        id: 'opt-a',
        text: 'To prevent binding a variable to a compound term that contains that same variable (e.g. ?x = f(?x)), which would create an infinite cyclic term',
        isCorrect: true,
        explanation:
          'Correct! If ?x were unified with f(?x), the resulting term would be f(f(f(...))) infinitely, causing non-termination in theorem provers.',
      },
      {
        id: 'opt-b',
        text: 'To count how many times a constant appears in the knowledge base',
        isCorrect: false,
        explanation:
          'Incorrect. The occurs-check only examines whether a variable symbol appears in the term being bound to it.',
      },
      {
        id: 'opt-c',
        text: 'To verify that both terms have identical arities',
        isCorrect: false,
        explanation:
          'Incorrect. Arity checking is a simple length check on the argument list of functors.',
      },
      {
        id: 'opt-d',
        text: 'To convert First-Order sentences into Conjunctive Normal Form (CNF)',
        isCorrect: false,
        explanation:
          'Incorrect. Skolemization and CNF conversion are preprocessing steps for resolution, not part of unification.',
      },
    ],
  },
  {
    id: 'fol-q3',
    question:
      'Given the terms P(?x, f(?y)) and P(g(?z), f(a)), what is the Most General Unifier (MGU)?',
    options: [
      {
        id: 'opt-a',
        text: '{ ?x ↦ g(?z), ?y ↦ a }',
        isCorrect: true,
        explanation:
          'Correct! Matching the first arguments binds ?x to g(?z). Matching the second arguments recursively matches f(?y) with f(a), binding ?y to a. Both terms become P(g(?z), f(a)).',
      },
      {
        id: 'opt-b',
        text: '{ ?x ↦ g(a), ?y ↦ a, ?z ↦ a }',
        isCorrect: false,
        explanation:
          'Incorrect. While this is a unifier, it is NOT the MOST general unifier because it arbitrarily restricts ?z to the constant a.',
      },
      {
        id: 'opt-c',
        text: 'Unification fails due to arity mismatch',
        isCorrect: false,
        explanation: 'Incorrect. Both functors P have arity 2.',
      },
      {
        id: 'opt-d',
        text: '{ ?x ↦ ?z, ?y ↦ a }',
        isCorrect: false,
        explanation: 'Incorrect. ?x must be bound to the compound term g(?z), not ?z alone.',
      },
    ],
  },
  {
    id: 'fol-q4',
    question:
      'According to Church and Turing (1936), what is the decidability status of First-Order Logic entailment?',
    options: [
      {
        id: 'opt-a',
        text: 'Semi-decidable (if sentence is entailed, an algorithm is guaranteed to prove it; but if not entailed, the algorithm may never halt)',
        isCorrect: true,
        explanation:
          'Correct! By Gödel completeness and Church-Turing undecidability, FOL validity is semi-decidable (recursively enumerable, but not decidable).',
      },
      {
        id: 'opt-b',
        text: 'Strictly decidable in polynomial time O(n²)',
        isCorrect: false,
        explanation:
          'Incorrect. Even propositional SAT is NP-complete, and FOL with function symbols is undecidable in general.',
      },
      {
        id: 'opt-c',
        text: 'Completely undecidable (no entailed sentence can ever be proved)',
        isCorrect: false,
        explanation:
          'Incorrect. If a sentence is entailed, Robinson resolution or systematic enumeration will eventually prove it (semi-decidable).',
      },
      {
        id: 'opt-d',
        text: 'Identical to propositional logic truth table complexity',
        isCorrect: false,
        explanation:
          'Incorrect. Propositional logic is decidable because variable domains are strictly finite boolean states.',
      },
    ],
  },
];

export function FirstOrderLogicPage() {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [showMath, setShowMath] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-warm-500">
        <Link to="/learn/unit-1" className="hover:text-warm-800 dark:hover:text-warm-200">
          Unit 1: Basics of AI
        </Link>
        <span>/</span>
        <span className="text-warm-900 dark:text-warm-100 font-semibold">
          First-Order Logic & Unification
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="unit" unit={1}>
            Topic 2.06
          </Badge>
          <Badge variant="default">Unit 1 &bull; 2 Hours</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-950 dark:text-warm-50 tracking-tight font-serif">
          First-Order Logic & Robinson Unification
        </h1>
        <p className="text-lg text-warm-600 dark:text-warm-400 font-sans leading-relaxed">
          Express complex relational worlds with objects, predicates, and quantifiers—and discover
          how pattern unification drives automated reasoning engines like Prolog.
        </p>
      </header>

      {/* 1. Hook */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase font-bold tracking-wider text-warm-500">The Scenario</h2>
        <Card className="p-5 border-l-4 border-l-accent-primary bg-warm-50 dark:bg-warm-900/30">
          <p className="text-warm-800 dark:text-warm-200 leading-relaxed italic">
            &ldquo;You want to teach an AI: &lsquo;Every human has a biological mother, and whoever
            is your mother&rsquo;s mother is your maternal grandmother.&rsquo; In propositional
            logic, you must manually write 8 billion equations for every person on Earth. In
            First-Order Logic, it takes just two elegant quantified sentences.&rdquo;
          </p>
        </Card>
      </section>

      {/* 2. Intuition */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Intuition: Objects, Relations, and Quantifiers
        </h2>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed">
          While propositional logic treats the world as independent atomic facts (either True or
          False), <strong>First-Order Logic (FOL)</strong> models the world the way humans do:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <h4 className="font-bold text-warm-900 dark:text-warm-100 mb-1">Objects</h4>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Specific entities in the domain: <code>John</code>, <code>Pam</code>,{' '}
              <code>Earth</code>, <code>Robot1</code>.
            </p>
          </Card>
          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <h4 className="font-bold text-warm-900 dark:text-warm-100 mb-1">
              Relations / Predicates
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Connections between objects: <code>Parent(Pam, Bob)</code>,{' '}
              <code>Adjacent(RoomA, RoomB)</code>.
            </p>
          </Card>
          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <h4 className="font-bold text-warm-900 dark:text-warm-100 mb-1">Functions</h4>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Relations with one unique result: <code>MotherOf(Bob)</code> returns the specific
              object Pam.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. Try-It-First Prediction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Predict Then Reveal: The Self-Referential Trap
        </h2>
        <Card className="p-5 border-warm-200 dark:border-warm-800">
          <p className="text-warm-800 dark:text-warm-200 mb-4 font-medium">
            Suppose an inference engine attempts to unify variable <code>?x</code> with compound
            term <code>Father(?x)</code>.
            <br />
            Can this unification succeed with a finite substitution?
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              variant={prediction === 'yes' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPrediction('yes')}
            >
              Yes, binds ?x to Father(?x)
            </Button>
            <Button
              variant={prediction === 'no' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPrediction('no')}
            >
              No, Occurs-Check failure
            </Button>
          </div>

          {prediction && (
            <div className="mt-4 p-4 rounded-lg bg-warm-100 dark:bg-warm-800/60 text-sm">
              {prediction === 'no' ? (
                <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                  <strong>Brilliant!</strong> If <code>?x</code> were bound to{' '}
                  <code>Father(?x)</code>, substituting it would give{' '}
                  <code>Father(Father(Father(...)))</code> ad infinitum. The algorithm must run an{' '}
                  <strong>occurs-check</strong> to stop and reject this infinite cycle.
                </p>
              ) : (
                <p className="text-rose-700 dark:text-rose-300 font-medium">
                  <strong>Watch out!</strong> If you substitute <code>?x</code> into{' '}
                  <code>Father(?x)</code>, the variable appears inside itself! That would require
                  someone to be their own father across an infinite chain. The occurs-check strictly
                  prevents this!
                </p>
              )}
            </div>
          )}
        </Card>
      </section>

      {/* 4. Interactive Lab */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
            Interactive Unification Workbench
          </h2>
          <Badge variant="unit" unit={1}>
            Robinson MGU Engine
          </Badge>
        </div>
        <p className="text-sm text-warm-600 dark:text-warm-400">
          Test variable bindings, recursive compound term matching, and see the occurs-check prevent
          infinite recursion in real time.
        </p>

        <UnificationLab />
      </section>

      {/* 5. Hand-Worked Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Hand-Worked Example: FamilyTree.pl
        </h2>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed text-sm">
          Let&rsquo;s trace the instructor&rsquo;s classic Prolog example from{' '}
          <code>FamilyTree.pl</code>:
          <br />
          Unify <strong>Term 1:</strong> <code>Parent(?x, Bob)</code> with <strong>Term 2:</strong>{' '}
          <code>Parent(Pam, ?y)</code>.
        </p>

        <div className="space-y-3 text-xs">
          <Card className="p-3 border-warm-200 dark:border-warm-800 font-mono">
            <span className="text-warm-500 font-bold">Step 1: Functor & Arity Check</span>
            <p className="mt-1">
              Functor <code>Parent</code> equals <code>Parent</code>. Arity = 2 for both. Proceed to
              arguments.
            </p>
          </Card>
          <Card className="p-3 border-warm-200 dark:border-warm-800 font-mono">
            <span className="text-warm-500 font-bold">
              Step 2: First Argument Pair &rarr; (?x, Pam)
            </span>
            <p className="mt-1">
              <code>?x</code> is a variable; <code>Pam</code> does not contain <code>?x</code>. Bind{' '}
              <code>?x ↦ Pam</code>. Accumulator &theta; = <code>&#123; ?x ↦ Pam &#125;</code>.
            </p>
          </Card>
          <Card className="p-3 border-warm-200 dark:border-warm-800 font-mono">
            <span className="text-warm-500 font-bold">
              Step 3: Second Argument Pair &rarr; (Bob, ?y)
            </span>
            <p className="mt-1">
              Apply &theta; (no change). <code>?y</code> is a variable; <code>Bob</code> does not
              contain <code>?y</code>. Bind <code>?y ↦ Bob</code>. Accumulator &theta; ={' '}
              <code>&#123; ?x ↦ Pam, ?y ↦ Bob &#125;</code>.
            </p>
          </Card>
          <Card className="p-3 border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 font-mono">
            <span className="text-emerald-700 dark:text-emerald-300 font-bold">
              Result: Most General Unifier (MGU)
            </span>
            <p className="mt-1">
              &theta; = <code>&#123; ?x ↦ Pam, ?y ↦ Bob &#125;</code>. Applying &theta; yields
              unified instance: <code>Parent(Pam, Bob)</code>.
            </p>
          </Card>
        </div>
      </section>

      {/* 6. Formal Machinery */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
            The Formal Machinery
          </h2>
          <Button size="sm" variant="outline" onClick={() => setShowMath(!showMath)}>
            {showMath ? 'Hide Formal Math' : 'Show Formal Math'}
          </Button>
        </div>

        {showMath && (
          <Card className="p-5 space-y-4 border-warm-300 dark:border-warm-700 bg-warm-50/50 dark:bg-warm-900/30">
            <h4 className="font-bold text-warm-900 dark:text-warm-100">
              1. Substitution & Unifier Definition
            </h4>
            <p className="text-sm text-warm-700 dark:text-warm-300">
              A substitution &theta; = &#123; v₁ &rarr; t₁, v₂ &rarr; t₂, ... &#125; is a finite
              mapping from variables to terms. A substitution &theta; is a <strong>unifier</strong>{' '}
              for expressions &alpha; and &beta; if:
            </p>
            <div className="p-3 bg-white dark:bg-warm-900 rounded font-mono text-sm text-center border border-warm-200 dark:border-warm-800">
              SUBST(θ, α) = SUBST(θ, β)
            </div>

            <h4 className="font-bold text-warm-900 dark:text-warm-100 pt-2">
              2. Most General Unifier (MGU)
            </h4>
            <p className="text-sm text-warm-700 dark:text-warm-300">
              A unifier $\theta$ is called the <em>Most General Unifier</em> ($MGU(\alpha, \beta)$)
              if for every other unifier $\sigma$, there exists a substitution $\gamma$ such that
              $\sigma = \theta \circ \gamma$. The MGU imposes the minimal required constraints on
              free variables.
            </p>

            <h4 className="font-bold text-warm-900 dark:text-warm-100 pt-2">
              3. Quantifier Duality
            </h4>
            <div className="p-3 bg-white dark:bg-warm-900 rounded font-mono text-xs space-y-1 border border-warm-200 dark:border-warm-800">
              <div>∀x ¬P(x) ≡ ¬∃x P(x)</div>
              <div>¬∀x P(x) ≡ ∃x ¬P(x)</div>
              <div>∀x P(x) ≡ ¬∃x ¬P(x)</div>
            </div>
          </Card>
        )}
      </section>

      {/* 7. Algorithm & Pseudocode */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Algorithm: Robinson Unification with Occurs-Check
        </h2>
        <Card className="p-4 bg-warm-900 text-warm-100 font-mono text-xs overflow-x-auto">
          <pre>{`function UNIFY(x, y, θ):
    if θ = failure:
        return failure
    else if x = y:
        return θ
    else if VARIABLE?(x):
        return UNIFY-VAR(x, y, θ)
    else if VARIABLE?(y):
        return UNIFY-VAR(y, x, θ)
    else if COMPOUND?(x) and COMPOUND?(y):
        if x.op ≠ y.op or LENGTH(x.args) ≠ LENGTH(y.args):
            return failure
        return UNIFY(REST(x.args), REST(y.args), UNIFY(FIRST(x.args), FIRST(y.args), θ))
    else:
        return failure

function UNIFY-VAR(var, x, θ):
    if {var/val} in θ:
        return UNIFY(val, x, θ)
    else if {x/val} in θ:
        return UNIFY(var, val, θ)
    else if OCCURS-CHECK?(var, x):
        return failure    // Prevents cyclic structures
    else:
        return θ ∪ {var ↦ x}`}</pre>
        </Card>
      </section>

      {/* 8. Production Python Snippet */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Python Implementation: Unification in Pure Python
        </h2>
        <Card className="p-4 bg-warm-900 text-warm-100 font-mono text-xs overflow-x-auto">
          <pre>{`def is_variable(term):
    return isinstance(term, str) and term.startswith("?")

def occurs_check(var, term, subst):
    term = apply_subst(subst, term)
    if term == var:
        return True
    if isinstance(term, tuple):  # compound (functor, *args)
        return any(occurs_check(var, arg, subst) for arg in term[1:])
    return False

def apply_subst(subst, term):
    if is_variable(term):
        return apply_subst(subst, subst[term]) if term in subst else term
    if isinstance(term, tuple):
        return (term[0], *(apply_subst(subst, a) for a in term[1:]))
    return term

def unify(x, y, theta=None):
    if theta is None:
        theta = {}
    if x == y:
        return theta
    if is_variable(x):
        return unify_var(x, y, theta)
    if is_variable(y):
        return unify_var(y, x, theta)
    if isinstance(x, tuple) and isinstance(y, tuple):
        if x[0] != y[0] or len(x) != len(y):
            return None
        for a, b in zip(x[1:], y[1:]):
            theta = unify(apply_subst(theta, a), apply_subst(theta, b), theta)
            if theta is None:
                return None
        return theta
    return None

def unify_var(var, x, theta):
    if var in theta:
        return unify(theta[var], x, theta)
    if is_variable(x) and x in theta:
        return unify(var, theta[x], theta)
    if occurs_check(var, x, theta):
        return None  # Occurs check failure!
    return {**theta, var: x}`}</pre>
        </Card>
      </section>

      {/* 9. Make It Fail */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Make It Fail: The Occurs-Check Disaster
        </h2>
        <Card className="p-4 border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20">
          <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-2">
            Why Early Prolog Interpreters Skipped the Occurs-Check
          </h4>
          <p className="text-xs text-warm-700 dark:text-warm-300 mb-2 leading-relaxed">
            The occurs-check requires scanning the entire subterm t to see if variable v appears
            within it, taking O(size(t)) time on every variable assignment. In the 1970s and 80s,
            early Prolog systems (including standard WAM compilers) dropped the occurs-check to
            achieve high LIPS (Logical Inferences Per Second).
          </p>
          <p className="text-xs text-warm-700 dark:text-warm-300 leading-relaxed font-semibold">
            The consequence? Soundness was destroyed! Unifying <code>?x</code> with{' '}
            <code>f(?x)</code> created a circular memory pointer where the computer traversed an
            infinite loop and crashed with stack overflow or &ldquo;proved&rdquo; false mathematical
            theorems.
          </p>
        </Card>
      </section>

      {/* 10. Strengths & Limitations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Strengths, Limitations & Expressive Power
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-5 border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 mb-2">Strengths</h4>
            <ul className="text-xs space-y-2 text-warm-700 dark:text-warm-300 list-disc pl-4">
              <li>
                <strong>Natural Human Ontology:</strong> Expresses objects, properties,
                relationships, and universal rules concisely.
              </li>
              <li>
                <strong>Turing-Complete Computation:</strong> Horn-clause subsets (Prolog)
                constitute a full declarative programming paradigm.
              </li>
              <li>
                <strong>Sound Deduction:</strong> Robinson Resolution with Unification is sound and
                refutation complete.
              </li>
            </ul>
          </Card>
          <Card className="p-5 border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20">
            <h4 className="font-bold text-rose-900 dark:text-rose-200 mb-2">Limitations</h4>
            <ul className="text-xs space-y-2 text-warm-700 dark:text-warm-300 list-disc pl-4">
              <li>
                <strong>Semi-Decidable:</strong> If a theorem is false, resolution search may enter
                an infinite branch and never terminate.
              </li>
              <li>
                <strong>No Higher-Order Logic:</strong> Cannot quantify over predicates themselves
                (e.g. &ldquo;Two objects are equal if ALL properties P hold for both&rdquo; requires
                Second-Order Logic).
              </li>
              <li>
                <strong>Knowledge Acquisition Bottleneck:</strong> Encoding hundreds of thousands of
                expert rules by hand is notoriously brittle.
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 11. Misconceptions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Common Misconceptions
        </h2>
        <div className="space-y-3">
          <Callout
            type="warning"
            title="Misconception: Unification is just string pattern matching"
          >
            <p className="text-xs leading-relaxed">
              Unification is not regex or string comparison. Unification finds a common substitution
              of variables that makes structured semantic trees identical, respecting scope, nested
              functors, and transitive variable bindings.
            </p>
          </Callout>
          <Callout type="note" title="Misconception: ∃x (P(x) → Q(x)) means 'Some P is Q'">
            <p className="text-xs leading-relaxed">
              Remember: <code>P → Q</code> is equivalent to <code>¬P ∨ Q</code>. Therefore,{' '}
              <code>∃x (P(x) → Q(x))</code> is True if there exists even ONE object in the universe
              that is NOT P! To say &ldquo;Some humans are smart&rdquo;, you must use conjunction:{' '}
              <code>∃x (Human(x) ∧ Smart(x))</code>.
            </p>
          </Callout>
        </div>
      </section>

      {/* 12. Assessment */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Check Your Understanding
        </h2>
        <Quiz conceptId="u1-first-order-logic" items={FOL_QUIZ} unitAccent={1} />
      </section>

      {/* 13. Exam & Viva Corner */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Exam & Viva Corner
        </h2>
        <Card className="p-5 border-warm-200 dark:border-warm-800 space-y-4">
          <div className="border-b border-warm-200 dark:border-warm-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-primary">
              University Exam Problem (6 Marks)
            </span>
            <h4 className="font-semibold text-warm-900 dark:text-warm-100 mt-1">
              &ldquo;Unify the following pair of clauses or explain why unification is impossible:
              P(?x, f(?y), Bob) and P(John, ?z, ?z).&rdquo;
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400 mt-1">
              <strong>Step-by-step solution:</strong>
              <br />
              1. Arg 1: Unify <code>?x</code> with <code>John</code> &rarr; &theta; ={' '}
              <code>&#123; ?x ↦ John &#125;</code>.
              <br />
              2. Arg 3: Unify <code>Bob</code> with <code>?z</code> &rarr; &theta; ={' '}
              <code>&#123; ?x ↦ John, ?z ↦ Bob &#125;</code>.
              <br />
              3. Arg 2: Unify <code>f(?y)</code> with <code>?z</code>. Apply current &theta;:{' '}
              <code>?z</code> is <code>Bob</code>.
              <br />
              4. Attempting to unify compound <code>f(?y)</code> with constant <code>Bob</code>{' '}
              causes a functor/constant mismatch!
              <br />
              <strong>Conclusion:</strong> Unification fails.
            </p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent-primary">
              Viva Voce Question
            </span>
            <h4 className="font-semibold text-warm-900 dark:text-warm-100 mt-1">
              &ldquo;What is Skolemization in First-Order Logic? When do you use a Skolem Constant
              vs a Skolem Function?&rdquo;
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400 mt-1">
              <strong>Expected Answer:</strong> Skolemization eliminates existential quantifiers
              ($\exists$). If $\exists x$ is outside the scope of any universal quantifier
              ($\forall$), $x$ is replaced by a <em>Skolem constant</em> (e.g. $C$). If $\exists x$
              is inside the scope of universal quantifiers $\forall y$, $x$ is replaced by a{' '}
              <em>Skolem function</em> $F(y)$ because the chosen object depends on $y$.
            </p>
          </div>
        </Card>
      </section>

      {/* 14. Summary & Next Steps */}
      <section className="space-y-4 pt-4 border-t border-warm-200 dark:border-warm-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-semibold text-warm-500">Next Concept</span>
            <h3 className="text-lg font-bold text-warm-900 dark:text-warm-100">
              Rule-Based Reasoning: Forward &amp; Backward Chaining
            </h3>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              See how Horn clauses execute in production rule systems using data-driven and
              goal-driven chaining algorithms.
            </p>
          </div>
          <Link to="/learn/unit-1/rule-based-reasoning">
            <Button variant="primary">Continue to Rule-Based Reasoning &rarr;</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
