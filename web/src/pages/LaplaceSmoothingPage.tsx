import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { LaplaceSmoothingLab } from '@/labs/laplace-smoothing/LaplaceSmoothingLab';

export const LaplaceSmoothingPage: React.FC = () => {
  const quizItems = [
    {
      id: 'laplace-q1',
      question:
        'In Additive Laplace Smoothing, why is the denominator multiplied by the vocabulary size |V|: (N_ci + α) / (N_c + α · |V|)?',
      options: [
        {
          id: 'A',
          text: 'To ensure that the sum of the smoothed probabilities across all |V| possible vocabulary words equals exactly 1.0, preserving a valid probability distribution.',
          isCorrect: true,
          explanation:
            'If we add α to each of the |V| word counts in the numerator, the total added mass is α · |V|. Adding α · |V| to the denominator guarantees that Σ_i (N_ci + α) / (N_c + α·|V|) = (Σ N_ci + α·|V|) / (N_c + α·|V|) = (N_c + α·|V|) / (N_c + α·|V|) = 1.0.',
        },
        {
          id: 'B',
          text: 'Because vocabulary size represents the clock frequency of the processor.',
          isCorrect: false,
          explanation: 'It is a mathematical normalization necessity, not hardware related.',
        },
        {
          id: 'C',
          text: 'To make the probabilities sum to zero.',
          isCorrect: false,
          explanation: 'Probabilities cannot sum to zero; they must sum to 1.',
        },
      ],
    },
    {
      id: 'laplace-q2',
      question:
        'What happens to the class-conditional probability estimates P(x_i | C) as the smoothing parameter α approaches infinity (α → ∞)?',
      options: [
        {
          id: 'A',
          text: 'Every word probability approaches a uniform distribution 1 / |V|, completely washing out the empirical training counts.',
          isCorrect: true,
          explanation:
            'As α → ∞, lim (N_ci + α) / (N_c + α·|V|) = lim (α) / (α·|V|) = 1 / |V|. Heavy over-smoothing destroys the empirical signal from data.',
        },
        {
          id: 'B',
          text: 'All probabilities collapse to strictly zero.',
          isCorrect: false,
          explanation: 'They do not collapse to zero; they converge to the uniform prior 1 / |V|.',
        },
        {
          id: 'C',
          text: 'The model becomes an overfitted deep neural network.',
          isCorrect: false,
          explanation: 'Large α causes severe underfitting, not overfitting.',
        },
      ],
    },
    {
      id: 'laplace-q3',
      question:
        'When is Lidstone smoothing (0 < α < 1, such as α = 0.1 or α = 0.5) preferred over standard Laplace smoothing (α = 1)?',
      options: [
        {
          id: 'A',
          text: 'When the vocabulary size |V| is massive (e.g. 50,000 words), where setting α = 1 would add 50,000 artificial pseudo-tokens to the denominator and excessively dilute the probability of real observed words.',
          isCorrect: true,
          explanation:
            'With huge vocabularies, α = 1 inflates the denominator by |V|, overpowering small training counts N_c. Fractional α < 1 provides a milder pseudo-count that prevents zero probabilities without overwhelming empirical evidence.',
        },
        {
          id: 'B',
          text: 'Only when training on images rather than text.',
          isCorrect: false,
          explanation: 'Lidstone smoothing is predominantly used in natural language processing.',
        },
        {
          id: 'C',
          text: 'Never, because α must strictly be an integer.',
          isCorrect: false,
          explanation: 'α can be any non-negative real number.',
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
              Unit 4: Topic 3
            </Badge>
            <Badge variant="outline" className="border-sky-500/40 text-sky-300 text-xs">
              CO2 (Apply)
            </Badge>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-xs">
              CO3 (Preprocess)
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            Laplace / Additive Smoothing
          </h1>

          <p className="text-stone-400 text-base leading-relaxed max-w-3xl">
            In probabilistic modeling, zero does not mean improbable: it means mathematically
            impossible. When an unseen word appears in a test document, unsmoothed maximum
            likelihood estimation wipes out the entire joint probability. Additive smoothing injects{' '}
            <span className="text-[#fef3c7] font-medium font-sans">
              calibrated Bayesian pseudo-counts
            </span>{' '}
            to preserve numerical continuity and guarantee non-zero floors.
          </p>
        </div>

        {/* Section 1: Intuition & The Big Picture */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">01.</span>
            Intuition and the Big Picture
          </h2>
          <p className="text-stone-300 leading-relaxed">
            Suppose you observe a coin tossed 3 times, landing on Heads every single time. A naive
            maximum likelihood estimator computes {'P(Tails) = 0 / 3 = 0.0'}. Does this mean it is
            physically impossible for the coin to ever land on Tails in the future? Of course not.
            You simply have not observed enough data to witness a rare event. Pierre-Simon Laplace
            encountered this exact dilemma in the 18th century when calculating the probability that
            the sun will rise tomorrow:{' '}
            <span className="text-[#fef3c7] font-medium font-sans">the rule of succession</span>.
          </p>
          <p className="text-stone-300 leading-relaxed">
            In text classification, if a test email contains 99 spam words and 1 innocent brand-new
            technical acronym that happened to be absent from the training spam archive, multiplying
            across all features yields 0.0. The entire spam classification collapses to zero!
            Laplace smoothing solves this by pretending we have seen every possible vocabulary word
            α times before training begins.
          </p>
        </section>

        {/* Section 2: Interactive Laboratory */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">02.</span>
            Interactive Laboratory: The Smoothing Parameter Studio
          </h2>
          <p className="text-stone-300 leading-relaxed">
            Adjust the smoothing parameter α, the vocabulary size, and the class token count below.
            Observe how setting α = 0 creates the{' '}
            <span className="text-[#fef3c7] font-medium font-sans">
              zero-probability multiplication trap
            </span>
            , and how tuning α balances empirical evidence with uniform priors.
          </p>

          <LaplaceSmoothingLab />
        </section>

        {/* Section 3: Step-by-Step on Paper */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">03.</span>
            Step-by-Step on Paper
          </h2>
          <p className="text-stone-300 leading-relaxed">
            Consider a vocabulary {'|V| = 5'} words: {'{free, win, offer, meeting, bonus}'}. In the
            training Spam corpus (total tokens {'N_spam = 20'}), the word "meeting" has appeared 0
            times. Let us compute the smoothed likelihood with{' '}
            <span className="text-[#fef3c7] font-medium font-sans">Laplace smoothing (α = 1)</span>.
          </p>

          <div className="bg-[#141210] border border-[#292524] rounded-lg p-5 font-mono text-xs space-y-4">
            <div className="border-b border-[#292524] pb-2 text-amber-300 font-bold">
              STEP 1: Apply Laplace Formula for Unseen Word "meeting"
            </div>
            <div className="space-y-1 text-stone-300 pl-3">
              <div>{'P(meeting | Spam) = (N_meeting + α) / (N_spam + α · |V|)'}</div>
              <div>Numerator = 0 + 1 = 1</div>
              <div>Denominator = 20 + (1 × 5) = 25</div>
              <div>{'P(meeting | Spam) = 1 / 25 = 0.040 (4.0%)'}</div>
            </div>

            <div className="border-b border-[#292524] pb-2 text-amber-300 font-bold">
              STEP 2: Compute Smoothed Likelihood for Frequent Word "free" (Count = 10)
            </div>
            <div className="space-y-1 text-stone-300 pl-3">
              <div>Numerator = 10 + 1 = 11</div>
              <div>Denominator = 20 + (1 × 5) = 25</div>
              <div>{'P(free | Spam) = 11 / 25 = 0.440 (44.0%)'}</div>
              <div className="text-stone-500">
                (Unsmoothed was 10 / 20 = 50.0%; notice how 6% was redistributed to unseen words).
              </div>
            </div>

            <div className="border-b border-[#292524] pb-2 text-amber-300 font-bold">
              STEP 3: Verify Probability Axiom Summation
            </div>
            <div className="space-y-1 text-stone-300 pl-3">
              <div>
                Suppose counts are: free=10, win=5, offer=4, meeting=0, bonus=1 (Total = 20).
              </div>
              <div>Smoothed numerators: 11 + 6 + 5 + 1 + 2 = 25.</div>
              <div>Total Sum = 25 / 25 = 1.000.</div>
              <div className="text-emerald-400 font-bold pt-1">
                Sum across vocabulary is exactly 100%!
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
            Let {'N_c'} be the total count of tokens observed in class c, and {'N_{ci}'} be the
            count of occurrences of vocabulary word {'w_i'} in class c. The general{' '}
            <span className="text-[#fef3c7] font-medium font-sans">
              additive smoothing estimator
            </span>{' '}
            is defined as:
          </p>

          <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg text-center font-mono text-sm text-[#fef3c7]">
            {'P̂(w_i | c) = (N_{ci} + α) / (N_c + α · |V|)'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#141210] border border-[#292524] rounded">
              <span className="text-rose-400 font-bold block mb-1">α = 0 (MLE)</span>
              Maximum Likelihood Estimation. Highly prone to overfitting and zero-probability errors
              on sparse data.
            </div>
            <div className="p-3 bg-[#141210] border border-[#292524] rounded">
              <span className="text-emerald-400 font-bold block mb-1">α = 1 (Laplace)</span>
              Classic Laplace smoothing. Equivalent to placing a uniform Dirichlet prior
              Dirichlet(1, ..., 1) over vocabulary Multinomial parameters.
            </div>
            <div className="p-3 bg-[#141210] border border-[#292524] rounded">
              <span className="text-amber-400 font-bold block mb-1">
                0 &lt; α &lt; 1 (Lidstone)
              </span>
              Lidstone smoothing (e.g. α = 0.1). Preferred for massive vocabularies to avoid
              over-diluting empirical counts.
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
            <div className="text-amber-400"># Additive Smoothing Likelihood Table Generator</div>
            <div>
              Algorithm ComputeSmoothedLikelihoods(word_counts, class_totals, vocab_size, alpha):
            </div>
            <div className="pl-4 text-stone-400">1. likelihood_table = {}</div>
            <div className="pl-4 text-stone-400">2. for each class c in classes:</div>
            <div className="pl-8 text-stone-400">
              denominator = class_totals[c] + (alpha * vocab_size)
            </div>
            <div className="pl-8 text-stone-400">for each word w in vocabulary:</div>
            <div className="pl-12 text-stone-400">count = word_counts[c][w] or 0</div>
            <div className="pl-12 text-stone-400">prob = (count + alpha) / denominator</div>
            <div className="pl-12 text-stone-400">likelihood_table[c][w] = prob</div>
            <div className="pl-4 text-stone-400">3. return likelihood_table</div>
          </div>
        </section>

        {/* Section 6: Code It in Python */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">06.</span>
            Code It in Python
          </h2>
          <p className="text-stone-300 leading-relaxed">
            The Python snippet below demonstrates how Laplace smoothing seamlessly handles{' '}
            <span className="text-[#fef3c7] font-medium font-sans">
              unseen test tokens during document classification
            </span>
            .
          </p>

          <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg font-mono text-xs text-stone-300 overflow-x-auto">
            <pre>{`def smoothed_prob(count: int, class_total: int, vocab_size: int, alpha: float = 1.0) -> float:
    return (count + alpha) / (class_total + alpha * vocab_size)

vocab = ["lottery", "crypto", "free", "project", "meeting"]
vocab_size = len(vocab)
spam_counts = {"lottery": 8, "crypto": 6, "free": 10, "project": 0, "meeting": 0}
spam_total = sum(spam_counts.values()) # 24 tokens

# Test with unseen word "meeting"
p_unsmoothed = smoothed_prob(spam_counts["meeting"], spam_total, vocab_size, alpha=0.0)
p_laplace    = smoothed_prob(spam_counts["meeting"], spam_total, vocab_size, alpha=1.0)
p_lidstone   = smoothed_prob(spam_counts["meeting"], spam_total, vocab_size, alpha=0.1)

print(f"Unsmoothed (alpha=0.0): {p_unsmoothed:.4f}") # 0.0000 (Failure trap)
print(f"Laplace    (alpha=1.0): {p_laplace:.4f}")    # 1 / (24 + 5) = 0.0345
print(f"Lidstone   (alpha=0.1): {p_lidstone:.4f}")   # 0.1 / (24 + 0.5) = 0.0041

assert p_unsmoothed == 0.0
assert p_laplace > 0.03
print("Laplace assertion verified.")
`}</pre>
          </div>
        </section>

        {/* Section 7: Make It Fail */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">07.</span>
            Make It Fail: Over-Smoothing Disasters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#141210] border border-rose-900/40 rounded-lg space-y-2">
              <span className="text-rose-400 font-bold font-mono text-sm block">
                Pitfall 1: Large α Dilution on Huge Vocabularies
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                If vocabulary size {'|V| = 100,000'} and total class tokens {'N_c = 1,000'}, setting
                α = 1 inflates the denominator from 1,000 to 101,000. Even a word that appeared 100
                times now has a probability of only 101 / 101,000 ≈ 0.001, effectively{' '}
                <span className="text-[#fef3c7] font-medium font-sans">
                  drowning out the true empirical signal
                </span>
                .
              </p>
            </div>

            <div className="p-4 bg-[#141210] border border-rose-900/40 rounded-lg space-y-2">
              <span className="text-rose-400 font-bold font-mono text-sm block">
                Pitfall 2: Forgetting |V| in the Denominator
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                A common novice mistake in written exams is calculating {'(N_{ci} + 1) / (N_c + 1)'}
                . Adding 1 to the numerator for all |V| words without scaling the denominator by |V|
                causes the sum of probabilities across the vocabulary to exceed 1.0, violating
                Kolmogorov's axioms.
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
                  Zero-cost computational fix: adds a constant without changing the O(N) training
                  speed.
                </li>
                <li>
                  Guarantees strict positive probability for all words in the known vocabulary.
                </li>
                <li>
                  Grounded in Bayesian statistics as the conjugate Dirichlet prior expectation.
                </li>
              </ul>
            </div>
            <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg space-y-2">
              <span className="text-rose-400 font-mono font-bold block text-sm">Limitations</span>
              <ul className="list-disc pl-4 space-y-1 text-stone-300">
                <li>
                  Treats all unseen words equally (cannot differentiate an unseen plausible synonym
                  from an unseen typo).
                </li>
                <li>
                  Hyperparameter α requires cross-validation tuning for non-standard vocabulary
                  sizes.
                </li>
                <li>
                  More sophisticated NLP tasks prefer Good-Turing or Kneser-Ney smoothing over
                  uniform additive smoothing.
                </li>
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
                Misconception: "Laplace smoothing is only needed if training data contains zeros"
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                Even if every single vocabulary word appears at least once across the general
                training set, a word might have appeared only in Class A (Ham) and zero times in
                Class B (Spam). Laplace smoothing is required across every class individually to
                prevent conditional zeroes.
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
          <Quiz conceptId="u4-laplace-smoothing" items={quizItems} />
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
                Q1: What is the Zero-Probability Problem in Naive Bayes and how does Laplace
                correction resolve it?
              </span>
              <p className="text-stone-300 font-sans text-xs">
                Answer: The zero-probability problem occurs when a query test feature was never
                observed with a given class during training, resulting in {'P(x_i | c) = 0'}.
                Because Naive Bayes multiplies all feature probabilities, this single zero forces
                the entire class posterior to zero regardless of all other features. Laplace
                correction resolves it by adding a pseudo-count α to each count and α·|V| to the
                denominator, ensuring a strictly non-zero probability floor.
              </p>
            </div>

            <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg space-y-1">
              <span className="text-amber-400 font-bold block">
                Q2: How is Laplace smoothing interpreted from a Bayesian perspective?
              </span>
              <p className="text-stone-300 font-sans text-xs">
                Answer: From a Bayesian perspective, Laplace smoothing is equivalent to placing a
                conjugate Dirichlet prior with parameters {'α = (1, 1, ..., 1)'} over the
                multinomial distribution of vocabulary tokens. The smoothed estimate is the expected
                value of the posterior Dirichlet distribution after observing the training counts.
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
              1. <strong>Formula:</strong> {'P̂(w | c) = (N_{ci} + α) / (N_c + α·|V|)'}.
            </p>
            <p>
              2. <strong>Normalization:</strong> The {'α · |V|'} in the denominator maintains a
              valid probability distribution that sums strictly to 1.
            </p>
            <p>
              3. <strong>Tuning:</strong> When vocabulary size is massive, prefer Lidstone smoothing{' '}
              {'(α < 1)'} to prevent excessive dilution of empirical frequencies.
            </p>
          </div>
        </section>

        {/* Section 13: What's Next */}
        <section className="border-t border-[#292524] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            to="/learn/unit-4/naive-bayes"
            className="text-xs font-mono text-stone-400 hover:text-white transition-colors"
          >
            ← Previous: Naive Bayes
          </Link>
          <Link
            to="/learn/unit-4"
            className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-lg rounded-br-none hover:bg-stone-200 transition-colors font-mono"
          >
            Unit 4 Hub →
          </Link>
        </section>
      </div>
    </div>
  );
};
