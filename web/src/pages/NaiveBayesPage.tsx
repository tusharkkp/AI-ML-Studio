import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { NaiveBayesLab } from '@/labs/naive-bayes/NaiveBayesLab';

export const NaiveBayesPage: React.FC = () => {
  const quizItems = [
    {
      id: 'nb-q1',
      question:
        'What is the fundamental "naive" assumption underpinning the Naive Bayes classification algorithm?',
      options: [
        {
          id: 'A',
          text: 'All input features X_1, X_2, ..., X_d are conditionally independent given the class label Y, meaning P(X_1, ..., X_d | Y) = ∏ P(X_i | Y).',
          isCorrect: true,
          explanation:
            'The core assumption is conditional independence given class Y. It does not assume features are unconditionally independent, but rather that once the class is known, knowledge of feature X_i provides no additional information about feature X_j.',
        },
        {
          id: 'B',
          text: 'The dataset contains zero noise and zero missing values.',
          isCorrect: false,
          explanation:
            'Naive Bayes handles missing values very robustly by simply ignoring them in the likelihood product.',
        },
        {
          id: 'C',
          text: 'All features must follow a standard uniform distribution between 0 and 1.',
          isCorrect: false,
          explanation:
            'Features can be discrete (Multinomial/Categorical) or continuous (Gaussian).',
        },
      ],
    },
    {
      id: 'nb-q2',
      question:
        'Why do practical Naive Bayes implementations compute sums of logarithms rather than multiplying probabilities directly?',
      options: [
        {
          id: 'A',
          text: 'To prevent floating-point underflow: multiplying dozens or hundreds of small probabilities (e.g. 0.001) rapidly collapses IEEE 754 floats to 0.0, whereas adding log-probabilities remains numerically stable.',
          isCorrect: true,
          explanation:
            'Multiplying probabilities in [0, 1] across vocabulary sizes of 10,000 words leads to numbers smaller than 10^-300, causing underflow to zero. In log-space, log(∏ P_i) = Σ log(P_i), preserving dynamic range.',
        },
        {
          id: 'B',
          text: 'Because logarithms turn non-linear boundaries into neural networks.',
          isCorrect: false,
          explanation:
            'Logarithms are used purely for numerical precision, not non-linear representation.',
        },
        {
          id: 'C',
          text: 'Because multiplying numbers in Python is forbidden by PEP 8 standards.',
          isCorrect: false,
          explanation: 'Multiplication is valid syntax, but floating-point arithmetic underflows.',
        },
      ],
    },
    {
      id: 'nb-q3',
      question: 'What distinguishes Gaussian Naive Bayes from Multinomial Naive Bayes?',
      options: [
        {
          id: 'A',
          text: 'Gaussian Naive Bayes models continuous features by parameterizing class-conditional likelihoods with normal density functions N(x; μ_c, σ_c²), whereas Multinomial Naive Bayes models discrete counts or frequencies.',
          isCorrect: true,
          explanation:
            'For continuous sensor readings or biological metrics, Gaussian NB calculates the sample mean and variance for each class and evaluates the Gaussian probability density function.',
        },
        {
          id: 'B',
          text: 'Gaussian Naive Bayes can only be run on quantum supercomputers.',
          isCorrect: false,
          explanation:
            'Gaussian NB is extremely lightweight and runs instantaneously on standard CPUs.',
        },
        {
          id: 'C',
          text: 'Multinomial Naive Bayes is an unsupervised clustering algorithm.',
          isCorrect: false,
          explanation: 'Both models are fully supervised classifiers.',
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
              Unit 4: Topic 2
            </Badge>
            <Badge variant="outline" className="border-sky-500/40 text-sky-300 text-xs">
              CO2 (Apply)
            </Badge>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-xs">
              CO4 (Analyze)
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            Naive Bayes & Conditional Independence
          </h1>

          <p className="text-stone-400 text-base leading-relaxed max-w-3xl">
            How can an algorithm that makes an obviously false independence assumption perform so
            remarkably well on high-dimensional text classification? Naive Bayes converts complex
            joint probability distributions into{' '}
            <span className="text-[#fef3c7] font-medium font-sans">
              linear products of 1D conditional likelihoods
            </span>
            , delivering blazing fast training, low sample complexity, and robust baseline
            classification accuracy.
          </p>
        </div>

        {/* Section 1: Intuition & The Big Picture */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">01.</span>
            Intuition and the Big Picture
          </h2>
          <p className="text-stone-300 leading-relaxed">
            Suppose you want to classify emails as Spam or Legitimate (Ham) based on a vocabulary of
            10,000 words. To calculate the true exact joint probability of observing an email with a
            specific combination of 50 words, you would need to observe that exact combination of 50
            words thousands of times in past data. In reality, the number of possible word
            combinations is{' '}
            <span className="text-[#fef3c7] font-medium font-sans">
              exponentially astronomical (2^10000)
            </span>
            , meaning virtually every incoming email contains a combination of words never seen
            before in human history.
          </p>
          <p className="text-stone-300 leading-relaxed">
            Naive Bayes makes an audacious simplifying leap: it assumes that given the email is
            Spam, the probability of seeing the word "lottery" is completely independent of seeing
            the word "crypto". While linguistically false (certain words obviously co-occur), this
            assumption reduces an intractable exponential joint estimation problem into simple 1D
            frequency counting. Even when estimated probabilities are skewed, the resulting decision
            boundary often gets the ranking correct.
          </p>
        </section>

        {/* Section 2: Interactive Laboratory */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">02.</span>
            Interactive Laboratory: Spam Classification Studio
          </h2>
          <p className="text-stone-300 leading-relaxed">
            Select incoming email tokens below and watch the Naive Bayes engine decompose the
            likelihood terms. Toggle the{' '}
            <span className="text-[#fef3c7] font-medium font-sans">
              feature correlation simulator
            </span>{' '}
            to see how violating conditional independence impacts decision confidence.
          </p>

          <NaiveBayesLab />
        </section>

        {/* Section 3: Step-by-Step on Paper */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">03.</span>
            Step-by-Step on Paper
          </h2>
          <p className="text-stone-300 leading-relaxed">
            Let us walk through a university exam classification problem: classify a message with
            words {'(urgent, meeting)'} into Spam or Ham from a training corpus of 4 Spam emails and
            6 Ham emails.
          </p>

          <div className="bg-[#141210] border border-[#292524] rounded-lg p-5 font-mono text-xs space-y-4">
            <div className="border-b border-[#292524] pb-2 text-amber-300 font-bold">
              STEP 1: Compute Class Priors P(C)
            </div>
            <div className="space-y-1 text-stone-300 pl-3">
              <div>Total emails = 10. Spam = 4, Ham = 6.</div>
              <div>P(Spam) = 4 / 10 = 0.40</div>
              <div>P(Ham) = 6 / 10 = 0.60</div>
            </div>

            <div className="border-b border-[#292524] pb-2 text-amber-300 font-bold">
              STEP 2: Look up class-conditional likelihoods P(x_i | C)
            </div>
            <div className="space-y-1 text-stone-300 pl-3">
              <div>P(urgent | Spam) = 0.50, P(meeting | Spam) = 0.10</div>
              <div>P(urgent | Ham) = 0.167, P(meeting | Ham) = 0.60</div>
            </div>

            <div className="border-b border-[#292524] pb-2 text-amber-300 font-bold">
              STEP 3: Compute unnormalized posterior scores (Numerator of Bayes Rule)
            </div>
            <div className="space-y-1 text-stone-300 pl-3">
              <div>Score(Spam) = P(Spam) × P(urgent | Spam) × P(meeting | Spam)</div>
              <div>Score(Spam) = 0.40 × 0.50 × 0.10 = 0.0200</div>
              <div className="pt-1">Score(Ham) = P(Ham) × P(urgent | Ham) × P(meeting | Ham)</div>
              <div>Score(Ham) = 0.60 × 0.167 × 0.60 = 0.0601</div>
            </div>

            <div className="border-b border-[#292524] pb-2 text-amber-300 font-bold">
              STEP 4: Normalize via Evidence P(urgent, meeting)
            </div>
            <div className="space-y-1 text-stone-300 pl-3">
              <div>P(Evidence) = 0.0200 + 0.0601 = 0.0801</div>
              <div>P(Spam | words) = 0.0200 / 0.0801 ≈ 24.97%</div>
              <div>P(Ham | words) = 0.0601 / 0.0801 ≈ 75.03%</div>
              <div className="text-emerald-400 font-bold pt-1">
                Final MAP Decision: Classified as HAM (75.0% probability)
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
            Given a feature vector {'X = (x_1, x_2, ..., x_d)'} and class {'Y ∈ {c_1, ..., c_K}'},
            Bayes' Theorem states:
          </p>

          <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg text-center font-mono text-sm text-amber-200">
            {'P(Y = c | X) = [ P(X | Y = c) · P(Y = c) ] / P(X)'}
          </div>

          <p className="text-stone-300 leading-relaxed">
            By the chain rule of probability, {'P(X | Y = c)'} expands into conditional terms. Under
            the{' '}
            <span className="text-[#fef3c7] font-medium font-sans">
              class-conditional independence assumption
            </span>
            , this simplifies to the product:
          </p>

          <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg text-center font-mono text-sm text-[#fef3c7]">
            {'P(x_1, ..., x_d | Y = c) = ∏_{j=1}^d P(x_j | Y = c)'}
          </div>

          <p className="text-stone-300 leading-relaxed">
            The Maximum A Posteriori (MAP) classification rule selects the class that maximizes this
            product:
          </p>

          <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg text-center font-mono text-sm text-sky-300">
            {'ŷ = argmax_c [ log P(Y = c) + Σ_{j=1}^d log P(x_j | Y = c) ]'}
          </div>
        </section>

        {/* Section 5: Algorithm Pseudocode */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">05.</span>
            Algorithm Pseudocode
          </h2>
          <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg font-mono text-xs text-stone-300 space-y-2 overflow-x-auto">
            <div className="text-amber-400"># Naive Bayes Classifier in Log-Space</div>
            <div>Algorithm PredictNaiveBayes(query_features X, model):</div>
            <div className="pl-4 text-stone-400">1. best_score = -INFINITY</div>
            <div className="pl-4 text-stone-400">2. best_class = NULL</div>
            <div className="pl-4 text-stone-400">3. for each class c in model.classes:</div>
            <div className="pl-8 text-stone-400">log_score = log(model.prior[c])</div>
            <div className="pl-8 text-stone-400">for each (feature_j, val_j) in X:</div>
            <div className="pl-12 text-stone-400">
              log_prob = log(model.likelihood[c][feature_j][val_j])
            </div>
            <div className="pl-12 text-stone-400">log_score = log_score + log_prob</div>
            <div className="pl-8 text-stone-400">if log_score &gt; best_score:</div>
            <div className="pl-12 text-stone-400">best_score = log_score</div>
            <div className="pl-12 text-stone-400">best_class = c</div>
            <div className="pl-4 text-stone-400">4. return best_class</div>
          </div>
        </section>

        {/* Section 6: Code It in Python */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">06.</span>
            Code It in Python
          </h2>
          <p className="text-stone-300 leading-relaxed">
            Below is a clean Gaussian Naive Bayes implementation using numpy, computing exact class
            likelihoods via{' '}
            <span className="text-[#fef3c7] font-medium font-sans">
              Gaussian probability density functions
            </span>
            .
          </p>

          <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg font-mono text-xs text-stone-300 overflow-x-auto">
            <pre>{`import numpy as np

class SimpleGaussianNaiveBayes:
    def fit(self, X: np.ndarray, y: np.ndarray):
        self.classes = np.unique(y)
        self.mean = {}
        self.var = {}
        self.priors = {}
        
        for c in self.classes:
            X_c = X[y == c]
            self.mean[c] = np.mean(X_c, axis=0)
            self.var[c] = np.var(X_c, axis=0) + 1e-9  # numerical stability
            self.priors[c] = X_c.shape[0] / X.shape[0]

    def _gaussian_log_pdf(self, c, x):
        mean = self.mean[c]
        var = self.var[c]
        numerator = -((x - mean) ** 2) / (2 * var)
        denominator = -0.5 * np.log(2 * np.pi * var)
        return np.sum(numerator + denominator)

    def predict(self, X: np.ndarray) -> np.ndarray:
        preds = []
        for x in X:
            posteriors = [np.log(self.priors[c]) + self._gaussian_log_pdf(c, x) for c in self.classes]
            preds.append(self.classes[np.argmax(posteriors)])
        return np.array(preds)

# Verification Test with synthetic clusters
X_train = np.array([[1.0, 1.2], [1.1, 0.9], [8.9, 9.1], [9.2, 8.8]])
y_train = np.array([0, 0, 1, 1])

gnb = SimpleGaussianNaiveBayes()
gnb.fit(X_train, y_train)
test_pred = gnb.predict(np.array([[1.05, 1.0], [9.0, 9.0]]))
assert np.array_equal(test_pred, [0, 1]), "Gaussian NB test failed!"
print("Gaussian Naive Bayes assertion passed successfully.")
`}</pre>
          </div>
        </section>

        {/* Section 7: Make It Fail */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span className="text-amber-400 text-base">07.</span>
            Make It Fail: Redundant and Correlated Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#141210] border border-rose-900/40 rounded-lg space-y-2">
              <span className="text-rose-400 font-bold font-mono text-sm block">
                Failure Mode 1: Correlated Feature Overcounting
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                If the feature "urgent" appears 5 times under synonyms ("urgent", "immediate",
                "asap", "critical", "rush"), Naive Bayes treats each synonym as an independent piece
                of evidence,{' '}
                <span className="text-[#fef3c7] font-medium font-sans">
                  squaring and cubing the log-likelihood weight
                </span>
                , forcing extreme uncalibrated 99.999% posterior predictions.
              </p>
            </div>

            <div className="p-4 bg-[#141210] border border-rose-900/40 rounded-lg space-y-2">
              <span className="text-rose-400 font-bold font-mono text-sm block">
                Failure Mode 2: Zero-Probability Annihilation
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                If a single word in a 100-word email has never been observed in the Spam class
                during training (count = 0), the likelihood term becomes zero. In an unsmoothed
                product, this zero multiplies and obliterates all other 99 spam indicators!
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
                  Linear training time O(N · d), blazing fast on datasets with millions of
                  documents.
                </li>
                <li>
                  Performs surprisingly well on text and NLP where feature space dimensionality
                  exceeds sample size (d &gt;&gt; N).
                </li>
                <li>
                  Incremental learning: can update counts online without retraining from scratch.
                </li>
              </ul>
            </div>
            <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg space-y-2">
              <span className="text-rose-400 font-mono font-bold block text-sm">Limitations</span>
              <ul className="list-disc pl-4 space-y-1 text-stone-300">
                <li>
                  Poor probability calibration: posterior probabilities are often pushed
                  unrealistically close to 0 or 1.
                </li>
                <li>
                  Cannot capture feature interactions or XOR-like patterns without explicit feature
                  engineering.
                </li>
                <li>
                  Susceptible to zero-frequency issues when training sample vocabulary coverage is
                  sparse.
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
                Misconception: "Naive Bayes is useless because features are never truly independent
                in real life"
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                Pedro Domingos and Michael Pazzani proved that Naive Bayes remains optimal for
                classification as long as the correct class has the highest probability, even if the
                absolute probability magnitude is severely distorted by conditional dependencies.
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
          <Quiz conceptId="u4-naive-bayes" items={quizItems} />
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
                Q1: Why is Naive Bayes classified as a Generative model rather than a Discriminative
                model?
              </span>
              <p className="text-stone-300 font-sans text-xs">
                Answer: Naive Bayes models the joint probability distribution{' '}
                {'P(X, Y) = P(X | Y) · P(Y)'} by explicitly learning the probability distribution of
                the data generators for each class. Discriminative models like Logistic Regression
                directly model the posterior decision boundary {'P(Y | X)'} without modeling how
                data X is generated.
              </p>
            </div>

            <div className="p-4 bg-[#141210] border border-[#292524] rounded-lg space-y-1">
              <span className="text-amber-400 font-bold block">
                Q2: How does Naive Bayes handle continuous numeric features?
              </span>
              <p className="text-stone-300 font-sans text-xs">
                Answer: Through Gaussian Naive Bayes: continuous features within each class are
                assumed to follow a normal distribution {'N(μ, σ²)'}. The model computes the class
                mean and variance, evaluating the Gaussian probability density function for incoming
                query values.
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
              1. <strong>Conditional Independence Simplification:</strong> Reduces exponential joint
              probabilities {'P(X_1, ..., X_d | Y)'} to products of individual 1D likelihoods{' '}
              {'∏ P(X_i | Y)'}.
            </p>
            <p>
              2. <strong>Log-Domain Arithmetic:</strong> Summing logarithms prevents floating-point
              underflow and turns multiplication into fast addition.
            </p>
            <p>
              3. <strong>Classification vs Calibration:</strong> Even when conditional dependencies
              distort probability calibrations, the argmax classification boundary remains accurate.
            </p>
          </div>
        </section>

        {/* Section 13: What's Next */}
        <section className="border-t border-[#292524] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            to="/learn/unit-4/bayes-theorem"
            className="text-xs font-mono text-stone-400 hover:text-white transition-colors"
          >
            ← Previous: Bayes' Theorem
          </Link>
          <Link
            to="/learn/unit-4/laplace-smoothing"
            className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-lg rounded-br-none hover:bg-stone-200 transition-colors font-mono"
          >
            Next: Laplace Smoothing Lab →
          </Link>
        </section>
      </div>
    </div>
  );
};
