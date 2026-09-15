import type { QuizItem } from './Quiz';

export const UNIT3_QUESTION_BANK: (QuizItem & {
  outcome: 'CO2' | 'CO3' | 'CO4';
  topic: string;
  bloomLevel?: 'remember' | 'understand' | 'apply' | 'analyze';
})[] = [
  // 1. ML Paradigms
  {
    id: 'u3-bank-01',
    topic: 'ML Paradigms',
    outcome: 'CO2',
    bloomLevel: 'understand',
    question:
      'Which core property fundamentally distinguishes Supervised Learning from Reinforcement Learning?',
    options: [
      {
        id: 'a',
        text: 'Supervised learning trains on explicit ground-truth teacher labels for every training instance; reinforcement learning relies on delayed scalar feedback (rewards/penalties) through active trial-and-error environmental interaction.',
        isCorrect: true,
        explanation:
          'In supervised learning, each training input x is paired with a direct supervision label y*. In reinforcement learning, the agent receives evaluative scalar rewards r_t without ever being told the optimal counterfactual action.',
      },
      {
        id: 'b',
        text: 'Supervised learning only works on images, while reinforcement learning only works on games.',
        isCorrect: false,
        explanation:
          'Both paradigms are universal and apply across text, tabular, vision, and control domains.',
      },
      {
        id: 'c',
        text: 'Supervised learning requires gradient descent, while reinforcement learning never uses optimization.',
        isCorrect: false,
        explanation:
          'Deep reinforcement learning relies extensively on gradient descent (e.g. policy gradients).',
      },
      {
        id: 'd',
        text: 'Supervised learning is always deterministic, while reinforcement learning is completely random.',
        isCorrect: false,
        explanation:
          'Supervised learning can output probability distributions, and RL policies can be deterministic.',
      },
    ],
  },

  // 2. Simple Linear Regression Cost Formulation
  {
    id: 'u3-bank-02',
    topic: 'Simple Linear Regression',
    outcome: 'CO2',
    bloomLevel: 'apply',
    question:
      'Why is the factor 1/(2m) rather than 1/m used in the canonical Mean Squared Error cost function J(θ) = 1/(2m) Σ (h_θ(x^(i)) - y^(i))²?',
    options: [
      {
        id: 'a',
        text: 'The 2 in the denominator exactly cancels out the 2 that appears when taking the derivative of the squared error term d/dθ (u²) = 2u, simplifying gradient update formulas.',
        isCorrect: true,
        explanation:
          'When differentiating (h_θ(x) - y)², the chain rule produces a factor of 2. Having 1/(2m) allows the 2 to cancel cleanly, leaving (1/m) Σ (h_θ(x) - y) x_j without altering the location of the minimum.',
      },
      {
        id: 'b',
        text: 'Because half the training data is discarded during each gradient step.',
        isCorrect: false,
        explanation: 'Batch gradient descent uses 100% of the training points on every iteration.',
      },
      {
        id: 'c',
        text: 'To ensure the cost value always lies between 0 and 1.',
        isCorrect: false,
        explanation: 'MSE is unbounded in [0, infinity) and depends on the units of y.',
      },
      {
        id: 'd',
        text: 'To prevent division by zero when m = 1.',
        isCorrect: false,
        explanation: 'Division by 2m has the same denominator singularity at m=0 as 1/m.',
      },
    ],
  },

  // 3. Convexity of Linear Regression MSE
  {
    id: 'u3-bank-03',
    topic: 'Loss Function Convexity',
    outcome: 'CO3',
    bloomLevel: 'analyze',
    question:
      'Why is Ordinary Least Squares linear regression guaranteed to have NO suboptimal local minima?',
    options: [
      {
        id: 'a',
        text: 'The MSE cost surface is a strictly convex paraboloid (bowl-shaped) whose Hessian matrix ∇²J(θ) = (1/m) XᵀX is positive semi-definite everywhere, ensuring every stationary point is a global minimum.',
        isCorrect: true,
        explanation:
          'Because the quadratic function f(u) = u² is convex and the affine composition h_θ(x) = Xθ preserves convexity, the sum of convex functions remains convex. A convex function has exactly one connected set of global minima.',
      },
      {
        id: 'b',
        text: 'Because the learning rate is dynamically adjusted to zero.',
        isCorrect: false,
        explanation:
          'Convexity is a geometric property of the loss function, independent of optimizer choice.',
      },
      {
        id: 'c',
        text: 'Because linear models only work when all input features are positive.',
        isCorrect: false,
        explanation: 'Linear regression operates on arbitrary real-valued features.',
      },
      {
        id: 'd',
        text: 'Because Scikit-Learn checks all possible parameter combinations with exhaustive grid search.',
        isCorrect: false,
        explanation:
          'Convex optimization uses analytical closed-forms or gradient descent, not exhaustive search.',
      },
    ],
  },

  // 4. Gradient Descent Dynamics
  {
    id: 'u3-bank-04',
    topic: 'Gradient Descent Optimization',
    outcome: 'CO3',
    bloomLevel: 'analyze',
    question:
      'What happens to the parameter trajectory during gradient descent if the learning rate α is set significantly larger than 2 / λ_max (where λ_max is the maximum eigenvalue of the Hessian)?',
    options: [
      {
        id: 'a',
        text: 'The updates overshoot the valley of the cost surface with oscillating, exponentially growing step sizes, causing J(θ) to diverge to infinity (numerical overflow).',
        isCorrect: true,
        explanation:
          'If the step size exceeds the Lipschitz stability bound 2/L, the update step θ - α∇J lands further away from the minimum on the opposite slope of the valley, triggering catastrophic divergence.',
      },
      {
        id: 'b',
        text: 'The model converges to the global minimum in exactly one step.',
        isCorrect: false,
        explanation:
          'Only Newton-Raphson second-order optimization can reach the minimum of a quadratic in one step.',
      },
      {
        id: 'c',
        text: 'The parameters become complex imaginary numbers.',
        isCorrect: false,
        explanation:
          'Gradient descent operations are strictly real-valued floating-point arithmetic.',
      },
      {
        id: 'd',
        text: 'The algorithm automatically converts itself into a decision tree.',
        isCorrect: false,
        explanation: 'Optimization algorithms do not change model architectures.',
      },
    ],
  },

  // 5. Batch vs Stochastic vs Mini-Batch GD
  {
    id: 'u3-bank-05',
    topic: 'Gradient Descent Variants',
    outcome: 'CO2',
    bloomLevel: 'understand',
    question:
      'In training large-scale models with millions of samples, why is Mini-Batch Gradient Descent universally preferred over both Batch GD and pure Stochastic GD (SGD)?',
    options: [
      {
        id: 'a',
        text: 'It strikes an optimal balance: vectorized GPU matrix hardware acceleration enables high throughput, while mini-batch stochasticity provides sufficient gradient noise to escape saddle points without the wild variance of single-sample SGD.',
        isCorrect: true,
        explanation:
          'Batch GD requires loading the entire million-row dataset into memory per step (slow and memory-limited). Pure SGD processes 1 sample per step, forfeiting GPU SIMD parallelization. Mini-batches (e.g. 32-512) maximize hardware utilization.',
      },
      {
        id: 'b',
        text: 'Mini-batch GD is mathematically proven to have 0.00% training error.',
        isCorrect: false,
        explanation: 'No optimization algorithm guarantees zero training error on noisy real data.',
      },
      {
        id: 'c',
        text: 'Because Batch GD cannot compute gradients on floating-point numbers.',
        isCorrect: false,
        explanation: 'Batch GD computes standard double-precision floating point gradients.',
      },
      {
        id: 'd',
        text: 'Mini-batch GD does not require a loss function.',
        isCorrect: false,
        explanation:
          'All gradient descent algorithms require a scalar differentiable objective function.',
      },
    ],
  },

  // 6. Normal Equation Formulation & Complexity
  {
    id: 'u3-bank-06',
    topic: 'Multiple Linear Regression',
    outcome: 'CO2',
    bloomLevel: 'apply',
    question:
      'Given an n × p design matrix X and target vector y, what is the computational time complexity of computing the closed-form Ordinary Least Squares solution θ = (XᵀX)⁻¹ Xᵀy?',
    options: [
      {
        id: 'a',
        text: 'O(n · p² + p³), dominated by the matrix multiplication XᵀX taking O(n p²) and the matrix inversion of the p × p matrix taking O(p³).',
        isCorrect: true,
        explanation:
          'Computing XᵀX requires multiplying a p × n matrix by an n × p matrix (O(n p²)). Inverting the resulting p × p symmetric matrix via Gauss-Jordan elimination or Cholesky decomposition takes O(p³). When p > 10,000, inversion becomes computationally prohibitive, requiring iterative gradient descent.',
      },
      {
        id: 'b',
        text: 'O(n · p) linear time.',
        isCorrect: false,
        explanation: 'Matrix inversion is super-linear and cannot be computed in linear time.',
      },
      {
        id: 'c',
        text: 'O(2ⁿ) exponential time.',
        isCorrect: false,
        explanation: 'Matrix inversion is polynomial, not NP-hard or exponential.',
      },
      {
        id: 'd',
        text: 'O(1) constant time.',
        isCorrect: false,
        explanation: 'Matrix operations require passes proportional to matrix dimensions.',
      },
    ],
  },

  // 7. Matrix Singularity & Multicollinearity
  {
    id: 'u3-bank-07',
    topic: 'Multicollinearity & Matrix Rank',
    outcome: 'CO3',
    bloomLevel: 'analyze',
    question:
      'What happens mathematically to the Normal Equation (XᵀX)⁻¹ if two features X₁ and X₂ are perfectly collinear (e.g. X₂ = 3 · X₁)?',
    options: [
      {
        id: 'a',
        text: 'XᵀX has linearly dependent columns and rank less than p; its determinant evaluates to 0, making the matrix singular and mathematically impossible to invert uniquely.',
        isCorrect: true,
        explanation:
          'Perfect collinearity means the matrix X has reduced rank (rank(X) < p). Consequently, XᵀX is singular, det(XᵀX) = 0, and there exist infinitely many parameter vectors that achieve the exact same minimum SSE.',
      },
      {
        id: 'b',
        text: 'The matrix inverse becomes the identity matrix.',
        isCorrect: false,
        explanation: 'Singular matrices have no conventional inverse.',
      },
      {
        id: 'c',
        text: 'The loss function becomes non-convex.',
        isCorrect: false,
        explanation:
          'The loss remains convex, but the minimum forms a flat trough rather than a single point.',
      },
      {
        id: 'd',
        text: 'All feature values are automatically converted to zero.',
        isCorrect: false,
        explanation: 'Input data remains unchanged.',
      },
    ],
  },

  // 8. Polynomial Regression & Runge Phenomenon
  {
    id: 'u3-bank-08',
    topic: 'Polynomial Regression',
    outcome: 'CO3',
    bloomLevel: 'analyze',
    question:
      'When fitting a degree-15 polynomial to 18 evenly spaced noisy data points, what phenomenon causes catastrophic prediction errors near the boundary edges of the feature domain?',
    options: [
      {
        id: 'a',
        text: 'Runge Phenomenon: high-degree polynomial interpolation across equidistant nodes creates wild oscillatory swings near the interval endpoints, causing variance explosion.',
        isCorrect: true,
        explanation:
          'As polynomial degree d grows on equidistant points, the condition number of the Vandermonde matrix explodes exponentially. The polynomial oscillates violently near the domain boundaries to fit noise, severely degrading generalization.',
      },
      {
        id: 'b',
        text: 'The data points are deleted by the operating system.',
        isCorrect: false,
        explanation: 'This is a statistical phenomenon, not a storage defect.',
      },
      {
        id: 'c',
        text: 'High Bias (Underfitting).',
        isCorrect: false,
        explanation:
          'Degree-15 polynomial on 18 points has near-zero bias and massive variance (extreme overfitting).',
      },
      {
        id: 'd',
        text: 'Gradient descent reaches a saddle point.',
        isCorrect: false,
        explanation:
          'The boundary oscillation occurs even when solved via exact closed-form normal equations.',
      },
    ],
  },

  // 9. Bias-Variance Decomposition
  {
    id: 'u3-bank-09',
    topic: 'Bias-Variance Tradeoff',
    outcome: 'CO3',
    bloomLevel: 'analyze',
    question:
      'In the formal decomposition E[(y - f̂(x))²] = Bias(f̂(x))² + Var(f̂(x)) + σ², what does the irreducible error term σ² represent?',
    options: [
      {
        id: 'a',
        text: 'The intrinsic variance of the true data generating process Var(ε) caused by unmeasured confounding latent factors or sensor noise that no model can ever predict.',
        isCorrect: true,
        explanation:
          'Even if an omniscient intelligence knew the true data-generating function f(x) exactly, individual test samples y = f(x) + ε would still deviate by stochastic noise ε ~ N(0, σ²). This sets the theoretical Bayes error rate lower bound.',
      },
      {
        id: 'b',
        text: 'Numerical roundoff error caused by 32-bit floating point arithmetic.',
        isCorrect: false,
        explanation:
          'Numerical precision is computational roundoff, not irreducible statistical noise.',
      },
      {
        id: 'c',
        text: 'The penalty added by L1 Lasso regularization.',
        isCorrect: false,
        explanation:
          'Regularization adds intentional bias to reduce variance; it does not alter sigma².',
      },
      {
        id: 'd',
        text: 'The difference between training accuracy and validation accuracy.',
        isCorrect: false,
        explanation:
          'The generalization gap between train and validation scores is an indicator of model variance.',
      },
    ],
  },

  // 10. Locally Weighted Linear Regression
  {
    id: 'u3-bank-10',
    topic: 'Locally Weighted Regression',
    outcome: 'CO3',
    bloomLevel: 'understand',
    question:
      'Why is Locally Weighted Linear Regression (LWR) classified as a "Memory-Based" (Non-Parametric) learning algorithm?',
    options: [
      {
        id: 'a',
        text: 'LWR does not learn a fixed, static set of parameters during training; to make a prediction at any new query point x, it must retain the entire training dataset and re-fit a localized weighted regression on the fly.',
        isCorrect: true,
        explanation:
          'Parametric models (like OLS) learn fixed weights θ once and discard the training data. LWR assigns exponential distance weights w_i = exp(-(x^(i) - x)² / (2τ²)) relative to each query point x, requiring full dataset storage and retraining for every single inference.',
      },
      {
        id: 'b',
        text: 'LWR stores all predictions in GPU VRAM permanently.',
        isCorrect: false,
        explanation:
          'Memory-based refers to statistical retention of training instances, not physical GPU hardware.',
      },
      {
        id: 'c',
        text: 'LWR cannot handle datasets larger than 10 megabytes.',
        isCorrect: false,
        explanation: 'Non-parametric defines functional form capacity, not dataset size limits.',
      },
      {
        id: 'd',
        text: 'Because it is an unsupervised clustering algorithm.',
        isCorrect: false,
        explanation: 'LWR is a supervised regression algorithm with continuous targets.',
      },
    ],
  },

  // 11. Feature Scaling & Gradient Descent
  {
    id: 'u3-bank-11',
    topic: 'Feature Scaling & Standardization',
    outcome: 'CO2',
    bloomLevel: 'apply',
    question:
      'Why does Gradient Descent converge exponentially faster when features are standardized (z = (x - μ) / σ) compared to unscaled raw features?',
    options: [
      {
        id: 'a',
        text: 'Standardization transforms elongated, highly eccentric elliptical cost contours into spherical, circular contours, preventing gradient updates from zig-zagging back and forth across steep valley walls.',
        isCorrect: true,
        explanation:
          'When features have disparate scales (e.g. area = 2000, bedrooms = 3), the loss surface is a distorted ellipse with extreme condition number. Gradients point almost perpendicular to the true minimum, causing severe oscillation. Spherical contours point directly toward the center.',
      },
      {
        id: 'b',
        text: 'Because standardized numbers require only 8 bits of memory.',
        isCorrect: false,
        explanation: 'Floating point formats remain standard 64-bit IEEE 754.',
      },
      {
        id: 'c',
        text: 'Standardization eliminates the need to compute derivatives.',
        isCorrect: false,
        explanation:
          'Gradient updates still require evaluating the partial derivatives of the loss.',
      },
      {
        id: 'd',
        text: 'Because the learning rate is automatically multiplied by 1,000.',
        isCorrect: false,
        explanation:
          'Standardization improves condition number; it does not alter the learning rate constant.',
      },
    ],
  },

  // 12. Dummy Variable Trap
  {
    id: 'u3-bank-12',
    topic: 'Categorical One-Hot Encoding',
    outcome: 'CO2',
    bloomLevel: 'apply',
    question:
      'When one-hot encoding a categorical feature with K unique categories for a linear regression model that already contains an intercept term θ₀, why MUST we drop one category (leaving K - 1 dummies)?',
    options: [
      {
        id: 'a',
        text: 'To avoid the Dummy Variable Trap: the sum of all K dummy columns equals the constant intercept column vector [1, 1, ..., 1]ᵀ, creating perfect multicollinearity and making (XᵀX) singular.',
        isCorrect: true,
        explanation:
          'If you include all K dummies and an intercept, then for every row: D₁ + D₂ + ... + D_K = 1 = x₀. This exact linear combination creates a rank-deficient design matrix with determinant 0, causing matrix inversion to fail.',
      },
      {
        id: 'b',
        text: 'Because database tables cannot have more than 10 columns.',
        isCorrect: false,
        explanation: 'Database schemas easily support hundreds of columns.',
      },
      {
        id: 'c',
        text: 'Dropping a category saves 90% of training time.',
        isCorrect: false,
        explanation:
          'Saving one column has negligible computational impact; the requirement is strictly algebraic.',
      },
      {
        id: 'd',
        text: 'Because the dropped category is proven to be completely useless.',
        isCorrect: false,
        explanation:
          'The dropped category serves as the baseline reference tier represented by the intercept θ₀.',
      },
    ],
  },

  // 13. Regression Evaluation Metrics: Outlier Sensitivity
  {
    id: 'u3-bank-13',
    topic: 'Regression Evaluation Metrics',
    outcome: 'CO3',
    bloomLevel: 'analyze',
    question:
      'If an industrial dataset contains 2 extreme sensor glitch outliers that deviate by 50 standard deviations from true values, which metric provides the most reliable evaluation of typical model precision?',
    options: [
      {
        id: 'a',
        text: 'Mean Absolute Error (MAE) or Median Absolute Error, because they scale linearly with error magnitude rather than squaring deviations into astronomically distorted values.',
        isCorrect: true,
        explanation:
          'A single error of 50 units adds 2,500 to the sum of squared errors in MSE and drastically inflates RMSE. MAE treats the 50-unit error linearly (+50), and Median Absolute Error completely ignores tail anomalies, reflecting typical median performance.',
      },
      {
        id: 'b',
        text: 'Root Mean Squared Error (RMSE).',
        isCorrect: false,
        explanation:
          'RMSE squares errors before taking the root, leaving it highly vulnerable to outlier distortion.',
      },
      {
        id: 'c',
        text: 'Unadjusted R² Score.',
        isCorrect: false,
        explanation:
          'R² relies on SS_res which contains squared outlier errors, severely depressing the score.',
      },
      {
        id: 'd',
        text: 'Mean Squared Logarithmic Error (MSLE) on unnormalized negative values.',
        isCorrect: false,
        explanation: 'Logarithms are undefined on negative values.',
      },
    ],
  },

  // 14. Negative R-Squared Boundary Condition
  {
    id: 'u3-bank-14',
    topic: 'Coefficient of Determination R²',
    outcome: 'CO3',
    bloomLevel: 'analyze',
    question:
      'Under what condition does the R² score evaluate to a strictly negative value (R² < 0)?',
    options: [
      {
        id: 'a',
        text: 'When the model predictions on held-out test data produce a larger Sum of Squared Errors (SS_res) than a trivial horizontal baseline that simply predicts the sample mean (ȳ) for every observation.',
        isCorrect: true,
        explanation:
          'R² = 1 - (SS_res / SS_tot). If the predictive model performs worse than simply predicting the historical mean ȳ, then SS_res > SS_tot. The fraction exceeds 1.0, making 1 - (SS_res / SS_tot) negative.',
      },
      {
        id: 'b',
        text: 'Whenever the slope of the regression line is negative.',
        isCorrect: false,
        explanation:
          'A model with negative slope can have a perfect R² = 1.0 if points align on the line.',
      },
      {
        id: 'c',
        text: 'R² is mathematically bounded between 0 and 1 and can never be negative under any circumstances.',
        isCorrect: false,
        explanation: 'R² is bounded in [0, 1] only on the training set for OLS with an intercept.',
      },
      {
        id: 'd',
        text: 'Only when the learning rate of gradient descent is negative.',
        isCorrect: false,
        explanation: 'Learning rates are positive real hyperparameters.',
      },
    ],
  },

  // 15. Residual Diagnostics: Heteroscedasticity
  {
    id: 'u3-bank-15',
    topic: 'Residual Diagnostics',
    outcome: 'CO3',
    bloomLevel: 'analyze',
    question:
      'What specific violation of the Gauss-Markov theorem does a pronounced funnel/fan shape in a Residuals vs Fitted plot expose?',
    options: [
      {
        id: 'a',
        text: 'Heteroscedasticity: the variance of the error terms is not constant across fitted values, rendering OLS standard errors biased and statistical hypothesis tests (p-values, confidence intervals) invalid.',
        isCorrect: true,
        explanation:
          'The Gauss-Markov assumption of homoscedasticity requires Var(ε_i) = σ² for all i. A funnel shape (variance expanding as ŷ increases) violates this, requiring WLS (Weighted Least Squares) or log target transformation.',
      },
      {
        id: 'b',
        text: 'The model has too few training iterations.',
        isCorrect: false,
        explanation:
          'Funnel variance is a property of the data distribution, not convergence iteration count.',
      },
      {
        id: 'c',
        text: 'The computer has run out of physical RAM.',
        isCorrect: false,
        explanation: 'Hardware memory does not generate geometric residual shapes.',
      },
      {
        id: 'd',
        text: 'The target variable is strictly binary (0 or 1).',
        isCorrect: false,
        explanation:
          'Binary targets produce two parallel diagonal bands in residual plots, not a continuous funnel.',
      },
    ],
  },

  // 16. Real-Estate Case Study: Spatial Autocorrelation
  {
    id: 'u3-bank-16',
    topic: 'Real-Estate Case Study',
    outcome: 'CO4',
    bloomLevel: 'analyze',
    question:
      'Why does random K-Fold cross-validation severely underestimate true prediction error when evaluating Automated Valuation Models on physical housing market data?',
    options: [
      {
        id: 'a',
        text: 'Spatial Autocorrelation: neighboring flats in the exact same apartment tower or street end up split across train and test folds, allowing the model to memorize local price benchmarks rather than truly generalizing.',
        isCorrect: true,
        explanation:
          'According to Tobler First Law of Geography, adjacent properties share identical neighborhood quality, transit access, and builder prestige. Spatial block CV (holding out entire postal codes or cities) is required to evaluate true generalization.',
      },
      {
        id: 'b',
        text: 'Because real-estate transactions are recorded in Indian Rupees or US Dollars.',
        isCorrect: false,
        explanation: 'Currency denomination has no bearing on statistical data leakage.',
      },
      {
        id: 'c',
        text: 'Because houses do not have continuous square footage.',
        isCorrect: false,
        explanation: 'Square footage is a standard continuous variable.',
      },
      {
        id: 'd',
        text: 'Because OLS regression is illegal under the Real Estate Regulation Act (RERA).',
        isCorrect: false,
        explanation:
          'RERA regulates development transparency; it does not dictate machine learning algorithms.',
      },
    ],
  },

  // 17. Healthcare Case Study: Non-linear Clinical Interactions
  {
    id: 'u3-bank-17',
    topic: 'Healthcare Case Study',
    outcome: 'CO4',
    bloomLevel: 'analyze',
    question:
      'In medical insurance expenditure modeling, why does adding an interaction term (BMI × Smoker) dramatically improve predictive accuracy over purely additive linear terms?',
    options: [
      {
        id: 'a',
        text: 'Because clinical risk factors compound synergistically: obesity combined with tobacco smoking causes exponential cardiovascular and pulmonary morbidity, increasing the marginal cost slope of BMI exclusively for smokers.',
        isCorrect: true,
        explanation:
          'In medical claims data, high BMI in non-smokers incurs modest incremental costs. In smokers, high BMI multiplies ICU and cardiovascular hospitalization risk exponentially. An interaction term allows the model to assign a much steeper slope to BMI for smokers.',
      },
      {
        id: 'b',
        text: 'Because multiplying two variables automatically removes all measurement noise.',
        isCorrect: false,
        explanation:
          'Multiplication does not filter noise; it captures cross-variable dependencies.',
      },
      {
        id: 'c',
        text: 'Because insurance companies are required by law to use interaction terms.',
        isCorrect: false,
        explanation:
          'Legal frameworks regulate fairness and privacy, not mathematical term structures.',
      },
      {
        id: 'd',
        text: 'Because non-smokers always have zero healthcare costs.',
        isCorrect: false,
        explanation: 'Non-smokers still incur baseline healthcare and emergency medical costs.',
      },
    ],
  },

  // 18. Regularization Geometry: Sparsity of L1 vs L2
  {
    id: 'u3-bank-18',
    topic: 'Regularization Geometry',
    outcome: 'CO3',
    bloomLevel: 'analyze',
    question:
      'What geometric property of the L1 penalty region (||θ||₁ ≤ t) enables Lasso to perform embedded feature selection by driving weights strictly to zero?',
    options: [
      {
        id: 'a',
        text: 'The L1 norm constraint forms a sharp polytope/diamond with pointed vertices situated directly on the coordinate axes, making loss contour tangent touchpoints highly concentrated at θ_j = 0.',
        isCorrect: true,
        explanation:
          'The smooth L2 hypersphere has no corners, so expanding MSE loss contours contact it at arbitrary non-zero coordinates. The L1 diamond has sharp corners on the coordinate axes. The contours hit these corners first, setting the other coordinate strictly to 0.',
      },
      {
        id: 'b',
        text: 'The L1 region is an open unbounded circle.',
        isCorrect: false,
        explanation: 'The L1 region is a compact, convex, closed polytope.',
      },
      {
        id: 'c',
        text: 'L1 regularization calculates matrix inverses faster than L2.',
        isCorrect: false,
        explanation:
          'L1 has no closed form and requires iterative coordinate descent; L2 has a direct matrix inverse.',
      },
      {
        id: 'd',
        text: 'L1 penalty automatically converts regression into classification.',
        isCorrect: false,
        explanation:
          'Regularization penalizes weight magnitude; it does not change the prediction target type.',
      },
    ],
  },

  // 19. Elastic Net Grouping & High-Dimensional Capacity
  {
    id: 'u3-bank-19',
    topic: 'Elastic Net Regularization',
    outcome: 'CO3',
    bloomLevel: 'apply',
    question:
      'In a genomic dataset with 20,000 gene expression features and only 100 cancer patients (p >> n), why is Elastic Net preferred over pure Lasso?',
    options: [
      {
        id: 'a',
        text: 'Pure Lasso can select at most n = 100 features before saturating, and arbitrarily drops correlated genes; Elastic Net overcomes the n-feature limit and retains entire clusters of co-regulated genes.',
        isCorrect: true,
        explanation:
          'Due to the geometry of the L1 polytope, pure Lasso coordinate descent cannot select more than n non-zero coefficients when p > n. Adding the strictly convex L2 penalty removes this cap and induces a grouping effect where correlated genes are selected together.',
      },
      {
        id: 'b',
        text: 'Elastic Net does not require gene sequencing.',
        isCorrect: false,
        explanation: 'Gene sequencing provides the raw input data matrix.',
      },
      {
        id: 'c',
        text: 'Because Elastic Net runs in O(1) constant time.',
        isCorrect: false,
        explanation:
          'Elastic Net requires iterative coordinate descent passes over all 20,000 features.',
      },
      {
        id: 'd',
        text: 'Because Lasso is mathematically illegal in medical diagnostics.',
        isCorrect: false,
        explanation:
          'Lasso is widely used; the limitation is mathematical capacity (n-feature saturation).',
      },
    ],
  },

  // 20. Cross-Validation & The One-Standard-Error Rule
  {
    id: 'u3-bank-20',
    topic: 'Model Selection & Cross-Validation',
    outcome: 'CO4',
    bloomLevel: 'analyze',
    question:
      'According to the "One Standard Error Rule" (1-SE Rule) in cross-validated hyperparameter selection, which model should be chosen?',
    options: [
      {
        id: 'a',
        text: 'The simplest or most heavily regularized model whose cross-validation score is within one standard error of the minimum error model score.',
        isCorrect: true,
        explanation:
          'Empirical cross-validation error curves have random sampling noise. The exact minimum point is often noisy. The 1-SE rule chooses the parsimonious (simplest / most regularized) model that is statistically indistinguishable from the absolute minimum.',
      },
      {
        id: 'b',
        text: 'The model with the highest training R² score.',
        isCorrect: false,
        explanation: 'Highest training R² is achieved by the most overfitted complex model.',
      },
      {
        id: 'c',
        text: 'The model with the largest number of polynomial degree terms.',
        isCorrect: false,
        explanation: 'This maximizes model variance and overfitting risk.',
      },
      {
        id: 'd',
        text: 'The model that takes the longest time to train.',
        isCorrect: false,
        explanation: 'Training latency has no correlation with generalization quality.',
      },
    ],
  },
];
