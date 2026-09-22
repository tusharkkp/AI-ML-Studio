import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { KnnLab } from '@/labs/knn/KnnLab';

export const KnnPage: React.FC = () => {
  const quizItems = [
    {
      id: 'knn-q1',
      question:
        'Why is k-Nearest Neighbors classified as a "lazy learning" or "instance-based" algorithm?',
      options: [
        {
          id: 'A',
          text: 'It performs no explicit parameter training phase: it simply stores the entire training dataset and postpones all computation until a test query is presented.',
          isCorrect: true,
          explanation:
            'Unlike eager learners (such as logistic regression or decision trees) that build a global mathematical model during training, k-NN has an O(1) training step and does all heavy lifting during inference.',
        },
        {
          id: 'B',
          text: 'Because it uses gradient descent with a learning rate so small that convergence takes many hours.',
          isCorrect: false,
          explanation:
            'k-NN does not use gradient descent or loss optimization at all. It is a non-parametric geometric distance lookup.',
        },
        {
          id: 'C',
          text: 'Because it approximates distances by rounding coordinates to the nearest whole integer.',
          isCorrect: false,
          explanation:
            'k-NN computes exact continuous metric distances (such as Euclidean or Manhattan) across floating-point coordinates.',
        },
      ],
    },
    {
      id: 'knn-q2',
      question:
        'What is the consequence of choosing a very small neighborhood size such as k = 1 in binary classification?',
      options: [
        {
          id: 'A',
          text: 'The model has high variance and is extremely sensitive to noisy training outliers, producing ragged, overfitted decision boundaries.',
          isCorrect: true,
          explanation:
            'When k=1, every single training sample creates its own Voronoi cell. Even a single mislabeled point or noisy outlier will create an isolated island of the wrong class.',
        },
        {
          id: 'B',
          text: 'The model has high bias and underfits the dataset, predicting only the global majority class.',
          isCorrect: false,
          explanation:
            'High bias occurs when k is very large (e.g. k approaching N), where local variations are smoothed out and the model votes predominantly for the majority class.',
        },
        {
          id: 'C',
          text: 'Training time increases by an order of magnitude.',
          isCorrect: false,
          explanation:
            'Training time in k-NN is always zero (storing data). Query time depends on N and d, not on the value of k.',
        },
      ],
    },
    {
      id: 'knn-q3',
      question:
        'Why is feature scaling (e.g. Min-Max normalization or Standardization) mandatory before running k-NN?',
      options: [
        {
          id: 'A',
          text: 'Distance metrics compute differences across all axes: features with large numerical magnitudes (e.g. annual salary: $80,000) will dwarf features with small magnitudes (e.g. age: 30), rendering smaller features completely ignored.',
          isCorrect: true,
          explanation:
            'In Euclidean distance sqrt((x1 - y1)^2 + (x2 - y2)^2), a difference of 5,000 in salary squared is 25,000,000, whereas an age difference of 10 squared is only 100. Without scaling, age has zero effect on neighbor selection.',
        },
        {
          id: 'B',
          text: 'Because distance metrics require all inputs to sum to exactly 1.0 like a probability distribution.',
          isCorrect: false,
          explanation:
            'Distances do not require inputs to sum to 1. Inputs simply need to reside on comparable numerical scales so that each feature contributes proportionately to distance.',
        },
        {
          id: 'C',
          text: 'Because k-NN will crash with an integer overflow if feature values exceed 255.',
          isCorrect: false,
          explanation:
            'Modern computing hardware handles standard 64-bit floating point numbers easily without overflow; the issue is metric dominance, not overflow.',
        },
      ],
    },
    {
      id: 'knn-q4',
      question:
        'According to Cover and Hart (1967), what is the asymptotic upper bound on the error rate of a 1-Nearest Neighbor classifier relative to the optimal Bayes error rate R*?',
      options: [
        {
          id: 'A',
          text: 'R* <= R_1NN <= 2 · R* · (1 - R*) <= 2 · R*, meaning 1-NN is guaranteed to have at most double the error of the theoretically best possible classifier.',
          isCorrect: true,
          explanation:
            'This famous theorem proves that as the dataset size approaches infinity, even a simple 1-NN classifier captures at least half the information in the infinite training set.',
        },
        {
          id: 'B',
          text: 'R_1NN = R* / 2, meaning 1-NN outperforms the Bayes optimal classifier.',
          isCorrect: false,
          explanation:
            'No classifier can achieve lower error than the Bayes optimal classifier by definition.',
        },
        {
          id: 'C',
          text: 'R_1NN = 0, meaning 1-NN achieves zero test error on infinite data.',
          isCorrect: false,
          explanation:
            'If classes overlap (inherent label noise / Bayes error R* > 0), no deterministic or instance-based model can achieve 0 error.',
        },
      ],
    },
  ];

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
        <Link to="/learn/unit-4" className="hover:text-foreground transition-colors">
          Unit 4
        </Link>
        <span>/</span>
        <span className="text-foreground">k-Nearest neighbors</span>
      </nav>

      {/* Hero */}
      <header className="mb-10">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline">Instance-Based Learning</Badge>
          <Badge variant="outline">Self-Study</Badge>
          <Badge variant="outline">0.8 Hours</Badge>
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          k-Nearest neighbors (k-NN)
        </h1>
        <p className="mt-3 text-lg text-neutral-400 leading-relaxed">
          The ultimate lazy learner.{' '}
          <span className="text-cream font-medium">
            k-NN skips model training entirely and lets stored memories vote at test time,
          </span>{' '}
          forming intricate non-linear decision regions through local geometric proximity.
        </p>
      </header>

      {/* 1. Intuition */}
      <section className="mb-10">
        <h2 className="section-heading">1. Intuition</h2>
        <p className="body-text">
          Imagine moving to a new neighborhood and trying to decide which political party your
          precinct favors. Rather than interviewing all citizens or formulating a nationwide
          demographic theory, you simply ask your{' '}
          <span className="text-cream font-medium">k closest neighbors</span> over the fence. If
          four out of five say they vote Green, you classify your precinct as Green.
        </p>
        <p className="body-text mt-3">
          This is the core intuition of k-NN: things that are close to each other in feature space
          typically belong to the same category. There are no weights to train, no cost functions to
          minimize, and no parameters to update via gradient descent. When a new query point
          arrives, the model measures the distance to every stored training sample, selects the k
          closest candidates, and tallies their votes.
        </p>
      </section>

      {/* 2. Interactive lab */}
      <section className="mb-10">
        <h2 className="section-heading">2. Interactive lab</h2>
        <p className="body-text mb-4">
          Drag the glowing query point across the canvas to watch vectors connect to its k nearest
          neighbors. Switch distance metrics between Euclidean (L2 circle), Manhattan (L1 diamond),
          and Chebyshev (L∞ square). Toggle the decision background to see how changing k from 1 to
          15 dramatically smooths the decision boundaries.
        </p>
        <KnnLab />
      </section>

      {/* 3. Step by step on paper */}
      <section className="mb-10">
        <h2 className="section-heading">3. Step-by-step on paper</h2>
        <div className="space-y-3 rounded-xl border border-warm-border bg-surface p-5">
          {[
            [
              'Store training data',
              'Record all training pairs (x_i, y_i) for i = 1 to N. Training time complexity is strictly O(1) in concept.',
            ],
            [
              'Receive query',
              'A new test vector q = [q1, q2, ..., qd] arrives for classification.',
            ],
            [
              'Compute distances',
              'Calculate distance d(q, x_i) for all N training points using the chosen metric (e.g. Euclidean).',
            ],
            [
              'Sort and select',
              'Order points by ascending distance and select the top k closest training points: N_k(q).',
            ],
            [
              'Tally votes',
              'Count class occurrences among the k neighbors, optionally weighting each vote by 1 / d(q, x_i).',
            ],
            [
              'Assign class',
              'Predict y_pred = argmax_c sum(w_i) for all neighbors matching class c. Break ties deterministically.',
            ],
          ].map(([step, desc], i) => (
            <div key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-bold text-brand">
                {i + 1}
              </span>
              <div>
                <span className="font-semibold text-foreground">{step}: </span>
                <span className="text-neutral-400 text-sm">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Formal math */}
      <section className="mb-10">
        <h2 className="section-heading">4. Formal mathematical foundations</h2>
        <div className="space-y-4 text-sm text-neutral-300">
          <div className="rounded-lg border border-warm-border bg-surface p-4 font-mono text-xs leading-loose">
            <div className="text-neutral-500 mb-2">// Minkowski Distance Family (L_p Norm)</div>
            <div>D_p(a, b) = ( sum_{'{i=1}'}^d |a_i - b_i|^p )^(1/p)</div>
            <div className="mt-2 text-neutral-500">// Special Cases</div>
            <div>p = 1: Manhattan L1 = sum |a_i - b_i| (diamond isocontours)</div>
            <div>p = 2: Euclidean L2 = sqrt(sum (a_i - b_i)^2) (circular isocontours)</div>
            <div>p -&gt; inf: Chebyshev L_inf = max_i |a_i - b_i| (square isocontours)</div>
            <div className="mt-2 text-neutral-500">// Unweighted Voting Rule</div>
            <div>y_hat = mode({'{ y_i : x_i in N_k(q) }'})</div>
            <div className="mt-2 text-neutral-500">// Distance-Weighted Voting Rule</div>
            <div>
              P(y = c | q) = ( sum_{'{x_i in N_k, y_i = c}'} 1 / d(q, x_i) ) / ( sum_
              {'{x_i in N_k}'} 1 / d(q, x_i) )
            </div>
            <div className="mt-2 text-neutral-500">
              // Cover and Hart Asymptotic Bound (as N approaches infinity)
            </div>
            <div>R* &lt;= R_1NN &lt;= 2 · R* · (1 - R*) &lt;= 2 · R*</div>
          </div>
          <p>
            When k = 1, the feature space is partitioned into convex polyhedral cells called a{' '}
            <span className="text-cream font-medium">Voronoi tessellation</span>. Each cell consists
            of all locations closer to one specific training point than to any other. As k
            increases, the boundaries smooth into higher-order voting contours.
          </p>
        </div>
      </section>

      {/* 5. Pseudocode */}
      <section className="mb-10">
        <h2 className="section-heading">5. Algorithm pseudocode</h2>
        <pre className="overflow-x-auto rounded-xl border border-warm-border bg-surface p-4 text-xs leading-relaxed text-neutral-300">
          {`function PredictKNN(TrainX, TrainY, queryPoint q, k, metric):
    distances ← empty list

    for i = 1 to length(TrainX):
        d ← ComputeDistance(TrainX[i], q, metric)
        distances.append( (d, TrainY[i], i) )

    // Sort ascending by distance (break ties by index)
    sort(distances by d ascending)

    // Select k nearest neighbors
    neighbors ← distances[1 .. k]

    // Tally votes
    votes ← dictionary mapping class to 0
    for each (d, label, idx) in neighbors:
        weight ← 1 / (d + 1e-6)   // or 1.0 for uniform voting
        votes[label] ← votes[label] + weight

    return class with maximum votes`}
        </pre>
      </section>

      {/* 6. Code in Python */}
      <section className="mb-10">
        <h2 className="section-heading">6. Code it in Python</h2>
        <pre className="overflow-x-auto rounded-xl border border-warm-border bg-surface p-4 text-xs leading-relaxed text-neutral-300">
          {`import numpy as np
from collections import Counter

class ScratchKNNClassifier:
    def __init__(self, k=3, metric='euclidean', weighted=False):
        self.k = k
        self.metric = metric
        self.weighted = weighted

    def fit(self, X, y):
        # Lazy training: simply store training memories
        self.X_train = np.array(X)
        self.y_train = np.array(y)
        return self

    def _distance(self, a, b):
        if self.metric == 'euclidean':
            return np.sqrt(np.sum((a - b) ** 2, axis=1))
        elif self.metric == 'manhattan':
            return np.sum(np.abs(a - b), axis=1)
        elif self.metric == 'chebyshev':
            return np.max(np.abs(a - b), axis=1)
        raise ValueError(f"Unknown metric {self.metric}")

    def predict(self, X_test):
        predictions = []
        for q in X_test:
            # Vectorized distances to all training points
            dists = self._distance(self.X_train, q)
            # Find indices of k smallest distances
            k_indices = np.argsort(dists)[:self.k]
            k_labels = self.y_train[k_indices]
            
            if not self.weighted:
                most_common = Counter(k_labels).most_common(1)[0][0]
                predictions.append(most_common)
            else:
                k_dists = dists[k_indices]
                weights = 1.0 / (k_dists + 1e-6)
                class_scores = {}
                for lbl, w in zip(k_labels, weights):
                    class_scores[lbl] = class_scores.get(lbl, 0.0) + w
                pred = max(class_scores.items(), key=lambda item: item[1])[0]
                predictions.append(pred)
                
        return np.array(predictions)

# Demonstration
X_train = np.array([[1.0, 1.0], [1.5, 2.0], [5.0, 5.0], [6.0, 5.5]])
y_train = np.array([0, 0, 1, 1])

knn = ScratchKNNClassifier(k=3).fit(X_train, y_train)
test_pts = np.array([[1.2, 1.3], [5.5, 5.1]])
print("Predictions:", knn.predict(test_pts)) # Outputs: [0, 1]`}
        </pre>
      </section>

      {/* 7. Make it fail */}
      <section className="mb-10">
        <h2 className="section-heading">7. Make it fail</h2>
        <div className="space-y-3 text-sm text-neutral-400">
          <p>
            <span className="font-semibold text-red-400">The curse of dimensionality:</span> Switch
            to the Curse of Dimensionality tab in the lab. In 100-dimensional space, the ratio
            (d_max - d_min) / d_min collapses below 0.5. All data points lie along the outer shell
            of the space at virtually identical distances, ruining metric discrimination. Remedy:
            feature selection or PCA.
          </p>
          <p>
            <span className="font-semibold text-red-400">Unscaled feature dominance:</span> If
            feature 1 is customer income ($30,000 to $150,000) and feature 2 is number of bank
            accounts (1 to 5), income differences completely overwhelm account differences. Distance
            between two customers with identical income but vastly different bank behavior will
            register as near-zero. Remedy: StandardScaler.
          </p>
          <p>
            <span className="font-semibold text-red-400">k=1 outlier islands:</span> Select the
            Outlier Trap preset. When k=1, a single corrupted measurement creates a sharp,
            artificial island of the wrong class inside an otherwise pure cluster. Remedy: choose
            odd k &gt;= 5.
          </p>
        </div>
      </section>

      {/* 8. Strengths & Limitations */}
      <section className="mb-10">
        <h2 className="section-heading">8. Strengths, limitations, and when not to use it</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-green-700/40 bg-green-900/20 p-4">
            <p className="mb-2 font-semibold text-green-300">Strengths</p>
            <ul className="space-y-1 text-sm text-neutral-300 list-disc list-inside">
              <li>Zero training time (O(1) fit phase)</li>
              <li>Naturally forms complex, non-linear decision boundaries</li>
              <li>Can handle multi-class problems directly without OvR wrappers</li>
              <li>Highly intuitive: easy to explain predictions to stakeholders</li>
              <li>Seamlessly incorporates new training examples in real-time</li>
            </ul>
          </div>
          <div className="rounded-xl border border-red-700/40 bg-red-900/20 p-4">
            <p className="mb-2 font-semibold text-red-300">Limitations and when not to use</p>
            <ul className="space-y-1 text-sm text-neutral-300 list-disc list-inside">
              <li>Slow query latency: O(N · d) computation per test point</li>
              <li>Huge memory footprint: entire training set must reside in RAM</li>
              <li>Extremely vulnerable to the curse of dimensionality</li>
              <li>Highly sensitive to irrelevant or unscaled features</li>
              <li>Poor performance on imbalanced datasets when k is large</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 9. Common Misconceptions */}
      <section className="mb-10">
        <h2 className="section-heading">9. Common misconceptions</h2>
        <div className="space-y-4">
          {[
            {
              myth: 'k-NN is computationally cheap because training takes zero time',
              truth:
                'k-NN transfers all computational cost to query time. For a dataset with 1,000,000 rows and 50 features, classifying a single query requires computing 1,000,000 50-dimensional distances.',
            },
            {
              myth: 'Larger k values are always more accurate',
              truth:
                'If k is too large, local information is lost and the model simply predicts the global majority class (high bias). The optimal k balances variance (small k) and bias (large k), typically found via cross-validation.',
            },
            {
              myth: 'k in k-NN is the same as k in k-Means',
              truth:
                'Completely different! In k-NN, k is the number of neighbor points consulted for supervised voting. In k-Means, k is the number of clusters to form in unsupervised grouping.',
            },
          ].map(({ myth, truth }) => (
            <div key={myth} className="rounded-lg border border-warm-border bg-surface p-4">
              <p className="font-semibold text-orange-300 text-sm">Myth: {myth}</p>
              <p className="mt-1 text-sm text-neutral-400">{truth}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Quiz */}
      <section className="mb-10">
        <h2 className="section-heading">10. Check yourself</h2>
        <Quiz conceptId="u4-self-knn" items={quizItems} />
      </section>

      {/* 11. Exam corner */}
      <section className="mb-10">
        <h2 className="section-heading">11. Exam and viva corner</h2>
        <div className="space-y-3">
          {[
            [
              'Why is it best practice to choose an odd value for k in binary classification?',
              'An odd k guarantees that there cannot be an exact 50-50 tie in votes between two classes, ensuring a deterministic majority outcome without needing tie-breaking heuristics.',
            ],
            [
              'What data structures can accelerate nearest neighbor queries from O(N) to O(log N)?',
              'Spatial partitioning index structures such as k-d trees (KD-Trees) and Ball Trees partition space hierarchically. While effective in low dimensions (d < 20), they degrade back to O(N) linear scan as dimension d grows due to curse of dimensionality.',
            ],
            [
              'How is k-NN adapted for continuous regression tasks?',
              'Instead of majority class voting, k-NN regression predicts the continuous mean or distance-weighted average of the target values of the k nearest neighbors: y_hat = (1 / k) * sum(y_i).',
            ],
          ].map(([q, a]) => (
            <details key={q as string} className="rounded-lg border border-warm-border bg-surface">
              <summary className="cursor-pointer p-4 text-sm font-medium text-foreground">
                {q}
              </summary>
              <div className="border-t border-warm-border px-4 pb-4 pt-3 text-sm text-neutral-400">
                {a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 12. Summary */}
      <section className="mb-10">
        <h2 className="section-heading">12. Summary and key takeaways</h2>
        <ul className="space-y-2 text-sm text-neutral-400 list-disc list-inside">
          <li>
            k-NN is a non-parametric, lazy instance-based learning algorithm with O(1) training
            time.
          </li>
          <li>
            Predictions are formed by finding the k nearest neighbors in feature space and taking a
            majority vote (classification) or mean (regression).
          </li>
          <li>
            Small k (e.g. k=1) yields low bias but high variance (overfitting); large k yields low
            variance but high bias (underfitting).
          </li>
          <li>
            Feature scaling is mandatory to prevent high-magnitude features from dominating metric
            calculations.
          </li>
          <li>
            Vulnerable to the curse of dimensionality where distance contrast collapses in high-d
            space.
          </li>
          <li>
            Cover &amp; Hart theorem guarantees 1-NN error is at most twice the optimal Bayes error
            rate.
          </li>
        </ul>
      </section>

      {/* 13. What's next */}
      <section>
        <h2 className="section-heading">13. What's next</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              to: '/case-studies/customer-churn',
              label: 'Case study: Customer churn prediction',
              desc: 'Apply k-NN alongside logistic regression in a telecom retention pipeline.',
            },
            {
              to: '/learn/unit-4/variational-inference',
              label: 'Variational inference',
              desc: 'Tackle intractable Bayesian posteriors via optimization and the ELBO.',
            },
          ].map(({ to, label, desc }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-xl border border-warm-border bg-surface p-4 transition-colors hover:border-brand/50"
            >
              <div className="font-semibold text-foreground group-hover:text-brand transition-colors">
                {label}
              </div>
              <div className="mt-1 text-sm text-neutral-500">{desc}</div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
};
