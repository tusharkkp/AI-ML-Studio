import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { LogisticRegressionLab } from '@/labs/logistic-regression/LogisticRegressionLab';

export const LogisticRegressionPage: React.FC = () => {
  const quizItems = [
    {
      id: 'lr-q1',
      question:
        'Logistic regression outputs a value between 0 and 1. What mathematical function is responsible for this squashing?',
      options: [
        {
          id: 'A',
          text: 'The sigmoid function σ(z) = 1 / (1 + e^−z), which maps any real number z to the open interval (0, 1).',
          isCorrect: true,
          explanation:
            'The sigmoid is applied to the linear combination z = θᵀx̃. Its output is interpreted as P(y=1|x; θ). The threshold τ = 0.5 corresponds to z = 0.',
        },
        {
          id: 'B',
          text: 'The softmax function, which generalises the sigmoid to K classes.',
          isCorrect: false,
          explanation:
            'Softmax is used for multi-class classification. Binary logistic regression uses the sigmoid, which is a special case of softmax for K = 2.',
        },
        {
          id: 'C',
          text: 'The ReLU (Rectified Linear Unit), which clips negative values to zero.',
          isCorrect: false,
          explanation:
            'ReLU is an activation function used in neural networks, not in logistic regression. ReLU output is unbounded above 0, so it cannot represent a probability.',
        },
      ],
    },
    {
      id: 'lr-q2',
      question:
        'What is the gradient update rule for logistic regression trained with batch gradient descent?',
      options: [
        {
          id: 'A',
          text: 'θ := θ − (α / m) · X̃ᵀ · (p̂ − y), where p̂ is the vector of sigmoid predictions, y is the true labels vector, and X̃ is the bias-augmented feature matrix.',
          isCorrect: true,
          explanation:
            'Differentiating the cross-entropy log-loss J(θ) with respect to θ yields this elegant update. The residuals (p̂ − y) form the error signal propagated back through X̃.',
        },
        {
          id: 'B',
          text: 'θ := θ − α · (Xᵀ X)⁻¹ Xᵀ y, the closed-form Normal Equation.',
          isCorrect: false,
          explanation:
            'The Normal Equation minimises the MSE for linear regression. Logistic regression uses cross-entropy loss, which has no closed-form solution -- hence iterative gradient descent.',
        },
        {
          id: 'C',
          text: 'θ := θ + α · y · x for each sample, a perceptron-style update.',
          isCorrect: false,
          explanation:
            'The perceptron update applies only when the sample is misclassified and uses hard labels 0/1. Logistic regression uses soft probabilistic residuals (p̂ − y) for all samples every iteration.',
        },
      ],
    },
    {
      id: 'lr-q3',
      question:
        'Why does logistic regression fail on the XOR classification problem without any feature transformation?',
      options: [
        {
          id: 'A',
          text: 'Logistic regression computes a linear decision boundary (a hyperplane in feature space). XOR labels alternate quadrant-wise so no single straight line can separate the two classes -- it is not linearly separable.',
          isCorrect: true,
          explanation:
            'The XOR function requires at least one non-linear boundary. Solutions include kernel transformations (e.g. polynomial features, RBF-SVM) or a multi-layer neural network with a hidden activation.',
        },
        {
          id: 'B',
          text: 'Because the learning rate α is too small to converge on XOR patterns.',
          isCorrect: false,
          explanation:
            'No learning rate will help. The issue is structural: the hypothesis class of logistic regression (linear boundaries) does not contain any function that correctly separates XOR.',
        },
        {
          id: 'C',
          text: 'Logistic regression fails because XOR has more than two output classes.',
          isCorrect: false,
          explanation:
            'XOR is a binary classification problem (output 0 or 1). The failure is due to linear inseparability, not the number of classes.',
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
        <span className="text-foreground">Logistic regression</span>
      </nav>

      {/* Hero */}
      <header className="mb-10">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline">Classification</Badge>
          <Badge variant="outline">6 Hours</Badge>
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Logistic regression
        </h1>
        <p className="mt-3 text-lg text-neutral-400 leading-relaxed">
          The workhorse of probabilistic binary classification.{' '}
          <span className="text-cream font-medium">
            A sigmoid squashes a linear score into a probability,
          </span>{' '}
          and gradient descent on cross-entropy loss tunes the weights -- no matrix inverses, no
          distribution assumptions.
        </p>
      </header>

      {/* 1. Intuition */}
      <section className="mb-10">
        <h2 className="section-heading">1. Intuition</h2>
        <p className="body-text">
          Suppose you want to predict whether a student passes an exam based on hours studied.
          Linear regression would give you a raw score that could shoot past 1 or dip below 0 --
          meaningless as a probability. Logistic regression pipes that score through the{' '}
          <span className="text-cream font-medium">sigmoid function σ(z) = 1 / (1 + e^{'-z'})</span>
          , which gently squashes any real number into (0, 1). Think of the sigmoid as a soft
          threshold: the further above zero z is, the more confidently the model says "class 1", and
          vice versa.
        </p>
        <p className="body-text mt-3">
          The boundary where the model is exactly 50-50 uncertain -- σ(z) = 0.5 -- occurs at z = 0.
          This gives us the decision boundary in feature space: the hyperplane where θᵀx̃ = 0.
          Everything on one side is classified as class 0, everything on the other as class 1.
        </p>
      </section>

      {/* 2. Interactive lab */}
      <section className="mb-10">
        <h2 className="section-heading">2. Interactive lab</h2>
        <p className="body-text mb-4">
          Click the canvas below to plant class 0 (red) and class 1 (green) points. Hit "Animate
          train" to watch gradient descent pull the orange decision boundary into place epoch by
          epoch. Switch to XOR mode to see why a single line always fails.
        </p>
        <LogisticRegressionLab />
      </section>

      {/* 3. Step by step on paper */}
      <section className="mb-10">
        <h2 className="section-heading">3. Step-by-step on paper</h2>
        <div className="space-y-3 rounded-xl border border-warm-border bg-surface p-5">
          {[
            [
              'Augment features',
              'Prepend a 1 to each input vector: x̃ = [1, x₁, x₂, …, xd]. This lets θ₀ act as the bias term without special-casing it.',
            ],
            [
              'Forward pass',
              "Compute logit z = θᵀx̃. Apply sigmoid: p̂ = σ(z). This is the model's probability estimate for class 1.",
            ],
            [
              'Loss',
              'Cross-entropy: J(θ) = -1/m Σ [yᵢ log(p̂ᵢ) + (1-yᵢ) log(1-p̂ᵢ)]. Penalises confident wrong predictions most severely.',
            ],
            [
              'Gradient',
              '∂J/∂θ = (1/m) · X̃ᵀ · (p̂ − y). Residuals (p̂ − y) measure how wrong each prediction was.',
            ],
            ['Update', 'θ := θ − α · ∇J(θ). Repeat until convergence.'],
            [
              'Predict',
              'For a new x, compute p̂ = σ(θᵀx̃). If p̂ ≥ 0.5, predict class 1; else class 0.',
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
            <div className="text-neutral-500 mb-2">// Model</div>
            <div>P(y = 1 | x; θ) = σ(θᵀx̃) = 1 / (1 + exp(-θᵀx̃))</div>
            <div className="mt-2 text-neutral-500">// Log-likelihood (maximise)</div>
            <div>ℓ(θ) = Σᵢ [ yᵢ log σ(zᵢ) + (1-yᵢ) log(1-σ(zᵢ)) ]</div>
            <div className="mt-2 text-neutral-500">// Cross-entropy loss (minimise) = -ℓ(θ)/m</div>
            <div>J(θ) = -1/m · ℓ(θ)</div>
            <div className="mt-2 text-neutral-500">// Gradient</div>
            <div>∇J(θ) = (1/m) X̃ᵀ(σ(X̃θ) − y)</div>
            <div className="mt-2 text-neutral-500">// Decision boundary</div>
            <div>θᵀx̃ = 0 ⟺ x₂ = -(θ₀ + θ₁x₁) / θ₂ [2D case]</div>
          </div>
          <p>
            The model is a member of the Generalised Linear Model (GLM) family. Its canonical link
            function is the logit: log(p / (1-p)) = θᵀx̃. The loss surface is strictly convex, so
            gradient descent always converges to the unique global minimum (assuming a finite
            optimum exists -- collinear features or perfect separation can cause divergence).
          </p>
        </div>
      </section>

      {/* 5. Pseudocode */}
      <section className="mb-10">
        <h2 className="section-heading">5. Algorithm pseudocode</h2>
        <pre className="overflow-x-auto rounded-xl border border-warm-border bg-surface p-4 text-xs leading-relaxed text-neutral-300">
          {`function TrainLogisticRegression(X, y, α, maxIter):
    m ← len(X)
    d ← len(X[0])
    X̃ ← prepend column of 1s to X       // bias trick
    θ ← zeros(d + 1)

    for iter = 1 to maxIter:
        z    ← X̃ · θ                     // (m,) logits
        p̂    ← sigmoid(z)                 // (m,) probabilities
        grad ← (1/m) · X̃ᵀ · (p̂ − y)    // (d+1,) gradient
        θ    ← θ − α · grad               // update

    return θ

function Predict(θ, x):
    x̃ ← [1] + x
    p̂ ← sigmoid(dot(θ, x̃))
    return p̂ ≥ 0.5 ? 1 : 0`}
        </pre>
      </section>

      {/* 6. Code in Python */}
      <section className="mb-10">
        <h2 className="section-heading">6. Code it in Python</h2>
        <pre className="overflow-x-auto rounded-xl border border-warm-border bg-surface p-4 text-xs leading-relaxed text-neutral-300">
          {`import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-np.clip(z, -15, 15)))

def train(X, y, alpha=0.1, max_iter=1000):
    m, d = X.shape
    Xb = np.hstack([np.ones((m, 1)), X])  # bias augment
    theta = np.zeros(d + 1)
    for _ in range(max_iter):
        p = sigmoid(Xb @ theta)
        grad = Xb.T @ (p - y) / m
        theta -= alpha * grad
    return theta

def predict(theta, X):
    m = X.shape[0]
    Xb = np.hstack([np.ones((m, 1)), X])
    return (sigmoid(Xb @ theta) >= 0.5).astype(int)

# Quick demo
X = np.array([[-2,-2],[-1,-1],[1,1],[2,2]])
y = np.array([0, 0, 1, 1])
theta = train(X, y, alpha=0.5, max_iter=2000)
print(predict(theta, X))          # [0 0 1 1]
print(f"Accuracy: {(predict(theta, X) == y).mean():.0%}")  # 100%`}
        </pre>
      </section>

      {/* 7. Make it fail */}
      <section className="mb-10">
        <h2 className="section-heading">7. Make it fail</h2>
        <div className="space-y-3 text-sm text-neutral-400">
          <p>
            <span className="font-semibold text-red-400">XOR inseparability:</span> Switch to XOR
            mode in the lab above. No matter how long you train, the linear boundary cannot
            correctly separate the four quadrants. AUC stays near 0.5. Fix: add polynomial features
            (x₁², x₂², x₁x₂) or use an RBF kernel SVM.
          </p>
          <p>
            <span className="font-semibold text-red-400">Perfect separation divergence:</span> When
            classes are completely linearly separable, the maximum-likelihood θ diverges to infinity
            (weights grow without bound). The log-loss can always be reduced further by scaling θ.
            Fix: add L2 regularisation (Ridge penalty λ‖θ‖²) to bound the weights.
          </p>
          <p>
            <span className="font-semibold text-red-400">Learning rate too large:</span> Set α very
            high (e.g. 2.0) and watch the loss oscillate or diverge rather than decrease. Fix:
            reduce α, or use an adaptive optimiser like Adam.
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
              <li>Outputs calibrated probabilities, not just class labels</li>
              <li>Computationally efficient -- O(m·d) per iteration</li>
              <li>Highly interpretable: log-odds interpretation of θ</li>
              <li>Robust baseline for binary problems</li>
              <li>No distributional assumptions on features (unlike Naive Bayes)</li>
            </ul>
          </div>
          <div className="rounded-xl border border-red-700/40 bg-red-900/20 p-4">
            <p className="mb-2 font-semibold text-red-300">Limitations and when not to use</p>
            <ul className="space-y-1 text-sm text-neutral-300 list-disc list-inside">
              <li>Linear decision boundary -- fails on XOR, spirals, rings</li>
              <li>Sensitive to correlated features (multicollinearity)</li>
              <li>Requires feature scaling for fast convergence</li>
              <li>Not natively multi-class (needs OvR or softmax extension)</li>
              <li>Weak when features interact non-linearly without feature engineering</li>
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
              myth: 'Logistic regression is a regression algorithm',
              truth:
                'Despite the name, logistic regression is a classification model. It regresses a linear combination of features onto the log-odds scale, but the output is a class probability, not a continuous value.',
            },
            {
              myth: 'A higher learning rate always trains faster',
              truth:
                'If α is too large, gradient descent overshoots the minimum and the loss diverges. The optimal α depends on the data scale and feature magnitudes. Always normalise features first.',
            },
            {
              myth: 'The decision boundary is always at p = 0.5',
              truth:
                'p = 0.5 is the default threshold. In practice you tune τ depending on the cost of false positives vs false negatives. A medical screening model might use τ = 0.2 to maximise recall at the cost of more false alarms.',
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
        <Quiz conceptId="u4-logistic-regression" items={quizItems} />
      </section>

      {/* 11. Exam corner */}
      <section className="mb-10">
        <h2 className="section-heading">11. Exam and viva corner</h2>
        <div className="space-y-3">
          {[
            [
              'Derive the gradient of cross-entropy loss for logistic regression.',
              'Differentiate J(θ) = -1/m Σ [yᵢ log σ(zᵢ) + (1-yᵢ) log(1-σ(zᵢ))]. Use chain rule: ∂J/∂θ = (1/m) X̃ᵀ(p̂ - y). Key insight: the σ and log cancel beautifully, yielding a linear residual.',
            ],
            [
              'What is the log-odds interpretation of logistic regression coefficients?',
              'log(p/(1-p)) = θᵀx̃. A unit increase in xⱼ multiplies the odds by e^{θⱼ}. This is the basis of odds-ratio reporting in epidemiology.',
            ],
            [
              'When would you prefer logistic regression over a neural network?',
              'When you need probability calibration, interpretability, fast training, or a strong baseline. Neural networks need more data and compute, and their outputs are less naturally calibrated.',
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
            Logistic regression models P(y=1|x) = σ(θᵀx̃), mapping linear scores to probabilities via
            sigmoid.
          </li>
          <li>
            Trained by minimising cross-entropy loss with batch gradient descent: θ := θ - (α/m)
            X̃ᵀ(p̂-y).
          </li>
          <li>
            The decision boundary is a hyperplane where θᵀx̃ = 0 -- logistic regression is a linear
            classifier.
          </li>
          <li>Fails on non-linearly separable problems (XOR) without feature transformation.</li>
          <li>
            Perfect separation causes weight divergence; L2 regularisation (logistic with Ridge) is
            the fix.
          </li>
          <li>Outputs are naturally interpretable as probabilities and log-odds.</li>
        </ul>
      </section>

      {/* 13. What's next */}
      <section>
        <h2 className="section-heading">13. What's next</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              to: '/learn/unit-4/classification-metrics',
              label: 'Classification metrics',
              desc: 'Accuracy, precision, recall, F1, MCC -- evaluating your logistic model.',
            },
            {
              to: '/learn/unit-4/roc-auc',
              label: 'ROC curve and AUC',
              desc: 'Sweep the decision threshold and trace the tradeoff curve.',
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
