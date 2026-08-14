import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Callout } from '@/components/ui/Callout';
import { Quiz } from '@/features/quiz/Quiz';
import { TruthTableLab } from '@/labs/truth-table/TruthTableLab';
import { Link } from 'react-router-dom';

const KR_QUIZ = [
  {
    id: 'kr-q1',
    question:
      'Under what condition is the material conditional statement (P → Q) FALSE in classical propositional logic?',
    options: [
      {
        id: 'opt-a',
        text: 'When P is True and Q is False',
        isCorrect: true,
        explanation:
          'Correct! A conditional statement is only broken (false) when the antecedent P is satisfied but the consequent Q fails to materialize.',
      },
      {
        id: 'opt-b',
        text: 'When P is False and Q is True',
        isCorrect: false,
        explanation:
          'Incorrect. When the premise P is false, the implication P → Q is vacuously True.',
      },
      {
        id: 'opt-c',
        text: 'When both P and Q are False',
        isCorrect: false,
        explanation:
          'Incorrect. If both P and Q are false, (~P ∨ Q) evaluates to (True ∨ False) which is True.',
      },
      {
        id: 'opt-d',
        text: 'Whenever P and Q have different truth values',
        isCorrect: false,
        explanation:
          'Incorrect. That describes Exclusive OR (XOR) or the negation of biconditional (¬(P ↔ Q)), not material implication.',
      },
    ],
  },
  {
    id: 'kr-q2',
    question: 'What is the formal model-theoretic definition of logical entailment: KB ⊨ α?',
    options: [
      {
        id: 'opt-a',
        text: 'Every model (truth assignment) in which KB is true is also a model in which α is true: M(KB) ⊆ M(α)',
        isCorrect: true,
        explanation:
          'Correct! Entailment means that α is true in all possible worlds where the knowledge base KB is true. There cannot be a world where KB holds but α fails.',
      },
      {
        id: 'opt-b',
        text: 'KB and α share at least one satisfying truth assignment: M(KB) ∩ M(α) ≠ ∅',
        isCorrect: false,
        explanation:
          'Incorrect. Having an intersection merely means KB and α are mutually consistent, not that KB guarantees α.',
      },
      {
        id: 'opt-c',
        text: 'α is syntactically derivable from KB using resolution only',
        isCorrect: false,
        explanation:
          'Incorrect. Derivability is syntactic inference (KB ⊢ α), whereas entailment (KB ⊨ α) is semantic truth across models.',
      },
      {
        id: 'opt-d',
        text: 'α is a tautology independent of KB',
        isCorrect: false,
        explanation:
          'Incorrect. A tautology is entailed by any KB (even empty), but entailment applies to contingent facts derived from premises.',
      },
    ],
  },
  {
    id: 'kr-q3',
    question:
      'Why is "Affirming the Consequent" ({Q, P → Q} ⊢ P) considered an invalid inference fallacy?',
    options: [
      {
        id: 'opt-a',
        text: 'Because there exists a world where Q is True, P is False, and P → Q is True (a countermodel where premises hold but conclusion fails)',
        isCorrect: true,
        explanation:
          'Correct! In the world where P = False and Q = True, both premises (Q) and (P → Q) are completely true, but the conclusion P is false. This single countermodel invalidates the entailment.',
      },
      {
        id: 'opt-b',
        text: 'Because implications can never be reversed under any circumstance',
        isCorrect: false,
        explanation:
          'Incorrect. In a biconditional (P ↔ Q), both directions hold. Affirming the consequent fails because implication is unidirectional.',
      },
      {
        id: 'opt-c',
        text: 'Because truth tables cannot evaluate formulas with two variables',
        isCorrect: false,
        explanation:
          'Incorrect. Truth tables evaluate any finite number of propositional symbols ($2^n$ rows).',
      },
      {
        id: 'opt-d',
        text: 'Because Modus Tollens forbids premises containing Q',
        isCorrect: false,
        explanation:
          'Incorrect. Modus Tollens uses ¬Q and P → Q to deduce ¬P, which is perfectly valid.',
      },
    ],
  },
  {
    id: 'kr-q4',
    question:
      'What is the primary expressive limitation of Propositional Logic that prompted the invention of First-Order Logic?',
    options: [
      {
        id: 'opt-a',
        text: 'It lacks objects, relations, and quantifiers (∀, ∃), forcing exponential duplication of atomic facts for each entity',
        isCorrect: true,
        explanation:
          'Correct! In propositional logic, to state "All squares adjacent to pits are breezy" in a 4x4 grid requires writing 16 separate complex formulas, one for each specific tile, because it cannot quantify over variables.',
      },
      {
        id: 'opt-b',
        text: 'Propositional logic cannot be evaluated on modern computers',
        isCorrect: false,
        explanation:
          'Incorrect. Propositional SAT solvers (DPLL, CDCL) routinely solve problems with millions of variables.',
      },
      {
        id: 'opt-c',
        text: 'Truth tables are not sound or complete',
        isCorrect: false,
        explanation:
          'Incorrect. Truth table enumeration is completely sound and complete for propositional logic.',
      },
      {
        id: 'opt-d',
        text: 'Propositional logic cannot represent negation (NOT)',
        isCorrect: false,
        explanation:
          'Incorrect. Negation is a foundational primary operator (¬) in propositional logic.',
      },
    ],
  },
];

export function KnowledgeRepresentationPage() {
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
          Knowledge Representation & Logic
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="unit" unit={1}>
            Topic 2.05
          </Badge>
          <Badge variant="default">Unit 1 &bull; 2 Hours</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-950 dark:text-warm-50 tracking-tight font-serif">
          Knowledge Representation & Propositional Logic
        </h1>
        <p className="text-lg text-warm-600 dark:text-warm-400 font-sans leading-relaxed">
          How intelligent agents encode real-world beliefs into mathematical symbols, verify
          consistency, and deduce indisputable new truths using semantic entailment.
        </p>
      </header>

      {/* 1. Hook */}
      <section className="space-y-3">
        <h2 className="text-xs uppercase font-bold tracking-wider text-warm-500">The Scenario</h2>
        <Card className="p-5 border-l-4 border-l-accent-primary bg-warm-50 dark:bg-warm-900/30">
          <p className="text-warm-800 dark:text-warm-200 leading-relaxed italic">
            &ldquo;An autonomous medical agent observes: &lsquo;If a patient has Malaria, they will
            have high fever.&rsquo; The sensor confirms high fever. Can the AI safely administer
            antimalarials? If your reasoning engine confuses implication with equivalence, you will
            kill patients with dengue or influenza.&rdquo;
          </p>
        </Card>
      </section>

      {/* 2. Intuition */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Intuition: From Reflex to Rational Belief
        </h2>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed">
          In reflex agents, actions are hardcoded reflexes triggered by current sensor inputs. But
          in complex, partially observable environments, an agent must construct an internal model
          of the world—a <strong>Knowledge Base (KB)</strong>.
        </p>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed">
          A knowledge base is not a disorganized bag of strings; it consists of sentences in a
          formal language with two strict properties:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <h4 className="font-bold text-warm-900 dark:text-warm-100 mb-1">Syntax</h4>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              The grammar rules specifying which combinations of symbols constitute well-formed
              formulas (e.g. <code>P ∧ Q</code> is valid; <code>P ∧ ∧ Q</code> is syntax error).
            </p>
          </Card>
          <Card className="p-4 border-warm-200 dark:border-warm-800">
            <h4 className="font-bold text-warm-900 dark:text-warm-100 mb-1">Semantics</h4>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              The meaning of sentences: how each statement maps to truth or falsehood in a specific
              possible state of the world (a &ldquo;model&rdquo;).
            </p>
          </Card>
        </div>
      </section>

      {/* 3. Try-It-First Prediction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Predict Then Reveal: The Diagnosis Dilemma
        </h2>
        <Card className="p-5 border-warm-200 dark:border-warm-800">
          <p className="text-warm-800 dark:text-warm-200 mb-4 font-medium">
            Suppose your knowledge base contains:
            <br />
            <strong>Premise 1:</strong> <code>Fever</code> (The patient has a fever)
            <br />
            <strong>Premise 2:</strong> <code>Malaria → Fever</code> (If Malaria, then Fever)
            <br />
            Does the knowledge base logically entail <code>Malaria</code>?
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              variant={prediction === 'yes' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPrediction('yes')}
            >
              Yes, Malaria is guaranteed
            </Button>
            <Button
              variant={prediction === 'no' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPrediction('no')}
            >
              No, entailment fails (Fallacy)
            </Button>
          </div>

          {prediction && (
            <div className="mt-4 p-4 rounded-lg bg-warm-100 dark:bg-warm-800/60 text-sm">
              {prediction === 'no' ? (
                <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                  <strong>Spot on!</strong> This is the classic <em>Affirming the Consequent</em>{' '}
                  fallacy. The patient could have the flu or COVID-19, which also cause fever. In
                  the lab below, load the preset to see the exact countermodel row.
                </p>
              ) : (
                <p className="text-rose-700 dark:text-rose-300 font-medium">
                  <strong>Careful!</strong> That is a deadly logical fallacy. Knowing that Malaria
                  causes Fever does NOT mean Fever only comes from Malaria. Notice that if Malaria
                  is False and Fever is True, Premise 2 is still True, but the patient does not have
                  Malaria!
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
            Interactive Logic Lab
          </h2>
          <Badge variant="unit" unit={1}>
            Live Model Checker
          </Badge>
        </div>
        <p className="text-sm text-warm-600 dark:text-warm-400">
          Explore truth tables, inspect intermediate subexpressions, and verify whether a set of
          premises strictly entails a candidate conclusion.
        </p>

        <TruthTableLab />
      </section>

      {/* 5. Hand-Worked Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Hand-Worked Example: Modus Ponens vs The Fallacy
        </h2>
        <p className="text-warm-700 dark:text-warm-300 leading-relaxed text-sm">
          Let&rsquo;s trace Modus Ponens: Premise 1 = <code>P</code>, Premise 2 = <code>P → Q</code>
          , Conclusion = <code>Q</code>. With two variables, there are exactly $2^2 = 4$ possible
          worlds ($m_0$ to $m_3$):
        </p>

        <div className="overflow-x-auto border border-warm-200 dark:border-warm-800 rounded-lg">
          <table className="w-full text-xs font-mono text-left">
            <thead className="bg-warm-100 dark:bg-warm-800">
              <tr>
                <th className="p-2.5">World</th>
                <th className="p-2.5 text-center">P</th>
                <th className="p-2.5 text-center">Q</th>
                <th className="p-2.5 text-center">Premise 1 (P)</th>
                <th className="p-2.5 text-center">Premise 2 (P → Q)</th>
                <th className="p-2.5 text-center">KB True?</th>
                <th className="p-2.5 text-center">Conclusion (Q)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-200 dark:divide-warm-800">
              <tr className="bg-emerald-50/70 dark:bg-emerald-950/30">
                <td className="p-2 font-sans font-semibold">m0 (T, T)</td>
                <td className="p-2 text-center text-emerald-600 font-bold">T</td>
                <td className="p-2 text-center text-emerald-600 font-bold">T</td>
                <td className="p-2 text-center">T</td>
                <td className="p-2 text-center">T</td>
                <td className="p-2 text-center font-bold text-emerald-700">YES (Model)</td>
                <td className="p-2 text-center font-bold text-emerald-700">T (Holds!)</td>
              </tr>
              <tr>
                <td className="p-2 font-sans">m1 (T, F)</td>
                <td className="p-2 text-center">T</td>
                <td className="p-2 text-center">F</td>
                <td className="p-2 text-center">T</td>
                <td className="p-2 text-center text-rose-600">F</td>
                <td className="p-2 text-center text-warm-400">No</td>
                <td className="p-2 text-center text-warm-400">-</td>
              </tr>
              <tr>
                <td className="p-2 font-sans">m2 (F, T)</td>
                <td className="p-2 text-center">F</td>
                <td className="p-2 text-center">T</td>
                <td className="p-2 text-center text-rose-600">F</td>
                <td className="p-2 text-center">T</td>
                <td className="p-2 text-center text-warm-400">No</td>
                <td className="p-2 text-center text-warm-400">-</td>
              </tr>
              <tr>
                <td className="p-2 font-sans">m3 (F, F)</td>
                <td className="p-2 text-center">F</td>
                <td className="p-2 text-center">F</td>
                <td className="p-2 text-center text-rose-600">F</td>
                <td className="p-2 text-center">T</td>
                <td className="p-2 text-center text-warm-400">No</td>
                <td className="p-2 text-center text-warm-400">-</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-warm-600 dark:text-warm-400">
          Notice: World $m_0$ is the <strong>only</strong> world where both premises are True. In
          that world, $Q$ is True. Therefore, $KB \models Q$ is completely sound and valid.
        </p>
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
            <h4 className="font-bold text-warm-900 dark:text-warm-100">1. Semantic Entailment</h4>
            <p className="text-sm text-warm-700 dark:text-warm-300">
              Let $M(\alpha)$ denote the set of all models (truth assignments) in which sentence
              $\alpha$ is true. Then:
            </p>
            <div className="p-3 bg-white dark:bg-warm-900 rounded font-mono text-sm text-center border border-warm-200 dark:border-warm-800">
              KB ⊨ α &nbsp;⟺&nbsp; M(KB) ⊆ M(α)
            </div>

            <h4 className="font-bold text-warm-900 dark:text-warm-100 pt-2">
              2. Validity and Satisfiability
            </h4>
            <ul className="list-disc pl-5 text-sm space-y-2 text-warm-700 dark:text-warm-300">
              <li>
                <strong>Validity (Tautology):</strong> A sentence is valid if it is true in{' '}
                <em>all</em> models. (e.g. $P \lor \neg P$).
              </li>
              <li>
                <strong>Deduction Theorem:</strong> $KB \models \alpha$ if and only if the sentence
                $(KB \implies \alpha)$ is a valid tautology.
              </li>
              <li>
                <strong>Satisfiability:</strong> A sentence is satisfiable if it is true in{' '}
                <em>at least one</em> model.
              </li>
              <li>
                <strong>Refutation (Contradiction):</strong> $KB \models \alpha$ if and only if $(KB
                \land \neg \alpha)$ is unsatisfiable (the foundation of Resolution Refutation!).
              </li>
            </ul>
          </Card>
        )}
      </section>

      {/* 7. Algorithm & Pseudocode */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Algorithm: TT-Entails? Model Checking
        </h2>
        <p className="text-sm text-warm-700 dark:text-warm-300">
          The recursive model checking algorithm enumerates all combinations of truth values for
          propositional symbols:
        </p>

        <Card className="p-4 bg-warm-900 text-warm-100 font-mono text-xs overflow-x-auto">
          <pre>{`function TT-ENTAILS?(KB, α):
    symbols = list of all proposition symbols in KB and α
    return TT-CHECK-ALL(KB, α, symbols, {})

function TT-CHECK-ALL(KB, α, symbols, model):
    if EMPTY?(symbols):
        if PL-TRUE?(KB, model):
            return PL-TRUE?(α, model)
        else:
            return TRUE    // When KB is false, vacuously true
    else:
        P = FIRST(symbols)
        rest = REST(symbols)
        return TT-CHECK-ALL(KB, α, rest, model ∪ {P: True}) and
               TT-CHECK-ALL(KB, α, rest, model ∪ {P: False})`}</pre>
        </Card>
      </section>

      {/* 8. Production Python Snippet */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Python Implementation: TT-Entails from Scratch
        </h2>
        <Card className="p-4 bg-warm-900 text-warm-100 font-mono text-xs overflow-x-auto">
          <pre>{`import itertools

def evaluate_formula(expr, assignment):
    """Safely evaluates a boolean formula under a variable assignment dict."""
    return eval(expr, {"__builtins__": None}, assignment)

def tt_entails(premises, query, variables):
    """
    Checks if premises entail query by enumerating all 2^n assignments.
    Returns (is_entailed, countermodels)
    """
    countermodels = []
    
    for values in itertools.product([True, False], repeat=len(variables)):
        model = dict(zip(variables, values))
        
        # Check if all premises hold in this model
        kb_holds = all(evaluate_formula(p, model) for p in premises)
        
        if kb_holds:
            query_holds = evaluate_formula(query, model)
            if not query_holds:
                countermodels.append(model)
                
    return (len(countermodels) == 0, countermodels)

# Example: Modus Ponens
# P -> Q is written in Python as (not P or Q)
variables = ["P", "Q"]
premises = ["P", "(not P or Q)"]
query = "Q"

entailed, cm = tt_entails(premises, query, variables)
print(f"Modus Ponens Entailed? {entailed}")  # True, []`}</pre>
        </Card>
      </section>

      {/* 9. Make It Fail */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Make It Fail: Common Fallacies in AI Systems
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20">
            <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-2">
              Fallacy 1: Affirming the Consequent
            </h4>
            <p className="text-xs text-warm-700 dark:text-warm-300 mb-2">
              <strong>Form:</strong> If P then Q; Q; therefore P.
            </p>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              <strong>Why it fails:</strong> $Q$ can be produced by alternative causes. The row
              where P is False and Q is True satisfies all premises but refutes $P$.
            </p>
          </Card>
          <Card className="p-4 border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20">
            <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-2">
              Fallacy 2: Denying the Antecedent
            </h4>
            <p className="text-xs text-warm-700 dark:text-warm-300 mb-2">
              <strong>Form:</strong> If P then Q; not P; therefore not Q.
            </p>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              <strong>Why it fails:</strong> Absence of cause $P$ does not guarantee absence of
              effect $Q$. E.g. &ldquo;If it rains, grass is wet. It didn&rsquo;t rain. Therefore
              grass is dry&rdquo; (fails if sprinkler was on).
            </p>
          </Card>
        </div>
      </section>

      {/* 10. Strengths & Limitations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Strengths, Limitations & When to Use
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-5 border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 mb-2">Strengths</h4>
            <ul className="text-xs space-y-2 text-warm-700 dark:text-warm-300 list-disc pl-4">
              <li>
                <strong>Sound & Complete:</strong> Truth table checking and resolution are
                mathematically guaranteed to find every valid consequence and never produce false
                deductions.
              </li>
              <li>
                <strong>Decidability:</strong> Truth table evaluation is strictly decidable; it
                always terminates in finite steps ($2^n$).
              </li>
              <li>
                <strong>Fast SAT Solvers:</strong> Modern CDCL solvers handle millions of clauses
                for circuit verification and hardware synthesis.
              </li>
            </ul>
          </Card>
          <Card className="p-5 border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20">
            <h4 className="font-bold text-rose-900 dark:text-rose-200 mb-2">Limitations</h4>
            <ul className="text-xs space-y-2 text-warm-700 dark:text-warm-300 list-disc pl-4">
              <li>
                <strong>No Quantifiers:</strong> Cannot state &ldquo;all squares adjacent to pits
                are breezy&rdquo; without writing a separate statement for every tile.
              </li>
              <li>
                <strong>Combinatorial Explosion:</strong> Truth tables grow exponentially as $2^n$;
                checking 50 variables requires $10^{15}$ rows.
              </li>
              <li>
                <strong>Uncertainty Blind:</strong> Cannot express degrees of belief (e.g.
                &ldquo;80% probability of rain&rdquo; requires Bayesian networks).
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
          <Callout type="warning" title="Misconception: P → Q means P causes Q">
            <p className="text-xs leading-relaxed">
              In propositional logic, <code>P → Q</code> is <strong>material conditional</strong>,
              purely defined by truth values: $(\neg P \lor Q)$. It does not imply causation,
              temporal precedence, or physical connection. &ldquo;If 2+2=5, then Paris is in
              France&rdquo; is logically True!
            </p>
          </Callout>
          <Callout type="note" title="Misconception: Entailment (⊨) is the same as Derivation (⊢)">
            <p className="text-xs leading-relaxed">
              <strong>Entailment (KB ⊨ α)</strong> is a <em>semantic</em> relationship about truth
              in models. <strong>Derivation (KB ⊢ α)</strong> is a <em>syntactic</em> process of
              applying inference rules step by step. An inference algorithm is sound if $KB \vdash
              \alpha \implies KB \models \alpha$, and complete if $KB \models \alpha \implies KB
              \vdash \alpha$.
            </p>
          </Callout>
        </div>
      </section>

      {/* 12. Assessment */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Check Your Understanding
        </h2>
        <Quiz conceptId="u1-knowledge-representation" items={KR_QUIZ} unitAccent={1} />
      </section>

      {/* 13. Exam & Viva Corner */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100 font-serif">
          Exam & Viva Corner
        </h2>
        <Card className="p-5 border-warm-200 dark:border-warm-800 space-y-4">
          <div className="border-b border-warm-200 dark:border-warm-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-primary">
              Standard Theory Question (5 Marks)
            </span>
            <h4 className="font-semibold text-warm-900 dark:text-warm-100 mt-1">
              &ldquo;Define Entailment. Prove that Modus Ponens is a sound inference rule using
              truth table model checking.&rdquo;
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400 mt-1">
              <strong>Key marking points:</strong> State $M(KB) \subseteq M(\alpha)$; draw the 4-row
              truth table for $P, Q, P \implies Q$; identify row $(T, T)$ as the single model of the
              KB; show conclusion $Q$ is True in that model; conclude 0 countermodels exist.
            </p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent-primary">
              Viva Voce Surprise Question
            </span>
            <h4 className="font-semibold text-warm-900 dark:text-warm-100 mt-1">
              &ldquo;What is the difference between Satisfiability and Validity? What theorem
              connects them?&rdquo;
            </h4>
            <p className="text-xs text-warm-600 dark:text-warm-400 mt-1">
              <strong>Expected Answer:</strong> Validity means true in ALL models (M(α) includes all
              worlds); satisfiability means true in AT LEAST ONE model (M(α) is not empty). They are
              connected by refutation: α is valid if and only if ¬α is unsatisfiable
              (contradiction).
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
              First-Order Logic & Unification
            </h3>
            <p className="text-xs text-warm-600 dark:text-warm-400">
              Overcome propositional limitations with predicates, variables, quantifiers (∀, ∃), and
              the Robinson Unification algorithm.
            </p>
          </div>
          <Link to="/learn/unit-1/first-order-logic">
            <Button variant="primary">Continue to First-Order Logic &rarr;</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
