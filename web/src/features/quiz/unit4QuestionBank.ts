import type { QuizItem } from './Quiz';

export const UNIT4_QUESTION_BANK: (QuizItem & {
  outcome: 'CO2' | 'CO3' | 'CO4';
  topic: string;
  bloomLevel?: 'remember' | 'understand' | 'apply' | 'analyze';
})[] = [
  // 1. Bayes' Theorem & Natural Frequencies
  {
    id: 'u4-bank-01',
    topic: "Bayes' Theorem",
    outcome: 'CO2',
    bloomLevel: 'apply',
    question:
      'In a medical screening scenario with 1% disease prevalence, 95% sensitivity (true positive rate), and 5% false positive rate, what is the posterior probability P(Disease | Positive)?',
    options: [
      {
        id: 'a',
        text: 'Approximately 16.1%, because the overwhelming majority of positive tests in a low-prevalence population come from false positives among the 99% healthy cohort (the base-rate fallacy).',
        isCorrect: true,
        explanation:
          'In a 10,000-person cohort: 100 have the disease (95 test positive) and 9,900 are healthy (495 test positive false alarms). Total positives = 95 + 495 = 590. P(Disease | Positive) = 95 / 590 ≈ 16.1%.',
      },
      {
        id: 'b',
        text: '95%, because the diagnostic test has a verified 95% sensitivity rating.',
        isCorrect: false,
        explanation:
          '95% is P(Positive | Disease), the likelihood. It ignores the prior base rate P(Disease) = 0.01.',
      },
      {
        id: 'c',
        text: '50%, because the patient either has the disease or does not.',
        isCorrect: false,
        explanation:
          'Having two outcomes does not mean they are equally probable; prior prevalence dominates.',
      },
      {
        id: 'd',
        text: '90%, which is sensitivity (95%) minus the false positive rate (5%).',
        isCorrect: false,
        explanation:
          'Probabilities cannot be subtracted linearly to compute conditional posteriors.',
      },
    ],
  },

  // 2. Bayes' Law Terms
  {
    id: 'u4-bank-02',
    topic: "Bayes' Theorem",
    outcome: 'CO2',
    bloomLevel: 'remember',
    question: 'In Bayes theorem P(A|B) = P(B|A) · P(A) / P(B), what role does P(B) represent?',
    options: [
      {
        id: 'a',
        text: 'The marginal likelihood or evidence, which acts as a normalizing constant ensuring posterior probabilities sum to 1.0 across all hypotheses.',
        isCorrect: true,
        explanation:
          'P(B) sums the joint probabilities P(B|A_i) · P(A_i) over all mutually exclusive hypotheses via the Law of Total Probability.',
      },
      {
        id: 'b',
        text: 'The prior probability of the hypothesis before collecting observations.',
        isCorrect: false,
        explanation: 'P(A) is the prior probability of hypothesis A, not P(B).',
      },
      {
        id: 'c',
        text: 'The likelihood of observing data B given hypothesis A.',
        isCorrect: false,
        explanation: 'P(B|A) is the likelihood function.',
      },
      {
        id: 'd',
        text: 'The posterior confidence in the predicted class label.',
        isCorrect: false,
        explanation: 'P(A|B) is the posterior probability.',
      },
    ],
  },

  // 3. Naive Bayes Conditional Independence
  {
    id: 'u4-bank-03',
    topic: 'Naive Bayes',
    outcome: 'CO4',
    bloomLevel: 'understand',
    question:
      'What specific "naive" assumption gives Naive Bayes its name and enables linear-time computation?',
    options: [
      {
        id: 'a',
        text: 'All input features x_1, x_2, ..., x_d are mutually conditionally independent given the class label y: P(x_1, ..., x_d | y) = ∏ P(x_i | y).',
        isCorrect: true,
        explanation:
          'This conditional independence assumption reduces the parameter complexity from exponential O(|C| · K^d) down to linear O(|C| · d · K), making inference fast even when correlations exist.',
      },
      {
        id: 'b',
        text: 'The algorithm assumes all input features are strictly normally distributed with zero mean.',
        isCorrect: false,
        explanation:
          'Only Gaussian Naive Bayes assumes normality; Multinomial and Bernoulli Naive Bayes use categorical and binary distributions.',
      },
      {
        id: 'c',
        text: 'The assumption that training labels contain zero human measurement errors.',
        isCorrect: false,
        explanation: 'Naive Bayes makes no assumptions regarding absence of label noise.',
      },
      {
        id: 'd',
        text: 'The model assumes that gradient descent will always converge in a single iteration.',
        isCorrect: false,
        explanation:
          'Naive Bayes uses closed-form counting and maximum likelihood estimation, not gradient descent.',
      },
    ],
  },

  // 4. Naive Bayes Log-Domain Computation
  {
    id: 'u4-bank-04',
    topic: 'Naive Bayes',
    outcome: 'CO2',
    bloomLevel: 'apply',
    question:
      'Why is Naive Bayes classification always implemented in the logarithmic domain: log P(y) + ∑ log P(x_i | y)?',
    options: [
      {
        id: 'a',
        text: 'Multiplying hundreds of small floating-point probabilities between 0 and 1 causes severe numerical underflow to zero in IEEE 754 floating-point hardware.',
        isCorrect: true,
        explanation:
          'For a document with 500 words, multiplying 500 probabilities of order 10^-3 yields 10^-1500, far below the double-precision floor of ~10^-308. Logarithms transform multiplication into addition.',
      },
      {
        id: 'b',
        text: 'Taking the logarithm accelerates CPU clock cycles compared to standard addition.',
        isCorrect: false,
        explanation:
          'Logarithm evaluation is computationally more demanding than basic multiplication, but essential for numerical stability.',
      },
      {
        id: 'c',
        text: 'Because Scikit-Learn algorithms only accept negative input numbers.',
        isCorrect: false,
        explanation: 'Libraries accept positive and negative floating point values alike.',
      },
      {
        id: 'd',
        text: 'To convert categorical text variables into continuous image pixels.',
        isCorrect: false,
        explanation:
          'Log-transformations protect against arithmetic underflow, not modality conversion.',
      },
    ],
  },

  // 5. Laplace Smoothing
  {
    id: 'u4-bank-05',
    topic: 'Laplace Smoothing',
    outcome: 'CO3',
    bloomLevel: 'apply',
    question:
      'In text classification, what catastrophic failure occurs if a test email contains a single novel word never observed in spam training emails, and Laplace smoothing is omitted?',
    options: [
      {
        id: 'a',
        text: 'The maximum likelihood estimate P(word | spam) = 0, causing the entire class product ∏ P(x_i | spam) to collapse to absolute zero regardless of all other spam signals.',
        isCorrect: true,
        explanation:
          'This is the Zero-Frequency Trap. A single zero multiplier erases all other evidence. Additive Laplace smoothing (alpha = 1) ensures every vocabulary token retains a positive baseline probability floor.',
      },
      {
        id: 'b',
        text: 'The model raises an unhandled floating-point division by zero exception and crashes.',
        isCorrect: false,
        explanation:
          'The division denominator is positive; the numerator is zero, leading to an answer of 0 rather than a crash.',
      },
      {
        id: 'c',
        text: 'The email is automatically classified as high-priority urgent.',
        isCorrect: false,
        explanation:
          'The model predicts the remaining non-zero class (ham) with 100% false certainty.',
      },
      {
        id: 'd',
        text: 'The vocabulary matrix inverts and reverses class probabilities.',
        isCorrect: false,
        explanation: 'No matrix inversion occurs in Naive Bayes.',
      },
    ],
  },

  // 6. Laplace Smoothing Parameter Alpha
  {
    id: 'u4-bank-06',
    topic: 'Laplace Smoothing',
    outcome: 'CO3',
    bloomLevel: 'understand',
    question:
      'What happens to the estimated word probabilities P(w_k | c) = (count(w_k, c) + α) / (total_words_c + α·|V|) as smoothing parameter α approaches infinity?',
    options: [
      {
        id: 'a',
        text: 'Probabilities converge to a completely uniform distribution: P(w_k | c) = 1 / |V| across all words in vocabulary V.',
        isCorrect: true,
        explanation:
          'As alpha -> infinity, the empirical counts become negligible compared to alpha, and (alpha) / (alpha * |V|) = 1 / |V|, representing maximum entropy / complete uncertainty.',
      },
      {
        id: 'b',
        text: 'The model achieves 100% test accuracy on unseen data.',
        isCorrect: false,
        explanation:
          'A uniform distribution ignores all empirical training evidence, yielding random guessing.',
      },
      {
        id: 'c',
        text: 'Probabilities collapse to zero for all words.',
        isCorrect: false,
        explanation: 'Probabilities must sum to 1.0; they cannot be zero everywhere.',
      },
      {
        id: 'd',
        text: 'The model becomes an Ordinary Least Squares linear regressor.',
        isCorrect: false,
        explanation:
          'Laplace smoothing is a prior pseudo-count on multinomial frequencies, unrelated to OLS.',
      },
    ],
  },

  // 7. Logistic Regression Sigmoid
  {
    id: 'u4-bank-07',
    topic: 'Logistic Regression',
    outcome: 'CO2',
    bloomLevel: 'understand',
    question:
      'In binary logistic regression, how does the sigmoid function σ(z) = 1 / (1 + e^-z) map linear score z = θᵀx̃ into probability space?',
    options: [
      {
        id: 'a',
        text: 'It smoothly squashes any real value z ∈ (-∞, +∞) into the open interval (0, 1), with σ(0) = 0.5 representing the decision boundary threshold.',
        isCorrect: true,
        explanation:
          'The sigmoid satisfies σ(-z) = 1 - σ(z) and provides continuous, differentiable probabilistic outputs with an interpretable log-odds linear link.',
      },
      {
        id: 'b',
        text: 'It truncates all negative values to exactly zero and all positive values to exactly one.',
        isCorrect: false,
        explanation:
          'That describes a hard step or threshold function, which is non-differentiable at z = 0.',
      },
      {
        id: 'c',
        text: 'It computes the square root of the residual sum of squares.',
        isCorrect: false,
        explanation: 'That describes RMSE in regression, not the sigmoid activation.',
      },
      {
        id: 'd',
        text: 'It scales features to have zero mean and unit variance.',
        isCorrect: false,
        explanation:
          'StandardScaler scales features; the sigmoid is an activation squashing function.',
      },
    ],
  },

  // 8. Logistic Regression Decision Boundary
  {
    id: 'u4-bank-08',
    topic: 'Logistic Regression',
    outcome: 'CO4',
    bloomLevel: 'analyze',
    question:
      'What geometric shape represents the decision boundary of standard logistic regression in feature space without non-linear feature expansion?',
    options: [
      {
        id: 'a',
        text: 'A flat linear hyperplane where θᵀx̃ = 0 (a straight line in 2D, a plane in 3D).',
        isCorrect: true,
        explanation:
          'Since σ(z) >= 0.5 if and only if z >= 0, the decision boundary is defined by the linear equation θ₀ + θ₁x₁ + ... + θ_d x_d = 0.',
      },
      {
        id: 'b',
        text: 'A closed hypersphere centered at the training data centroid.',
        isCorrect: false,
        explanation:
          'Hyperspherical boundaries require quadratic features (e.g. x₁² + x₂²) or RBF kernel distance models.',
      },
      {
        id: 'c',
        text: 'An axis-aligned rectilinear staircase matching decision tree splits.',
        isCorrect: false,
        explanation:
          'Decision trees produce axis-aligned boundaries; logistic regression produces an unconstrained linear hyperplane.',
      },
      {
        id: 'd',
        text: 'A non-linear Voronoi polygon enclosing each individual training point.',
        isCorrect: false,
        explanation:
          'Voronoi tessellations are produced by 1-NN instance-based models, not linear logistic regression.',
      },
    ],
  },

  // 9. Logistic Loss Optimization
  {
    id: 'u4-bank-09',
    topic: 'Logistic Regression',
    outcome: 'CO3',
    bloomLevel: 'apply',
    question:
      'Why can Ordinary Least Squares MSE loss NOT be used directly for training logistic regression models?',
    options: [
      {
        id: 'a',
        text: 'Piping the sigmoid through MSE results in a non-convex loss surface with multiple suboptimal local minima and flat plateaus where gradient descent gets trapped.',
        isCorrect: true,
        explanation:
          'Cross-entropy log-loss J(θ) = -1/m ∑ [y log(p̂) + (1-y) log(1-p̂)] guarantees strict convexity, ensuring gradient descent always converges to the unique global optimum.',
      },
      {
        id: 'b',
        text: 'Because MSE cannot be computed when predictions are between 0 and 1.',
        isCorrect: false,
        explanation:
          'MSE is mathematically computable on any real numbers, but its error surface with sigmoid is non-convex.',
      },
      {
        id: 'c',
        text: 'Because MSE always produces negative loss values.',
        isCorrect: false,
        explanation: 'Squared errors are always non-negative (>= 0).',
      },
      {
        id: 'd',
        text: 'Because Scikit-Learn prohibits the combination of regression and classification.',
        isCorrect: false,
        explanation:
          'The constraint is mathematical non-convexity, not software library limitations.',
      },
    ],
  },

  // 10. Confusion Matrix Definitions
  {
    id: 'u4-bank-10',
    topic: 'Classification Metrics',
    outcome: 'CO2',
    bloomLevel: 'remember',
    question: 'In a 2x2 binary confusion matrix, which formula correctly defines Precision?',
    options: [
      {
        id: 'a',
        text: 'Precision = True Positives / (True Positives + False Positives)',
        isCorrect: true,
        explanation:
          'Precision measures the purity of positive predictions: of all instances flagged as positive by the model, what fraction was actually positive?',
      },
      {
        id: 'b',
        text: 'Precision = True Positives / (True Positives + False Negatives)',
        isCorrect: false,
        explanation: 'That formula defines Recall (Sensitivity / True Positive Rate).',
      },
      {
        id: 'c',
        text: 'Precision = True Negatives / (True Negatives + False Positives)',
        isCorrect: false,
        explanation: 'That formula defines Specificity (True Negative Rate).',
      },
      {
        id: 'd',
        text: 'Precision = (True Positives + True Negatives) / Total Samples',
        isCorrect: false,
        explanation: 'That formula defines overall Accuracy.',
      },
    ],
  },

  // 11. Recall & Sensitivity
  {
    id: 'u4-bank-11',
    topic: 'Classification Metrics',
    outcome: 'CO2',
    bloomLevel: 'understand',
    question:
      'In designing an emergency cancer screening diagnostic model, which classification metric MUST be prioritized above all others?',
    options: [
      {
        id: 'a',
        text: 'Recall (Sensitivity), because missing a cancerous patient (False Negative) has catastrophic, life-threatening consequences, whereas a false alarm can be resolved by a follow-up biopsy.',
        isCorrect: true,
        explanation:
          'High recall minimizes False Negatives: Recall = TP / (TP + FN). In clinical screening, false negatives are far more dangerous than false positives.',
      },
      {
        id: 'b',
        text: 'Specificity, because doctors must never order follow-up tests under any circumstances.',
        isCorrect: false,
        explanation:
          'Over-prioritizing specificity increases false negatives, causing missed cancers.',
      },
      {
        id: 'c',
        text: 'Raw accuracy, because overall percentage correct is all that matters.',
        isCorrect: false,
        explanation:
          'In rare diseases (1% prevalence), a model with 99% accuracy can have 0% recall.',
      },
      {
        id: 'd',
        text: 'Execution latency, so the test finishes in under 2 milliseconds.',
        isCorrect: false,
        explanation: 'Diagnostic clinical safety supersedes microsecond latency.',
      },
    ],
  },

  // 12. F1-Score Harmonic Mean
  {
    id: 'u4-bank-12',
    topic: 'Classification Metrics',
    outcome: 'CO3',
    bloomLevel: 'apply',
    question:
      'Why is the F1-score computed as the harmonic mean 2·P·R / (P + R) rather than the simple arithmetic mean (P + R) / 2?',
    options: [
      {
        id: 'a',
        text: 'The harmonic mean punishes extreme imbalances: if either Precision or Recall collapses close to zero, the F1-score collapses to zero, preventing deceptive high scores.',
        isCorrect: true,
        explanation:
          'If Precision = 1.0 and Recall = 0.02, arithmetic mean gives (1.0 + 0.02)/2 = 51%, while harmonic mean gives 2(1)(0.02)/(1+0.02) = 3.9%, honestly reflecting model failure.',
      },
      {
        id: 'b',
        text: 'Because harmonic means can be calculated without division operations.',
        isCorrect: false,
        explanation: 'Harmonic mean requires reciprocal division.',
      },
      {
        id: 'c',
        text: 'Because international ISO standards mandate harmonic means for all metrics.',
        isCorrect: false,
        explanation:
          'The choice is rooted in mathematical conservatism under extreme class values.',
      },
      {
        id: 'd',
        text: 'To ensure the metric is always greater than 1.0.',
        isCorrect: false,
        explanation: 'F1 is strictly bounded between 0.0 and 1.0.',
      },
    ],
  },

  // 13. ROC Curve Axes
  {
    id: 'u4-bank-13',
    topic: 'ROC & AUC',
    outcome: 'CO2',
    bloomLevel: 'remember',
    question:
      'What statistical quantities are plotted on the X and Y axes of a Receiver Operating Characteristic (ROC) curve?',
    options: [
      {
        id: 'a',
        text: 'Y-axis: True Positive Rate (Sensitivity / Recall); X-axis: False Positive Rate (1 - Specificity).',
        isCorrect: true,
        explanation:
          'The ROC curve traces TPR against FPR across every continuous discrimination threshold tau from 1.0 down to 0.0.',
      },
      {
        id: 'b',
        text: 'Y-axis: Precision; X-axis: Recall.',
        isCorrect: false,
        explanation: 'That defines the Precision-Recall (PR) curve, not the ROC curve.',
      },
      {
        id: 'c',
        text: 'Y-axis: Training Loss; X-axis: Epoch iterations.',
        isCorrect: false,
        explanation: 'That is a learning / loss convergence curve.',
      },
      {
        id: 'd',
        text: 'Y-axis: Accuracy; X-axis: Model parameter count.',
        isCorrect: false,
        explanation: 'That is a model complexity scaling plot.',
      },
    ],
  },

  // 14. Area Under the ROC Curve (AUC)
  {
    id: 'u4-bank-14',
    topic: 'ROC & AUC',
    outcome: 'CO4',
    bloomLevel: 'understand',
    question:
      'What is the precise probabilistic interpretation of the Area Under the ROC Curve (ROC-AUC)?',
    options: [
      {
        id: 'a',
        text: 'The probability that the model will assign a higher predicted risk score to a randomly chosen positive sample than to a randomly chosen negative sample.',
        isCorrect: true,
        explanation:
          'ROC-AUC is mathematically equivalent to the Wilcoxon-Mann-Whitney U-statistic: P(f(x_pos) > f(x_neg)). A coin-toss classifier has AUC = 0.5; a perfect separator has AUC = 1.0.',
      },
      {
        id: 'b',
        text: 'The overall percentage of correct predictions at the default 0.5 threshold.',
        isCorrect: false,
        explanation:
          'AUC is threshold-independent; it measures ranking capability across all possible thresholds.',
      },
      {
        id: 'c',
        text: 'The optimal learning rate alpha for gradient descent.',
        isCorrect: false,
        explanation: 'AUC evaluates ranking performance, not optimization hyper-parameters.',
      },
      {
        id: 'd',
        text: 'The fraction of features that have linear correlation with the target.',
        isCorrect: false,
        explanation: 'AUC measures binary classification separability, not feature correlation.',
      },
    ],
  },

  // 15. Customer Churn Cost Matrix
  {
    id: 'u4-bank-15',
    topic: 'Customer Churn Case Study',
    outcome: 'CO3',
    bloomLevel: 'apply',
    question:
      'A telecom provider calculates that losing a customer costs $500 (c_FN), while offering an incentive retention discount costs $50 (c_FP). Under Bayes decision theory, what is the optimal threshold tau*?',
    options: [
      {
        id: 'a',
        text: 'tau* = c_FP / (c_FP + c_FN) = 50 / (50 + 500) ≈ 0.091, meaning customers with > 9.1% churn probability should receive the incentive.',
        isCorrect: true,
        explanation:
          'Because missing a churner costs 10x more than an unnecessary discount, expected financial cost is minimized by lowering the threshold aggressively to maximize recall.',
      },
      {
        id: 'b',
        text: 'tau* = 0.50, because equal probability represents neutral decision-making.',
        isCorrect: false,
        explanation:
          '0.50 assumes symmetric error costs (c_FP = c_FN), which causes severe loss when c_FN is 10x larger.',
      },
      {
        id: 'c',
        text: 'tau* = 500 / 50 = 10.0.',
        isCorrect: false,
        explanation: 'Probabilities must be bounded between 0 and 1.',
      },
      {
        id: 'd',
        text: 'tau* = 0.95, to ensure discounts are only given with near-absolute certainty.',
        isCorrect: false,
        explanation:
          'A high threshold misses almost all churners, incurring massive $500 customer loss.',
      },
    ],
  },

  // 16. k-NN Instance-Based Learning
  {
    id: 'u4-bank-16',
    topic: 'k-Nearest Neighbors',
    outcome: 'CO2',
    bloomLevel: 'understand',
    question:
      'Why is k-NN described as a "lazy learner" and what is its primary operational drawback in production systems?',
    options: [
      {
        id: 'a',
        text: 'It skips training entirely by storing all data in memory, but incurs expensive O(N · d) query latency and high RAM usage at test time.',
        isCorrect: true,
        explanation:
          'Eager models (e.g. logistic regression) compress data into compact weights θ during training, achieving O(d) instant inference. k-NN must scan the entire dataset for every test query.',
      },
      {
        id: 'b',
        text: 'It uses an adaptive learning rate that decays too slowly.',
        isCorrect: false,
        explanation: 'k-NN does not use gradient descent or learning rates.',
      },
      {
        id: 'c',
        text: 'It only operates on integer numbers.',
        isCorrect: false,
        explanation: 'k-NN operates continuously on floating point feature vectors.',
      },
      {
        id: 'd',
        text: 'It cannot be used for classification, only continuous regression.',
        isCorrect: false,
        explanation:
          'k-NN is widely used for both classification (majority vote) and regression (local mean).',
      },
    ],
  },

  // 17. Distance Metrics in k-NN
  {
    id: 'u4-bank-17',
    topic: 'k-Nearest Neighbors',
    outcome: 'CO3',
    bloomLevel: 'apply',
    question:
      'What are the geometric shapes of the unit distance isocontours for Manhattan (L1), Euclidean (L2), and Chebyshev (L∞) metrics in 2D space?',
    options: [
      {
        id: 'a',
        text: 'Manhattan: diamond (rotated square); Euclidean: circle; Chebyshev: axis-aligned square.',
        isCorrect: true,
        explanation:
          'Under Minkowski distance (∑ |x_i|^p)^(1/p), p=1 forms diamond contours |x| + |y| = 1, p=2 forms circles x² + y² = 1, and p->∞ forms squares max(|x|, |y|) = 1.',
      },
      {
        id: 'b',
        text: 'Manhattan: triangle; Euclidean: rectangle; Chebyshev: oval.',
        isCorrect: false,
        explanation: 'Norms are symmetric across all quadrants, ruling out asymmetric triangles.',
      },
      {
        id: 'c',
        text: 'All three distance metrics produce identical circular contours.',
        isCorrect: false,
        explanation: 'Different p-norms generate distinctly different geometric metric spaces.',
      },
      {
        id: 'd',
        text: 'Manhattan: straight line; Euclidean: parabolic arc; Chebyshev: hyperbolic curve.',
        isCorrect: false,
        explanation: 'Metric unit balls are closed convex figures, not open conic curves.',
      },
    ],
  },

  // 18. Curse of Dimensionality in k-NN
  {
    id: 'u4-bank-18',
    topic: 'k-Nearest Neighbors',
    outcome: 'CO4',
    bloomLevel: 'analyze',
    question:
      'What mathematical phenomenon ruins k-NN performance when the feature dimension d increases to 100+ (the Curse of Dimensionality)?',
    options: [
      {
        id: 'a',
        text: 'The relative distance ratio (d_max - d_min) / d_min contracts toward zero: all points become virtually equidistant from the query point on the outer shell of the space, destroying metric discrimination.',
        isCorrect: true,
        explanation:
          'Beyer et al. (1999) proved that under mild assumptions, the distance to the nearest neighbor approaches the distance to the farthest neighbor as d -> ∞. The concept of proximity becomes uninformative.',
      },
      {
        id: 'b',
        text: 'High dimensions cause training loss to diverge to infinity.',
        isCorrect: false,
        explanation: 'k-NN has no training loss function.',
      },
      {
        id: 'c',
        text: 'Floating point coordinates underflow to zero in 64-bit systems.',
        isCorrect: false,
        explanation:
          'Distances actually grow larger (proportional to sqrt(d)), avoiding underflow.',
      },
      {
        id: 'd',
        text: 'The number of classes automatically multiplies exponentially.',
        isCorrect: false,
        explanation:
          'Class count is an invariant target property, independent of feature dimension d.',
      },
    ],
  },

  // 19. Variational Inference Intractable Integral
  {
    id: 'u4-bank-19',
    topic: 'Variational Inference',
    outcome: 'CO4',
    bloomLevel: 'understand',
    question:
      'Why does exact Bayesian inference require approximating the posterior distribution in complex probabilistic models?',
    options: [
      {
        id: 'a',
        text: 'The marginal evidence integral p(x) = ∫ p(x, z) dz in the denominator of Bayes rule integrates over high-dimensional continuous latent space z and has no closed-form solution.',
        isCorrect: true,
        explanation:
          'Computing the joint distribution p(x, z) is straightforward, but integrating out all latent variables z is analytically impossible for complex non-conjugate models.',
      },
      {
        id: 'b',
        text: 'Because probability densities cannot exceed 1.0.',
        isCorrect: false,
        explanation:
          'Continuous probability densities can exceed 1.0 (only cumulative integrals equal 1.0).',
      },
      {
        id: 'c',
        text: 'Because gradient descent cannot be computed on continuous variables.',
        isCorrect: false,
        explanation: 'Gradient descent is designed specifically for continuous variables.',
      },
      {
        id: 'd',
        text: 'Because Bayesian models require all datasets to be smaller than 50 rows.',
        isCorrect: false,
        explanation: 'Bayesian models scale to massive datasets using Variational Inference.',
      },
    ],
  },

  // 20. Evidence Lower Bound (ELBO)
  {
    id: 'u4-bank-20',
    topic: 'Variational Inference',
    outcome: 'CO4',
    bloomLevel: 'analyze',
    question:
      'In the fundamental variational identity ln p(x) = ELBO(φ) + KL(q_φ(z) ∥ p(z|x)), why does maximizing the ELBO directly minimize the divergence between variational family q and true posterior p?',
    options: [
      {
        id: 'a',
        text: 'The marginal log evidence ln p(x) is constant with respect to variational parameters φ; because KL divergence is strictly non-negative, increasing ELBO forces KL(q ∥ p) to decrease by the exact same amount.',
        isCorrect: true,
        explanation:
          'Since ln p(x) = ELBO(φ) + KL(q ∥ p) is fixed for a given dataset x, maximizing ELBO pushes the lower bound upward, squeezing the non-negative KL divergence toward zero.',
      },
      {
        id: 'b',
        text: 'Because the ELBO can grow infinitely higher than the true evidence ln p(x).',
        isCorrect: false,
        explanation: 'By definition, the Evidence Lower Bound is bounded above by ln p(x).',
      },
      {
        id: 'c',
        text: 'Because KL divergence can become negative during gradient descent.',
        isCorrect: false,
        explanation:
          'Kullback-Leibler divergence is strictly non-negative (KL >= 0) by Gibbs inequality.',
      },
      {
        id: 'd',
        text: 'Because maximizing the ELBO deletes non-linear latent variables.',
        isCorrect: false,
        explanation:
          'ELBO optimization adjusts variational parameters φ without deleting variables.',
      },
    ],
  },
];
