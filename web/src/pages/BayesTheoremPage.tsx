import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { BayesTheoremLab } from '@/labs/bayes-theorem/BayesTheoremLab';

export const BayesTheoremPage: React.FC = () => {
  const quizItems = [
    {
      id: 'bayes-q1',
      question:
        'A medical test for a rare disease (prevalence 0.1%) has 99% sensitivity and 95% specificity. If an asymptomatic patient tests positive, what is their approximate posterior probability of actually having the disease?',
      options: [
        {
          id: 'A',
          text: 'Approximately 1.9% (less than 2%), because healthy false alarms outnumber true sick positives by roughly 50 to 1.',
          isCorrect: true,
          explanation:
            'In 100,000 people, 100 have the disease (99 test positive) and 99,900 are healthy (5% of 99,900 = 4,995 false positives). P(Disease | +) = 99 / (99 + 4,995) = 99 / 5,094 ≈ 1.94%. Ignoring the base rate is the classical base-rate fallacy.',
        },
        {
          id: 'B',
          text: '99%, because the sensitivity of the laboratory assay is 99%.',
          isCorrect: false,
          explanation:
            'Sensitivity is P(+ | Disease), the probability of testing positive given that the patient is already known to be sick. It is NOT P(Disease | +).',
        },
        {
          id: 'C',
          text: '95%, because the test specificity is 95%.',
          isCorrect: false,
          explanation:
            'Specificity measures the true negative rate among healthy people, not the posterior probability of disease.',
        },
      ],
    },
    {
      id: 'bayes-q2',
      question:
        'In Bayes Rule P(A|B) = [ P(B|A) · P(A) ] / P(B), what role does the denominator P(B) play?',
      options: [
        {
          id: 'A',
          text: 'It acts as the marginal evidence normalizing constant, computed via the Law of Total Probability to ensure all posterior probabilities sum to 1.',
          isCorrect: true,
          explanation:
            'The denominator P(B) = Σ P(B|A_i)P(A_i) sums the probability of observing evidence B across all mutually exclusive hypotheses, ensuring the posterior is a valid probability measure.',
        },
        {
          id: 'B',
          text: 'It is the prior probability of hypothesis A before receiving any data.',
          isCorrect: false,
          explanation: 'The prior probability of hypothesis A is P(A), which is in the numerator.',
        },
        {
          id: 'C',
          text: 'It represents the measurement error variance of the sensor.',
          isCorrect: false,
          explanation: 'P(B) is the total marginal probability of observing feature or evidence B.',
        },
      ],
    },
    {
      id: 'bayes-q3',
      question:
        'When using Bayes theorem for classification between two classes C1 and C2, why can the denominator P(X) often be omitted during argmax prediction?',
      options: [
        {
          id: 'A',
          text: 'Because P(X) is strictly positive and identical for all competing classes for a given observation vector X, leaving the ranking order unchanged.',
          isCorrect: true,
          explanation:
            'When evaluating argmax_c P(C|X), the denominator P(X) does not depend on class c. Therefore, argmax_c [P(X|c)P(c) / P(X)] = argmax_c [P(X|c)P(c)].',
        },
        {
          id: 'B',
          text: 'Because P(X) is always equal to 1.0 in any feature space.',
          isCorrect: false,
          explanation: 'P(X) is the marginal evidence and is rarely equal to 1.0.',
        },
        {
          id: 'C',
          text: 'Because modern computers cannot perform division operations.',
          isCorrect: false,
          explanation: 'Hardware performance is not the reason for the mathematical identity.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-300 font-sans">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* Header Section */}
        <div className="space-y-4 border-b border-[#292524] pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/learn/unit-4"
              className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
            >
              ← Back to Unit 4
            </Link>
            <span className="text-stone-600">/</span>
            <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-xs">
              Unit 4: Topic 1
            </Badge>
            <Badge variant="outline" className="border-sky-500/40 text-sky-300 text-xs">
              CO2 (Apply)
            </Badge>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-xs">
              CO4 (Analyze)
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            Bayes' Theorem & Probabilistic Foundations
          </h1>

          <p className="text-stone-400 text-base leading-relaxed max-w-3xl">
            Machine learning systems routinely make decisions under profound uncertainty. Bayes'
            Theorem provides the formal mathematical calculus for{' '}
            <span className="text-[#fef3c7] font-medium font-sans">
              updating prior beliefs in light of observed evidence
            </span>
            , serving as the bedrock for spam filters, medical diagnostics, Bayesian belief
            networks, and modern probabilistic robotics.
          </p>
        </div>

        {/* Section 1: Intuition & The Big Picture */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">01.</span>
            Intuition and the Big Picture
          </h2>
          <p className="text-stone-300 leading-relaxed">
            Imagine an automated medical scanner engineered to detect a rare pancreatic condition
            affecting 1 in 1,000 citizens in the general population. The manufacturer advertises
            impressive clinical laboratory credentials: 99% sensitivity (it flags sick patients 99%
            of the time) and 95% specificity (it correctly clears healthy people 95% of the time).
            If you take this routine checkup during an annual screening and the machine flashes red,
            what is your actual chance of being ill? Most untrained clinicians guess 95% or 99%. In
            reality, the statistical truth is{' '}
            <span className="text-[#fef3c7] font-medium font-sans">less than 2 percent</span>.
          </p>
          <p className="text-stone-300 leading-relaxed">
            Why does our human intuition fail so dramatically? Because our brains instinctively
            focus on the accuracy of the instrument while disregarding the overwhelming rarity of
            the condition. In a cohort of 100,000 people, only 100 are sick, of which 99 test
            positive. But among the 99,900 healthy people, the 5% false-positive rate produces 4,995
            false alarms! The 99 true positives are utterly swamped by nearly 5,000 false alarms.
            Bayes' Theorem formalizes this exact balance by treating prior knowledge and observed
            likelihoods as equal partners in the equation.
          </p>
        </section>

        {/* Section 2: Interactive Laboratory */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">02.</span>
            Interactive Laboratory: The Base-Rate Paradox
          </h2>
          <p className="text-stone-300 leading-relaxed">
            Use the interactive simulator below to sweep the population prevalence base rate, the
            test sensitivity, and the specificity. Observe how the{' '}
            <span className="text-[#fef3c7] font-medium font-sans">
              1,000-patient natural frequency grid
            </span>{' '}
            dynamically updates the ratio between true positives and false alarms.
          </p>

          <BayesTheoremLab />
        </section>

        {/* Section 3: Step-by-Step on Paper */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">03.</span>
            Step-by-Step on Paper
          </h2>
          <p className="text-stone-300 leading-relaxed">
            Let us solve a classic university examination question step-by-step using first
            principles. Suppose disease prevalence is{' '}
            <span className="text-[#fef3c7] font-medium font-sans">P(D) = 0.01</span> (1%),
            sensitivity is P(+ | D) = 0.95 (95%), and specificity is P(- | ¬D) = 0.90 (90%).
          </p>

          <div className="bg-[#141210] border border-[#292524] rounded-lg p-5 font-mono text-xs space-y-4">
            <div className="border-b border-[#292524] pb-2 text-amber-300 font-bold">
              STEP 1: Identify all given probabilities and their complements
            </div>
            <div className="space-y-1 text-stone-300 pl-3">
              <div>Prior Probability of Disease: P(D) = 0.01</div>
              <div>Prior Probability of Healthy: P(¬D) = 1 - 0.01 = 0.99</div>
              <div>Sensitivity (True Positive Rate): P(+ | D) = 0.95</div>
              <div>Specificity (True Negative Rate): P(- | ¬D) = 0.90</div>
              <div>False Positive Rate (FPR): P(+ | ¬D) = 1 - Specificity = 1 - 0.90 = 0.10</div>
            </div>

            <div className="border-b border-[#292524] pb-2 text-amber-300 font-bold">
              STEP 2: Compute marginal evidence P(+) using Law of Total Probability
            </div>
            <div className="space-y-1 text-stone-300 pl-3">
              <div>P(+) = P(+ | D) · P(D) + P(+ | ¬D) · P(¬D)</div>
              <div>P(+) = (0.95 × 0.01) + (0.10 × 0.99)</div>
              <div>P(+) = 0.0095 + 0.0990 = 0.1085 (10.85% of all tests come back positive)</div>
            </div>

            <div className="border-b border-[#292524] pb-2 text-amber-300 font-bold">
              STEP 3: Apply Bayes' Formula for Posterior P(D | +)
            </div>
            <div className="space-y-1 text-stone-300 pl-3">
              <div>P(D | +) = [ P(+ | D) · P(D) ] / P(+)</div>
              <div>P(D | +) = 0.0095 / 0.1085 ≈ 0.08756</div>
              <div className="text-emerald-400 font-bold">
                Result: Posterior Probability = 8.76%
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Formal Mathematical Foundations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">04.</span>
            Formal Mathematical Foundations
          </h2>
          <p className="text-stone-300 leading-relaxed">
            Formally, let {'(Ω, F, P)'} be a probability space. For two events A and B with P(B)
            &gt; 0, the conditional probability of A given B is defined as the ratio of their joint
            probability to the marginal probability of B:
          </p>

          <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg text-center font-mono text-sm text-amber-200">
            {'P(A | B) = P(A ∩ B) / P(B)'}
          </div>

          <p className="text-stone-300 leading-relaxed">
            Since the joint probability is symmetric ({'P(A ∩ B) = P(B ∩ A) = P(B | A) · P(A)'}),
            substitution immediately yields{' '}
            <span className="text-[#fef3c7] font-medium font-sans">Bayes' Theorem</span>:
          </p>

          <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg text-center font-mono text-sm text-[#fef3c7]">
            {'P(A | B) = [ P(B | A) · P(A) ] / P(B)'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#141210] border border-[#292524] rounded">
              <span className="text-amber-300 font-bold block mb-1">1. Prior P(A)</span>
              The initial belief in hypothesis A before any evidence is gathered.
            </div>
            <div className="p-3 bg-[#141210] border border-[#292524] rounded">
              <span className="text-sky-300 font-bold block mb-1">2. Likelihood P(B | A)</span>
              The conditional probability of observing evidence B given hypothesis A holds.
            </div>
            <div className="p-3 bg-[#141210] border border-[#292524] rounded">
              <span className="text-emerald-300 font-bold block mb-1">3. Posterior P(A | B)</span>
              The updated belief in hypothesis A after incorporating evidence B.
            </div>
            <div className="p-3 bg-[#141210] border border-[#292524] rounded">
              <span className="text-rose-300 font-bold block mb-1">4. Evidence P(B)</span>
              Total marginal probability of B across all partition hypotheses {'Σ P(B | A_k)P(A_k)'}
              .
            </div>
          </div>
        </section>

        {/* Section 5: Algorithm Pseudocode */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">05.</span>
            Algorithm Pseudocode
          </h2>
          <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg font-mono text-xs text-stone-300 space-y-2 overflow-x-auto">
            <div className="text-amber-400"># Computational Bayes Posterior Calculator</div>
            <div>
              Algorithm EvaluateBayesianPosterior(prior_P, sensitivity_TPR, specificity_TNR):
            </div>
            <div className="pl-4 text-stone-400">1. complement_prior = 1.0 - prior_P</div>
            <div className="pl-4 text-stone-400">
              2. false_positive_rate_FPR = 1.0 - specificity_TNR
            </div>
            <div className="pl-4 text-stone-400">3. numerator = sensitivity_TPR * prior_P</div>
            <div className="pl-4 text-stone-400">
              4. evidence = numerator + (false_positive_rate_FPR * complement_prior)
            </div>
            <div className="pl-4 text-stone-400">5. if evidence &lt;= 0: return 0.0</div>
            <div className="pl-4 text-stone-400">6. posterior = numerator / evidence</div>
            <div className="pl-4 text-stone-400">7. return posterior</div>
          </div>
        </section>

        {/* Section 6: Code It in Python */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">06.</span>
            Code It in Python
          </h2>
          <p className="text-stone-300 leading-relaxed">
            Below is a self-contained, dependency-free Python implementation computing the exact
            posterior probability and natural frequency breakdown,{' '}
            <span className="text-[#fef3c7] font-medium font-sans">
              verified against clinical epidemiology benchmarks
            </span>
            .
          </p>

          <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg font-mono text-xs text-stone-300 overflow-x-auto">
            <pre>{`def bayes_theorem_posterior(prior: float, sensitivity: float, specificity: float) -> float:
    """
    Computes P(Disease | Positive) given prior prevalence, sensitivity, and specificity.
    """
    fpr = 1.0 - specificity
    evidence = (sensitivity * prior) + (fpr * (1.0 - prior))
    if evidence == 0:
        return 0.0
    return (sensitivity * prior) / evidence

# Example: 1 in 1000 disease prevalence, 99% test sensitivity, 95% specificity
prior = 0.001
sens = 0.99
spec = 0.95

posterior = bayes_theorem_posterior(prior, sens, spec)
print(f"Prior Probability:     {prior * 100:.2f}%")
print(f"Test Sensitivity:      {sens * 100:.1f}%")
print(f"Test Specificity:      {spec * 100:.1f}%")
print(f"Posterior Probability: {posterior * 100:.2f}%")

# Clinical Assertion: Posterior must be ~1.94%
assert abs(posterior - 0.0194) < 0.001, "Bayes calculation mismatch!"
print("Verification Assertion Passed: Base-rate fallacy confirmed.")
`}</pre>
          </div>
        </section>

        {/* Section 7: Make It Fail */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">07.</span>
            Make It Fail: Edge Cases and Traps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#141210] border border-rose-900/40 rounded-lg space-y-2">
              <span className="text-rose-400 font-bold font-mono text-sm block">
                Trap 1: Zero Prior Dogmatism
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                If the prior is set strictly to zero ({'P(H) = 0'}), Bayes' Theorem dictates that{' '}
                {'P(H | E) = 0'} regardless of how overwhelming the experimental evidence E becomes.
                In machine learning, this is known as{' '}
                <span className="text-[#fef3c7] font-medium font-sans">Bayesian dogmatism</span>,
                where an impossible hypothesis can never be revived by data.
              </p>
            </div>

            <div className="p-4 bg-[#141210] border border-rose-900/40 rounded-lg space-y-2">
              <span className="text-rose-400 font-bold font-mono text-sm block">
                Trap 2: Base-Rate Neglect in Screening
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                Subjecting an asymptomatic low-risk population to an imperfect screening test causes
                severe harm. Even with 98% specificity, testing 1,000,000 healthy citizens generates
                20,000 false positives, leading to costly and invasive confirmatory biopsies for
                healthy patients.
              </p>
            </div>
          </div>
        </section>

        {/* Section 8: Strengths & Limitations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">08.</span>
            Strengths, Limitations & When NOT to Use
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg space-y-2">
              <span className="text-emerald-400 font-mono font-bold block text-sm">Strengths</span>
              <ul className="list-disc pl-4 space-y-1 text-stone-300">
                <li>
                  Mathematically rigorous framework for updating beliefs incrementally as new
                  evidence arrives.
                </li>
                <li>
                  Naturally handles small sample sizes by incorporating domain expertise via prior
                  distributions.
                </li>
                <li>
                  Provides calibrated probabilities rather than uncalibrated heuristic scores.
                </li>
              </ul>
            </div>
            <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg space-y-2">
              <span className="text-rose-400 font-mono font-bold block text-sm">Limitations</span>
              <ul className="list-disc pl-4 space-y-1 text-stone-300">
                <li>
                  Choosing an accurate prior is subjective and difficult when historical prevalence
                  data is unavailable.
                </li>
                <li>
                  Computing marginal evidence P(X) becomes computationally intractable in high
                  dimensions (requiring MCMC or Variational Inference).
                </li>
                <li>Sensitive to severe class imbalance if false-alarm costs are asymmetrical.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 9: Common Misconceptions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">09.</span>
            Common Misconceptions
          </h2>
          <div className="space-y-3">
            <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg">
              <span className="text-rose-400 font-mono font-semibold text-xs block mb-1">
                Misconception: "P(A | B) is the same as P(B | A)" (The Prosecutor's Fallacy)
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                The probability that an animal has four legs given that it is a cow is 100%.
                However, the probability that an animal is a cow given that it has four legs is tiny
                (dogs, cats, sheep, and horses also have four legs). Conflating {'P(A | B)'} with{' '}
                {'P(B | A)'} is a catastrophic legal and medical reasoning error.
              </p>
            </div>
          </div>
        </section>

        {/* Section 10: Check Yourself Micro-Quiz */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">10.</span>
            Check Yourself Micro-Quiz
          </h2>
          <Quiz conceptId="u4-bayes-theorem" items={quizItems} />
        </section>

        {/* Section 11: Exam & Viva Corner */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">11.</span>
            Exam & Viva Corner
          </h2>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg space-y-1">
              <span className="text-amber-400 font-bold block">
                Q1: State Bayes' Theorem and explain each term in the context of diagnostic
                classification.
              </span>
              <p className="text-stone-300 font-sans text-xs">
                Answer: Bayes' Theorem states {'P(C | X) = [ P(X | C) · P(C) ] / P(X)'}. P(C) is the
                prior probability of class C. P(X | C) is the likelihood of observing feature vector
                X in class C. P(X) is the marginal evidence computed via Law of Total Probability{' '}
                {'Σ P(X | C_k)P(C_k)'}. P(C | X) is the posterior probability that an observation
                with features X belongs to class C.
              </p>
            </div>

            <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg space-y-1">
              <span className="text-amber-400 font-bold block">
                Q2: What is the Base-Rate Fallacy and how does Bayes' Rule resolve it?
              </span>
              <p className="text-stone-300 font-sans text-xs">
                Answer: The Base-Rate Fallacy occurs when people judge the probability of an outcome
                based solely on test specificity/sensitivity while ignoring the background base rate
                (prevalence). Bayes' Rule resolves it by explicitly weighting the likelihood by the
                prior prevalence in the numerator, proving that false positives from a massive
                healthy group will dominate rare true positives.
              </p>
            </div>
          </div>
        </section>

        {/* Section 12: Summary & Key Takeaways */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">12.</span>
            Summary & Key Takeaways
          </h2>
          <div className="p-5 bg-[#141210] border border-[#292524] rounded-lg space-y-3 text-xs text-stone-300">
            <p>
              1. <strong>Prior × Likelihood = Posterior:</strong> Posterior belief is proportional
              to prior belief scaled by experimental likelihood.
            </p>
            <p>
              2. <strong>Evidence Normalizes:</strong> The denominator P(Evidence) ensures posterior
              probabilities across all classes sum to 1.0.
            </p>
            <p>
              3. <strong>Base Rates Rule:</strong> A highly accurate diagnostic test still produces
              mostly false alarms when the condition being tested is rare.
            </p>
          </div>
        </section>

        {/* Section 13: What's Next */}
        <section className="border-t border-[#292524] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            to="/learn/unit-4"
            className="text-xs font-mono text-stone-400 hover:text-white transition-colors"
          >
            ← Unit 4 Hub
          </Link>
          <Link
            to="/learn/unit-4/naive-bayes"
            className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-lg rounded-br-none hover:bg-stone-200 transition-colors font-mono"
          >
            Next: Naive Bayes Classifier →
          </Link>
        </section>
      </div>
    </div>
  );
};
