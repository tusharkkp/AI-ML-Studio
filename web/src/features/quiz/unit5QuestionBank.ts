import type { QuizItem } from './Quiz';

export const UNIT5_QUESTION_BANK: (QuizItem & {
  outcome: 'CO2' | 'CO3' | 'CO4';
  topic: string;
  bloomLevel?: 'remember' | 'understand' | 'apply' | 'analyze';
})[] = [
  // 1. Decision Tree Splitting & Impurity Measures
  {
    id: 'u5-bank-01',
    topic: 'Impurity Measures',
    outcome: 'CO2',
    bloomLevel: 'apply',
    question:
      'A candidate binary split partitions a node of 100 samples (50 positive, 50 negative) into a left child of 40 samples (40 positive, 0 negative) and a right child of 60 samples (10 positive, 50 negative). What is the Gini impurity of the left child, and what does it indicate?',
    options: [
      {
        id: 'a',
        text: 'Gini = 0.0, indicating the left child is perfectly pure (contains instances of only one class).',
        isCorrect: true,
        explanation:
          'Gini = 1 - sum(p_i^2). In the left child, p_pos = 40/40 = 1.0 and p_neg = 0/40 = 0.0. Gini = 1 - (1.0^2 + 0.0^2) = 0.0, representing maximum possible purity.',
      },
      {
        id: 'b',
        text: 'Gini = 0.5, because 50% of the overall dataset was positive.',
        isCorrect: false,
        explanation: '0.5 is the Gini impurity of the parent node, not the pure left child.',
      },
      {
        id: 'c',
        text: 'Gini = 1.0, indicating maximum entropy.',
        isCorrect: false,
        explanation:
          'For binary classification, Gini impurity is bounded in [0.0, 0.5]. It never reaches 1.0.',
      },
      {
        id: 'd',
        text: 'Gini = 0.40, equal to the proportion of samples routed left.',
        isCorrect: false,
        explanation:
          'Sample partition proportions are used to weight children impurities, not calculate internal node impurity.',
      },
    ],
  },

  // 2. Information Gain vs Gini Impurity
  {
    id: 'u5-bank-02',
    topic: 'Impurity Measures',
    outcome: 'CO2',
    bloomLevel: 'understand',
    question:
      'What is the computational trade-off between Information Gain (Entropy) and Gini Impurity during tree induction?',
    options: [
      {
        id: 'a',
        text: 'Gini Impurity computes purely with basic arithmetic (1 - sum p_i^2), whereas Shannon Entropy requires computationally expensive natural logarithms (sum -p_i log_2 p_i); both typically yield identical tree topologies.',
        isCorrect: true,
        explanation:
          'Logarithmic evaluations across thousands of candidate feature splits significantly slow down tree construction. Gini serves as a fast first-order Taylor approximation to entropy without logarithmic overhead.',
      },
      {
        id: 'b',
        text: 'Entropy produces strictly binary trees while Gini produces multiway trees.',
        isCorrect: false,
        explanation:
          'Tree branch factor depends on the algorithm implementation (e.g. CART vs ID3), not the impurity formula.',
      },
      {
        id: 'c',
        text: 'Gini impurity can only be calculated on binary classification tasks.',
        isCorrect: false,
        explanation:
          'Gini impurity naturally extends to multi-class problems: 1 - sum_{k=1}^K p_k^2.',
      },
      {
        id: 'd',
        text: 'Information Gain is bounded between 0 and 0.5, whereas Gini is unbounded.',
        isCorrect: false,
        explanation: 'Entropy is bounded by log_2(K), whereas binary Gini is bounded by 0.5.',
      },
    ],
  },

  // 3. Tree Pruning & Cost-Complexity
  {
    id: 'u5-bank-03',
    topic: 'Tree Pruning',
    outcome: 'CO3',
    bloomLevel: 'analyze',
    question:
      'In minimal cost-complexity pruning (Breiman CART), how does the parameter alpha penalize tree size in the cost function R_alpha(T) = R(T) + alpha * |T|?',
    options: [
      {
        id: 'a',
        text: 'When alpha = 0, the unpruned maximal tree minimizes training error; as alpha increases, larger subtrees with marginal training gains are collapsed first, balancing bias and variance.',
        isCorrect: true,
        explanation:
          'R(T) measures training misclassification cost, while alpha * |T| penalizes the number of terminal leaves |T|. As alpha increases, the penalty forces smaller, simpler subtrees with superior test set generalization.',
      },
      {
        id: 'b',
        text: 'Alpha adjusts the learning rate of the gradient descent optimizer.',
        isCorrect: false,
        explanation:
          'Decision trees do not use gradient descent; alpha is a structural regularization penalty on leaf count.',
      },
      {
        id: 'c',
        text: 'Alpha sets the maximum depth threshold prior to tree construction.',
        isCorrect: false,
        explanation:
          'Setting maximum depth before construction is pre-pruning; cost-complexity pruning is a post-pruning technique.',
      },
      {
        id: 'd',
        text: 'Higher alpha values expand tree depth to eliminate remaining training error.',
        isCorrect: false,
        explanation: 'Higher alpha strictly shrinks tree size by penalizing leaf count.',
      },
    ],
  },

  // 4. SVM Geometric Margin
  {
    id: 'u5-bank-04',
    topic: 'SVM Fundamentals',
    outcome: 'CO2',
    bloomLevel: 'apply',
    question:
      'For a linearly separable dataset with separating hyperplane w^T x + b = 0, what is the geometric width of the margin between the two bounding canonical hyperplanes w^T x + b = +1 and w^T x + b = -1?',
    options: [
      {
        id: 'a',
        text: 'gamma = 2 / ||w||_2',
        isCorrect: true,
        explanation:
          'The orthogonal distance from any point on w^T x + b = 1 to w^T x + b = -1 is (1 - (-1)) / ||w|| = 2 / ||w||. Maximizing margin 2 / ||w|| is equivalent to minimizing 0.5 * ||w||^2.',
      },
      {
        id: 'b',
        text: 'gamma = ||w||_2 / 2',
        isCorrect: false,
        explanation:
          'The margin is inversely proportional to the norm of the weight vector, not directly proportional.',
      },
      {
        id: 'c',
        text: 'gamma = 1 / ||w||_2^2',
        isCorrect: false,
        explanation:
          'The squared norm appears in the convex quadratic objective function, not the geometric distance.',
      },
      {
        id: 'd',
        text: 'gamma = 2 * ||w||_2',
        isCorrect: false,
        explanation:
          'A larger weight vector norm shrinks the margin width, which is why we minimize ||w||.',
      },
    ],
  },

  // 5. Support Vectors Definition
  {
    id: 'u5-bank-05',
    topic: 'SVM Fundamentals',
    outcome: 'CO2',
    bloomLevel: 'understand',
    question:
      'Which training samples determine the position and orientation of the optimal separating hyperplane in a hard-margin SVM?',
    options: [
      {
        id: 'a',
        text: 'Only the support vectors that lie exactly on the canonical margin gutters (where y_i(w^T x_i + b) = 1 and Lagrange multipliers alpha_i > 0); removing all other non-boundary points changes nothing.',
        isCorrect: true,
        explanation:
          'By the Karush-Kuhn-Tucker (KKT) complementary slackness conditions, points outside the margin have alpha_i = 0 and exert zero influence on the decision boundary w = sum alpha_i y_i x_i.',
      },
      {
        id: 'b',
        text: 'All training samples contribute equally via their distance to the centroid.',
        isCorrect: false,
        explanation:
          'This describes centroid nearest-neighbor classifiers, not support vector machines.',
      },
      {
        id: 'c',
        text: 'Only the samples furthest from the decision boundary.',
        isCorrect: false,
        explanation:
          'Points far from the boundary have alpha_i = 0 and zero impact on the hyperplane.',
      },
      {
        id: 'd',
        text: 'The support vectors are determined by the first five rows in the training matrix.',
        isCorrect: false,
        explanation:
          'Support vectors are identified via global quadratic programming optimization, not row index.',
      },
    ],
  },

  // 6. Soft-Margin SVM & Slack Variables
  {
    id: 'u5-bank-06',
    topic: 'SVM Fundamentals',
    outcome: 'CO3',
    bloomLevel: 'analyze',
    question:
      'In soft-margin SVM, what does a slack variable value of xi_i > 1 indicate for a training sample (x_i, y_i)?',
    options: [
      {
        id: 'a',
        text: 'The sample has crossed over the decision boundary and is actively misclassified by the hyperplane.',
        isCorrect: true,
        explanation:
          'xi_i = 0 means the point is on or beyond the correct margin gutter; 0 < xi_i <= 1 means the point is inside the margin but correctly classified; xi_i > 1 means the point has crossed the decision boundary (misclassified).',
      },
      {
        id: 'b',
        text: 'The sample is correctly classified outside the margin gutter.',
        isCorrect: false,
        explanation: 'Points outside the margin gutter have slack xi_i = 0.',
      },
      {
        id: 'c',
        text: 'The sample has an infinite Lagrange multiplier.',
        isCorrect: false,
        explanation:
          'Lagrange multipliers in soft-margin SVM are bounded by the box constraint 0 <= alpha_i <= C.',
      },
      {
        id: 'd',
        text: 'The sample is an exact support vector lying on the gutter.',
        isCorrect: false,
        explanation: 'Points on the margin gutter have xi_i = 0.',
      },
    ],
  },

  // 7. SVM Hyperparameter C
  {
    id: 'u5-bank-07',
    topic: 'SVM Fundamentals',
    outcome: 'CO3',
    bloomLevel: 'apply',
    question:
      'How does tuning the regularization hyperparameter C in soft-margin SVM affect the bias-variance trade-off?',
    options: [
      {
        id: 'a',
        text: 'A very large C heavily penalizes slack violations, creating a narrow hard margin that risks overfitting (high variance); a small C tolerates margin intrusions, widening the margin and increasing regularization (high bias).',
        isCorrect: true,
        explanation:
          'The objective minimizes 0.5 * ||w||^2 + C * sum xi_i. As C -> infinity, any slack penalty is unacceptable, recovering the strict hard-margin SVM. Small C prioritizes a wide, simple margin over individual point violations.',
      },
      {
        id: 'b',
        text: 'Large C widens the margin to prevent overfitting.',
        isCorrect: false,
        explanation:
          'Large C forces the margin to shrink to avoid slack violations, which increases variance.',
      },
      {
        id: 'c',
        text: 'C controls the polynomial degree of the kernel function.',
        isCorrect: false,
        explanation:
          'Polynomial degree is parameter d; C is the penalty multiplier on slack variables.',
      },
      {
        id: 'd',
        text: 'C has zero effect when using non-linear kernels.',
        isCorrect: false,
        explanation:
          'C regularizes slack penalties regardless of whether linear, polynomial, or RBF kernels are used.',
      },
    ],
  },

  // 8. The Kernel Trick & Mercer Condition
  {
    id: 'u5-bank-08',
    topic: 'SVM Kernels',
    outcome: 'CO2',
    bloomLevel: 'understand',
    question:
      'What is the fundamental mathematical essence of the "Kernel Trick" in Support Vector Machines?',
    options: [
      {
        id: 'a',
        text: 'It computes inner products in high-dimensional Hilbert spaces directly via a kernel function K(x, z) = phi(x)^T phi(z), without ever explicitly computing or storing the high-dimensional transformed coordinates phi(x).',
        isCorrect: true,
        explanation:
          'The dual formulation of SVM depends only on inner products x_i^T x_j. Replacing inner products with Mercer-compliant kernel functions allows non-linear classification in infinite dimensions (e.g. RBF) at O(d) computational cost.',
      },
      {
        id: 'b',
        text: 'It transforms non-linear problems into neural networks with backpropagation.',
        isCorrect: false,
        explanation:
          'SVM kernels solve a convex quadratic programming problem, not backpropagation on neural networks.',
      },
      {
        id: 'c',
        text: 'It clusters similar points together using unsupervised k-means.',
        isCorrect: false,
        explanation: 'SVM is a supervised maximum-margin classifier.',
      },
      {
        id: 'd',
        text: 'It normalizes feature values to have zero mean and unit variance.',
        isCorrect: false,
        explanation: 'Feature standardization is a preprocessing step, not the kernel trick.',
      },
    ],
  },

  // 9. RBF (Gaussian) Kernel Hyperparameter Gamma
  {
    id: 'u5-bank-09',
    topic: 'SVM Kernels',
    outcome: 'CO3',
    bloomLevel: 'apply',
    question:
      'In an RBF kernel K(x, z) = exp(-gamma * ||x - z||^2), what is the geometric consequence of setting gamma to an excessively large value?',
    options: [
      {
        id: 'a',
        text: 'The radius of influence of each support vector contracts to a narrow isolated spike around individual training points, causing extreme overfitting and island-like decision boundaries.',
        isCorrect: true,
        explanation:
          'Gamma = 1 / (2 * sigma^2). A massive gamma implies an infinitesimal bell-curve width sigma. Each training instance creates a sharp local peak, failing to interpolate smoothly across the space.',
      },
      {
        id: 'b',
        text: 'The decision boundary degenerates into a flat linear hyperplane.',
        isCorrect: false,
        explanation:
          'Linear boundaries occur when gamma approaches zero (infinitely wide bell curves), not when gamma is large.',
      },
      {
        id: 'c',
        text: 'The kernel matrix becomes singular and non-invertible.',
        isCorrect: false,
        explanation: 'RBF kernel Gram matrices are strictly positive definite by Mercer theorem.',
      },
      {
        id: 'd',
        text: 'The algorithm converts into an unsupervised clustering tree.',
        isCorrect: false,
        explanation:
          'SVM remains a supervised margin classifier regardless of gamma parameterization.',
      },
    ],
  },

  // 10. Condorcet Jury Theorem
  {
    id: 'u5-bank-10',
    topic: 'Ensemble Learning',
    outcome: 'CO2',
    bloomLevel: 'understand',
    question:
      'According to the Condorcet Jury Theorem, under what conditions does an ensemble majority vote asymptotically reach 100% decision accuracy as the number of classifiers M -> infinity?',
    options: [
      {
        id: 'a',
        text: 'Each individual classifier must perform strictly better than random guessing (p > 0.50) and their classification errors must be statistically independent (zero correlation rho = 0).',
        isCorrect: true,
        explanation:
          'The probability of majority correctness follows a binomial CDF sum. If p > 0.5 and errors are independent, the law of large numbers drives majority error to zero as M grows.',
      },
      {
        id: 'b',
        text: 'All classifiers must be trained on the exact same dataset using identical random seeds.',
        isCorrect: false,
        explanation:
          'Identical models produce identical errors (rho = 1), causing the ensemble error to match the individual error with zero benefit.',
      },
      {
        id: 'c',
        text: 'The individual classifiers must all achieve at least 95% individual accuracy.',
        isCorrect: false,
        explanation:
          'The theorem requires only p > 0.50 (slightly better than a coin flip), not 95%.',
      },
      {
        id: 'd',
        text: 'The models must be linear regression regressors.',
        isCorrect: false,
        explanation:
          'The Condorcet Jury Theorem is formulated for binary majority voting decisions.',
      },
    ],
  },

  // 11. Krogh-Vedelsby Ambiguity Decomposition
  {
    id: 'u5-bank-11',
    topic: 'Ensemble Learning',
    outcome: 'CO4',
    bloomLevel: 'analyze',
    question:
      'State the Krogh and Vedelsby (1995) ensemble ambiguity identity for regression ensembles:',
    options: [
      {
        id: 'a',
        text: 'Ensemble Error = Mean Individual Error - Ensemble Diversity (Ambiguity), proving that the ensemble error is always strictly less than or equal to the weighted average error of its constituents.',
        isCorrect: true,
        explanation:
          'E_ens = bar{E} - bar{A}, where bar{A} = sum w_m (f_m - f_ens)^2 >= 0. Because ambiguity is quadratic and strictly non-negative, the ensemble error can never exceed the average individual model error.',
      },
      {
        id: 'b',
        text: 'Ensemble Error = Mean Individual Error + Ensemble Variance.',
        isCorrect: false,
        explanation:
          'Ensemble diversity subtracts from the individual error, reducing total error.',
      },
      {
        id: 'c',
        text: 'Ensemble Error = Total Bias / Number of Estimators.',
        isCorrect: false,
        explanation:
          'Ensemble error combines individual errors minus ensemble variance across predictions.',
      },
      {
        id: 'd',
        text: 'Ensemble Error is mathematically independent of model disagreement.',
        isCorrect: false,
        explanation:
          'Model disagreement (ambiguity) is the exact mathematical driver of ensemble error reduction.',
      },
    ],
  },

  // 12. Bagging & Bootstrap Sampling
  {
    id: 'u5-bank-12',
    topic: 'Bagging & Random Forests',
    outcome: 'CO3',
    bloomLevel: 'apply',
    question:
      'When drawing N bootstrap samples with replacement from a training dataset of size N, what expected proportion of unique training observations are excluded from any given bootstrap set (the Out-of-Bag fraction)?',
    options: [
      {
        id: 'a',
        text: 'Approximately 36.8% (1 / e), because the probability of never being chosen in N independent draws is (1 - 1/N)^N -> e^(-1) ≈ 0.3679 as N -> infinity.',
        isCorrect: true,
        explanation:
          'Each draw excludes a sample with probability (1 - 1/N). Across N draws, the compound probability is (1 - 1/N)^N, which converges asymptotically to 1/e ≈ 36.8%. The remaining 63.2% form the bootstrap sample.',
      },
      {
        id: 'b',
        text: 'Exactly 50.0%, because each sample has an equal chance of being selected or omitted.',
        isCorrect: false,
        explanation:
          'With replacement, the same instance can be selected multiple times, so the omitted fraction is ~36.8%, not 50%.',
      },
      {
        id: 'c',
        text: 'Zero percent, because all samples are included in bootstrap aggregation.',
        isCorrect: false,
        explanation: 'Drawing with replacement omits roughly one-third of samples on every round.',
      },
      {
        id: 'd',
        text: '10.0%, matching the standard 10-fold cross-validation holdout size.',
        isCorrect: false,
        explanation:
          'Cross-validation splits without replacement; bootstrap sampling with replacement yields ~36.8% out-of-bag samples.',
      },
    ],
  },

  // 13. Random Forest Feature Subspace Sampling
  {
    id: 'u5-bank-13',
    topic: 'Bagging & Random Forests',
    outcome: 'CO3',
    bloomLevel: 'understand',
    question:
      'Why does Random Forest randomly select a subset of m ≈ sqrt(d) features at every split, rather than considering all d features like standard Bagging?',
    options: [
      {
        id: 'a',
        text: 'To decorrelate the trees: if a few dominant features exist, standard Bagging trees all choose the same top split, producing highly correlated trees whose average fails to reduce variance.',
        isCorrect: true,
        explanation:
          'Ensemble variance is Var = rho * sigma^2 + ((1-rho)/B) * sigma^2. Random subspace sampling forces trees to explore secondary features, depressing pairwise correlation rho and maximizing ensemble variance reduction.',
      },
      {
        id: 'b',
        text: 'To reduce the dataset memory size for GPU acceleration.',
        isCorrect: false,
        explanation:
          'Subspace sampling is a statistical variance-reduction mechanism, not a GPU memory-saving trick.',
      },
      {
        id: 'c',
        text: 'To allow trees to compute negative entropy values.',
        isCorrect: false,
        explanation: 'Entropy is non-negative; feature sampling has no impact on entropy sign.',
      },
      {
        id: 'd',
        text: 'To transform non-linear trees into linear regressors.',
        isCorrect: false,
        explanation: 'Random Forests remain non-linear partition ensembles.',
      },
    ],
  },

  // 14. AdaBoost Classifier Weight Alpha
  {
    id: 'u5-bank-14',
    topic: 'Boosting & Stacking',
    outcome: 'CO3',
    bloomLevel: 'apply',
    question:
      'In Freund & Schapire AdaBoost.M1, if weak learner h_t produces weighted error rate eps_t = 0.10, what is its voting weight alpha_t?',
    options: [
      {
        id: 'a',
        text: 'alpha_t = 0.5 * ln((1 - 0.10) / 0.10) = 0.5 * ln(9) ≈ 1.0986',
        isCorrect: true,
        explanation:
          'alpha_t = 0.5 * ln((1 - eps_t) / eps_t). With eps_t = 0.10, the ratio is 0.90 / 0.10 = 9. 0.5 * ln(9) = 0.5 * 2.1972 = 1.0986.',
      },
      {
        id: 'b',
        text: 'alpha_t = 0.10 / 0.90 = 0.1111',
        isCorrect: false,
        explanation: 'Alpha uses the natural logarithm of the odds ratio, not raw division.',
      },
      {
        id: 'c',
        text: 'alpha_t = 0.50, because error is below 0.5.',
        isCorrect: false,
        explanation: 'Alpha is a continuous logarithmic function of error, not a fixed constant.',
      },
      {
        id: 'd',
        text: 'alpha_t = -1.0986, indicating negative polarity.',
        isCorrect: false,
        explanation: 'When eps_t < 0.5, (1 - eps)/eps > 1, so ln is positive and alpha_t > 0.',
      },
    ],
  },

  // 15. Stacking Generalization & Leakage
  {
    id: 'u5-bank-15',
    topic: 'Boosting & Stacking',
    outcome: 'CO4',
    bloomLevel: 'analyze',
    question:
      'When training a Wolpert Stacking meta-model, why MUST the meta-features be generated using out-of-fold cross-validation predictions rather than in-sample training predictions of the base models?',
    options: [
      {
        id: 'a',
        text: 'To avoid catastrophic target leakage: base models severely overfit in-sample data, and a meta-model trained on optimistic in-sample predictions fails to generalize to unseen test instances.',
        isCorrect: true,
        explanation:
          'If base models generate predictions on the exact data they trained on, complex models (e.g. deep trees) output near 100% accuracy. The meta-learner blindly over-weights the overfitted model, causing total test generalization collapse.',
      },
      {
        id: 'b',
        text: 'Because scikit-learn throws an execution error if in-sample features are passed to a meta-model.',
        isCorrect: false,
        explanation:
          'Scikit-learn will execute in-sample stacking without error, but the resulting model will suffer severe test degradation.',
      },
      {
        id: 'c',
        text: 'To ensure all base models use identical hyperparameter configurations.',
        isCorrect: false,
        explanation: 'Stacking encourages heterogeneous base models with diverse configurations.',
      },
      {
        id: 'd',
        text: 'Out-of-fold cross-validation converts classification tasks into regression.',
        isCorrect: false,
        explanation:
          'Out-of-fold CV preserves the original prediction format (probabilities or class labels).',
      },
    ],
  },

  // 16. Brier Score Calibration
  {
    id: 'u5-bank-16',
    topic: 'Model Evaluation',
    outcome: 'CO4',
    bloomLevel: 'apply',
    question:
      'What does a Brier Score measure when evaluating a probabilistic binary classifier, and what is the optimal score?',
    options: [
      {
        id: 'a',
        text: 'Mean squared error between predicted probabilities and actual binary outcomes BS = (1/N) sum (p_i - y_i)^2; a score of 0.0 indicates perfect calibration and deterministic accuracy.',
        isCorrect: true,
        explanation:
          'Brier score measures both calibration (reliability of predicted confidence) and refinement (discrimination). A lower score indicates better probability estimates, bounded between 0.0 (perfect) and 1.0 (completely inverted).',
      },
      {
        id: 'b',
        text: 'Brier score measures the area under the ROC curve; optimal score is 1.0.',
        isCorrect: false,
        explanation: 'That describes ROC-AUC, not the mean squared probability error Brier Score.',
      },
      {
        id: 'c',
        text: 'Brier score measures the tree leaf depth; optimal score is 10.',
        isCorrect: false,
        explanation: 'Brier score is an evaluation metric, not a tree structural parameter.',
      },
      {
        id: 'd',
        text: 'Brier score measures training runtime in seconds; optimal is 0.0.',
        isCorrect: false,
        explanation: 'Brier score is a strictly statistical proper scoring rule.',
      },
    ],
  },

  // 17. Pima Indians Dataset Zero Handling
  {
    id: 'u5-bank-17',
    topic: 'Case Study: Diabetes Prediction',
    outcome: 'CO3',
    bloomLevel: 'understand',
    question:
      'In the Pima Indians Diabetes dataset, why is class-aware median imputation superior to simple global mean imputation for missing values in insulin and glucose?',
    options: [
      {
        id: 'a',
        text: 'Global imputation blurs the physiological boundary by pulling diabetic values down and healthy values up; class-aware median preserves the true biological separation between the two cohorts.',
        isCorrect: true,
        explanation:
          'Diabetic patients naturally have much higher fasting insulin and glucose than healthy individuals. A global average assigns diabetic values to healthy patients and vice versa, eroding diagnostic contrast.',
      },
      {
        id: 'b',
        text: 'Class-aware imputation eliminates the need for a test dataset.',
        isCorrect: false,
        explanation: 'A test set is always required for unbiased evaluation.',
      },
      {
        id: 'c',
        text: 'Global mean imputation can only be calculated on integer counts.',
        isCorrect: false,
        explanation: 'Means can be computed on any numeric data.',
      },
      {
        id: 'd',
        text: 'Class-aware imputation converts the problem into unsupervised clustering.',
        isCorrect: false,
        explanation: 'Class-aware imputation utilizes the supervised target label.',
      },
    ],
  },

  // 18. Decision Tree Extrapolation Failure
  {
    id: 'u5-bank-18',
    topic: 'Decision Tree Regression',
    outcome: 'CO3',
    bloomLevel: 'analyze',
    question:
      'Why is a Decision Tree Regressor fundamentally incapable of predicting an upward trend when evaluated on test data where x_test > max(x_train)?',
    options: [
      {
        id: 'a',
        text: 'Trees partition space into orthogonal step regions with constant leaf values: any test query exceeding the maximum training split boundary routes to the outermost leaf, outputting a constant flat horizontal prediction.',
        isCorrect: true,
        explanation:
          'Unlike linear models (y = mx + c) or polynomials, decision trees do not estimate a continuous derivative or slope. All values beyond the training domain receive the exact same leaf partition mean.',
      },
      {
        id: 'b',
        text: 'Because the variance reduction criterion becomes negative.',
        isCorrect: false,
        explanation: 'Variance reduction is calculated during training, not during inference.',
      },
      {
        id: 'c',
        text: 'Because trees only accept inputs normalized between -1 and +1.',
        isCorrect: false,
        explanation: 'Trees accept unscaled inputs across all real numbers.',
      },
      {
        id: 'd',
        text: 'Because trees throw a runtime OutOfBoundsException.',
        isCorrect: false,
        explanation:
          'Trees execute without exception; they simply return the constant value of the outermost leaf.',
      },
    ],
  },

  // 19. AdaBoost Outlier Sensitivity
  {
    id: 'u5-bank-19',
    topic: 'AdaBoost Mechanics',
    outcome: 'CO4',
    bloomLevel: 'understand',
    question:
      'Why does standard AdaBoost degrade rapidly when trained on datasets containing mislabeled or corrupted sample points?',
    options: [
      {
        id: 'a',
        text: 'AdaBoost applies exponential weight scaling: an impossible outlier that can never be correctly classified has its sample weight multiplied by e^alpha round after round, dominating the weight distribution and corrupting decision boundaries.',
        isCorrect: true,
        explanation:
          'Exponential loss is non-robust to outliers. Mislabeled instances receive exponentially escalating weights, forcing later decision stumps to sacrifice the entire clean dataset just to satisfy the corrupted outlier.',
      },
      {
        id: 'b',
        text: 'AdaBoost requires all training instances to be strictly linearly separable.',
        isCorrect: false,
        explanation:
          'AdaBoost does not require linear separability; it combines weak non-linear stumps.',
      },
      {
        id: 'c',
        text: 'Outliers cause the decision stump threshold to become imaginary numbers.',
        isCorrect: false,
        explanation: 'Thresholds are real feature values.',
      },
      {
        id: 'd',
        text: 'The normalization factor Z_t becomes negative in the presence of noise.',
        isCorrect: false,
        explanation:
          'Z_t is a sum of strictly positive exponential weights and is always positive.',
      },
    ],
  },

  // 20. Bias-Variance Summary Across Unit 5 Models
  {
    id: 'u5-bank-20',
    topic: 'Model Synthesis',
    outcome: 'CO2',
    bloomLevel: 'analyze',
    question:
      'Comparing an unpruned Decision Tree, a Random Forest (100 trees), and an AdaBoost ensemble (100 stumps), how do their bias and variance profiles compare relative to one another?',
    options: [
      {
        id: 'a',
        text: 'Unpruned Tree: low bias, high variance; Random Forest: low bias, substantially reduced variance via bootstrap averaging; AdaBoost: starts with high bias (stump) and sequentially drives bias down while managing variance.',
        isCorrect: true,
        explanation:
          'A deep tree overfits (high variance). Random Forests aggregate many deep trees to damp variance without inflating bias. AdaBoost combines many high-bias weak stumps sequentially to minimize bias.',
      },
      {
        id: 'b',
        text: 'All three models possess identical bias and variance characteristics.',
        isCorrect: false,
        explanation:
          'Ensemble architectures and single trees have fundamentally different variance and bias mechanisms.',
      },
      {
        id: 'c',
        text: 'Random Forest has higher variance than a single unpruned decision tree.',
        isCorrect: false,
        explanation: 'Averaging decorrelated trees strictly reduces variance: Var_RF < Var_Tree.',
      },
      {
        id: 'd',
        text: 'AdaBoost only works to reduce variance, not bias.',
        isCorrect: false,
        explanation: 'Boosting is fundamentally a bias-reduction technique.',
      },
    ],
  },
];
