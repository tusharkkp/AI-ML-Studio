export interface GlossaryEntry {
  term: string;
  definition: string;
  unit: 1 | 2 | 3 | 4 | 5 | 6;
  relatedTerms?: string[];
  category?: string;
  formula?: string;
  conceptHref?: string;
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
  // UNIT 1: BASICS OF AI
  'rational agent': {
    term: 'Rational Agent',
    definition:
      'An autonomous entity that perceives its environment through sensors and acts upon it via actuators to maximize its expected performance measure given its percept history.',
    unit: 1,
    category: 'Intelligent Agents',
    conceptHref: '/learn/unit-1/intelligent-agents',
    relatedTerms: ['peas framework', 'performance measure', 'environment types'],
  },
  'peas framework': {
    term: 'PEAS Framework',
    definition:
      'The standard 4-part formulation for specifying an intelligent agent problem: Performance measure, Environment, Actuators, and Sensors.',
    unit: 1,
    category: 'Intelligent Agents',
    conceptHref: '/learn/unit-1/intelligent-agents',
    relatedTerms: ['rational agent', 'environment types'],
  },
  'performance measure': {
    term: 'Performance Measure',
    definition:
      'An objective external criterion for evaluating how successfully an agent achieves its designated goals within an environment.',
    unit: 1,
    category: 'Intelligent Agents',
    conceptHref: '/learn/unit-1/intelligent-agents',
    relatedTerms: ['rational agent', 'peas framework'],
  },
  'environment types': {
    term: 'Environment Classification',
    definition:
      'The dimensional properties characterizing an agent world: Observable vs Partially Observable, Deterministic vs Stochastic, Episodic vs Sequential, Static vs Dynamic, Discrete vs Continuous, and Single vs Multi-agent.',
    unit: 1,
    category: 'Agent Environments',
    conceptHref: '/learn/unit-1/intelligent-agents',
    relatedTerms: ['peas framework', 'rational agent'],
  },
  'propositional logic': {
    term: 'Propositional Logic',
    definition:
      'A formal Boolean reasoning framework operating over atomic truth-bearing propositions connected by logical operators: conjunction, disjunction, negation, and implication.',
    unit: 1,
    category: 'Knowledge & Logic',
    conceptHref: '/learn/unit-1/reasoning-kr',
    formula: 'P \\land (P \\implies Q) \\models Q',
    relatedTerms: ['first-order logic', 'modus ponens', 'resolution refutation'],
  },
  'first-order logic': {
    term: 'First-Order Logic (FOL)',
    definition:
      'Predicate logic extending propositional calculus with objects, relations, functions, and universal (for all) and existential (there exists) quantifiers.',
    unit: 1,
    category: 'Knowledge & Logic',
    conceptHref: '/learn/unit-1/first-order-logic',
    formula: '\\forall x \\, [P(x) \\implies Q(x)]',
    relatedTerms: ['propositional logic', 'unification', 'resolution refutation'],
  },
  'modus ponens': {
    term: 'Modus Ponens',
    definition:
      'A canonical deductive inference rule stating that if statement P is asserted true and conditional rule P implies Q is true, conclusion Q follows directly.',
    unit: 1,
    category: 'Inference Rules',
    conceptHref: '/learn/unit-1/rule-based-reasoning',
    formula: '\\frac{P, \\quad P \\implies Q}{Q}',
    relatedTerms: ['forward chaining', 'propositional logic'],
  },
  unification: {
    term: 'Unification Algorithm',
    definition:
      'The symbolic substitution procedure that finds a most general variable binding substitution theta making two predicate calculus terms syntactically identical.',
    unit: 1,
    category: 'First-Order Logic',
    conceptHref: '/learn/unit-1/first-order-logic',
    formula: 'Unify(P(x, f(y)), P(a, f(b))) = \\{x/a, y/b\\}',
    relatedTerms: ['first-order logic', 'resolution refutation'],
  },
  'resolution refutation': {
    term: 'Resolution Refutation',
    definition:
      'A sound and refutation-complete theorem proving technique that negates the goal clause, converts all axioms to CNF, and repeatedly resolves conflicting literals to derive a contradiction (empty clause).',
    unit: 1,
    category: 'Inference & Proof',
    conceptHref: '/learn/unit-1/first-order-logic',
    relatedTerms: ['first-order logic', 'unification', 'propositional logic'],
  },
  'forward chaining': {
    term: 'Forward Chaining',
    definition:
      'A data-driven reasoning strategy that begins with known facts and triggers matching rule antecedents to deduce new inferences until a goal is derived.',
    unit: 1,
    category: 'Rule-Based Systems',
    conceptHref: '/learn/unit-1/rule-based-reasoning',
    relatedTerms: ['backward chaining', 'modus ponens', 'expert system'],
  },
  'backward chaining': {
    term: 'Backward Chaining',
    definition:
      'A goal-directed reasoning strategy that begins with a candidate hypothesis and works backward to verify if supporting premises exist in the knowledge base.',
    unit: 1,
    category: 'Rule-Based Systems',
    conceptHref: '/learn/unit-1/rule-based-reasoning',
    relatedTerms: ['forward chaining', 'expert system', 'inference engine'],
  },
  'expert system': {
    term: 'Expert System',
    definition:
      'A computer program that emulates human specialist decision-making by cleanly separating domain heuristics (knowledge base) from the deduction logic (inference engine).',
    unit: 1,
    category: 'Expert Systems',
    conceptHref: '/learn/unit-1/expert-systems',
    relatedTerms: ['knowledge base', 'inference engine', 'forward chaining'],
  },
  'knowledge base': {
    term: 'Knowledge Base (KB)',
    definition:
      'The declarative store of domain facts, axioms, constraints, and production rules within a knowledge-based expert system.',
    unit: 1,
    category: 'Expert Systems',
    conceptHref: '/learn/unit-1/expert-systems',
    relatedTerms: ['expert system', 'inference engine'],
  },
  'inference engine': {
    term: 'Inference Engine',
    definition:
      'The procedural component of an expert system that applies logical rules to the current working memory to deduce conclusions and recommendations.',
    unit: 1,
    category: 'Expert Systems',
    conceptHref: '/learn/unit-1/expert-systems',
    relatedTerms: ['expert system', 'knowledge base', 'forward chaining'],
  },
  eliza: {
    term: 'ELIZA Architecture',
    definition:
      'An early natural language pattern-matching program created by Joseph Weizenbaum that simulated Rogerian psychotherapy using syntactic script decomposition and reassembly.',
    unit: 1,
    category: 'Conversational Agents',
    conceptHref: '/learn/unit-1/chatbot-prompt-engineering',
    relatedTerms: ['rational agent', 'agi'],
  },
  agi: {
    term: 'Artificial General Intelligence (AGI)',
    definition:
      'Hypothetical artificial intelligence possessing the generalized capability to understand, learn, and apply knowledge across any intellectual task at human or superhuman capability.',
    unit: 1,
    category: 'Frontiers of AI',
    conceptHref: '/learn/unit-1/agi-frontiers',
    relatedTerms: ['rational agent', 'eliza'],
  },

  // UNIT 2: AI SEARCH STRATEGIES
  'state-space': {
    term: 'State-Space',
    definition:
      'The set of all valid configurations reachable from an initial state through legal action operators, forming the graph searched by problem-solving agents.',
    unit: 2,
    category: 'Search Formulation',
    conceptHref: '/learn/unit-2/state-space-search',
    relatedTerms: ['frontier', 'explored set', 'branching factor'],
  },
  frontier: {
    term: 'Frontier (Open List)',
    definition:
      'The priority queue or container of all discovered leaf nodes awaiting expansion in a graph search algorithm.',
    unit: 2,
    category: 'Search Formulation',
    conceptHref: '/learn/unit-2/uninformed-search',
    relatedTerms: ['explored set', 'state-space', 'completeness'],
  },
  'explored set': {
    term: 'Explored Set (Closed List)',
    definition:
      'The data structure tracking all states already expanded during graph search, preventing infinite loops on graph cycles and redundant work.',
    unit: 2,
    category: 'Search Formulation',
    conceptHref: '/learn/unit-2/uninformed-search',
    relatedTerms: ['frontier', 'completeness', 'optimality'],
  },
  completeness: {
    term: 'Completeness',
    definition:
      'A guarantee that an algorithm will find a solution whenever at least one exists, or terminate with failure if no path exists.',
    unit: 2,
    category: 'Search Properties',
    conceptHref: '/learn/unit-2/uninformed-search',
    relatedTerms: ['optimality', 'branching factor'],
  },
  optimality: {
    term: 'Optimality',
    definition:
      'A guarantee that an algorithm finds the solution path with the lowest possible path cost among all viable alternatives.',
    unit: 2,
    category: 'Search Properties',
    conceptHref: '/learn/unit-2/informed-search',
    relatedTerms: ['completeness', 'admissibility', 'a* search'],
  },
  'branching factor': {
    term: 'Branching Factor (b)',
    definition:
      'The average or maximum count of successor states reachable from any given state, dictating exponential search complexity b^d.',
    unit: 2,
    category: 'Search Properties',
    conceptHref: '/learn/unit-2/uninformed-search',
    formula: 'O(b^d)',
    relatedTerms: ['completeness', 'state-space'],
  },
  heuristic: {
    term: 'Heuristic Function h(n)',
    definition:
      'A domain-specific scoring function estimating the remaining distance or cost from state n to the nearest goal state.',
    unit: 2,
    category: 'Heuristic Search',
    conceptHref: '/learn/unit-2/informed-search',
    formula: 'h(n) \\approx h^*(n)',
    relatedTerms: ['admissibility', 'consistency', 'a* search'],
  },
  admissibility: {
    term: 'Admissibility',
    definition:
      'A mathematical condition where a heuristic function h(n) never overestimates the true minimal cost to achieve the goal: h(n) <= h*(n).',
    unit: 2,
    category: 'Heuristic Search',
    conceptHref: '/learn/unit-2/informed-search',
    formula: 'h(n) \\le h^*(n)',
    relatedTerms: ['consistency', 'optimality', 'a* search'],
  },
  consistency: {
    term: 'Consistency (Monotonicity)',
    definition:
      'The condition where for every node n and successor n prime, h(n) <= c(n, a, n prime) + h(n prime), guaranteeing f(n) non-decreases along any search branch.',
    unit: 2,
    category: 'Heuristic Search',
    conceptHref: '/learn/unit-2/informed-search',
    formula: "h(n) \\le c(n, a, n') + h(n')",
    relatedTerms: ['admissibility', 'a* search', 'optimality'],
  },
  'a* search': {
    term: 'A* Search',
    definition:
      'An informed graph search algorithm expanding nodes according to the total evaluation function f(n) = g(n) + h(n), balancing past path cost and heuristic estimate.',
    unit: 2,
    category: 'Informed Search',
    conceptHref: '/learn/unit-2/informed-search',
    formula: 'f(n) = g(n) + h(n)',
    relatedTerms: ['admissibility', 'consistency', 'greedy best-first search'],
  },
  'greedy best-first search': {
    term: 'Greedy Best-First Search',
    definition:
      'An informed search algorithm selecting the node that appears closest to the goal by setting f(n) = h(n), prone to local minima and suboptimal paths.',
    unit: 2,
    category: 'Informed Search',
    conceptHref: '/learn/unit-2/informed-search',
    formula: 'f(n) = h(n)',
    relatedTerms: ['a* search', 'heuristic'],
  },
  'depth-limited search': {
    term: 'Depth-Limited Search (DLS)',
    definition:
      'Depth-first search augmented with a cutoff depth limit l, preventing infinite traversal along infinite paths while sacrificing completeness if the goal lies at depth d > l.',
    unit: 2,
    category: 'Uninformed Search',
    conceptHref: '/learn/unit-2/uninformed-search',
    relatedTerms: ['iddfs', 'branching factor'],
  },
  iddfs: {
    term: 'Iterative Deepening Search (IDDFS)',
    definition:
      'A search strategy repeatedly executing Depth-Limited Search with depth cutoffs 0, 1, 2, ... combining the completeness and optimality of BFS with the O(bd) linear space of DFS.',
    unit: 2,
    category: 'Uninformed Search',
    conceptHref: '/learn/unit-2/uninformed-search',
    formula: '\\text{Space: } O(b \\cdot d)',
    relatedTerms: ['depth-limited search', 'completeness'],
  },
  'hill climbing': {
    term: 'Hill Climbing Search',
    definition:
      'A local search algorithm that continually moves in the direction of increasing elevation to find a peak, susceptible to local maxima, ridges, and plateaus.',
    unit: 2,
    category: 'Local Search',
    conceptHref: '/learn/unit-2/local-search',
    relatedTerms: ['simulated annealing', 'genetic algorithm'],
  },
  'simulated annealing': {
    term: 'Simulated Annealing',
    definition:
      'A probabilistic local search algorithm inspired by metallurgy that escapes local optima by occasionally accepting downhill moves with probability exp(Delta E / T).',
    unit: 2,
    category: 'Local Search',
    conceptHref: '/learn/unit-2/local-search',
    formula: 'P(\\text{accept}) = e^{\\Delta E / T}',
    relatedTerms: ['hill climbing', 'genetic algorithm'],
  },
  csp: {
    term: 'Constraint Satisfaction Problem (CSP)',
    definition:
      'A problem formulation comprising a set of variables, individual finite domains of possible values, and a set of constraints dictating allowable value combinations.',
    unit: 2,
    category: 'Constraint Search',
    conceptHref: '/learn/unit-2/csp',
    relatedTerms: ['ac-3', 'mrv'],
  },
  'ac-3': {
    term: 'AC-3 Algorithm',
    definition:
      'An arc-consistency constraint propagation algorithm that iterates over binary constraints and prunes values from variable domains that lack consistent support.',
    unit: 2,
    category: 'Constraint Search',
    conceptHref: '/learn/unit-2/csp',
    formula: 'O(c \\cdot d^3)',
    relatedTerms: ['csp', 'mrv'],
  },
  mrv: {
    term: 'Minimum Remaining Values (MRV)',
    definition:
      'A fail-first variable ordering heuristic for CSPs that chooses the variable with the fewest legal values remaining in its domain.',
    unit: 2,
    category: 'Constraint Search',
    conceptHref: '/learn/unit-2/csp',
    relatedTerms: ['csp', 'ac-3'],
  },
  minimax: {
    term: 'Minimax Algorithm',
    definition:
      'A decision rule used in two-player zero-sum deterministic games that computes optimal moves by assuming the adversary acts to minimize the primary player utility.',
    unit: 2,
    category: 'Adversarial Search',
    conceptHref: '/learn/unit-2/adversarial-search',
    formula: "V(s) = \\max_{a} \\min_{s'} V(s')",
    relatedTerms: ['alpha-beta pruning', 'nash equilibrium'],
  },
  'alpha-beta pruning': {
    term: 'Alpha-Beta Pruning',
    definition:
      'An optimization for minimax search that prunes game-tree branches proven incapable of influencing the final root decision, cutting leaf evaluations from b^d to b^(d/2).',
    unit: 2,
    category: 'Adversarial Search',
    conceptHref: '/learn/unit-2/adversarial-search',
    formula: '\\alpha \\ge \\beta \\implies \\text{Prune}',
    relatedTerms: ['minimax', 'nash equilibrium'],
  },
  'genetic algorithm': {
    term: 'Genetic Algorithm (GA)',
    definition:
      'An evolutionary heuristic optimization technique evolving a population of candidate candidate solutions through selection, crossover, and mutation.',
    unit: 2,
    category: 'Evolutionary Search',
    conceptHref: '/learn/unit-2/genetic-algorithms',
    relatedTerms: ['simulated annealing', 'hill climbing'],
  },
  'nash equilibrium': {
    term: 'Nash Equilibrium',
    definition:
      'A game-theoretic profile of strategies where no player has a unilateral incentive to deviate from their chosen strategy given the strategies of all other players.',
    unit: 2,
    category: 'Game Theory',
    conceptHref: '/learn/unit-2/game-theory',
    relatedTerms: ['minimax', 'adversarial search'],
  },

  // UNIT 3: ML FUNDAMENTALS
  'supervised learning': {
    term: 'Supervised Learning',
    definition:
      'A machine learning paradigm where an algorithm learns a mapping function from input features to ground-truth output labels using paired training instances.',
    unit: 3,
    category: 'ML Paradigms',
    conceptHref: '/learn/unit-3/ml-paradigms',
    relatedTerms: ['unsupervised learning', 'reinforcement learning', 'simple linear regression'],
  },
  'unsupervised learning': {
    term: 'Unsupervised Learning',
    definition:
      'A machine learning paradigm discovering latent patterns, cluster groupings, or manifold dimensionality reduction from unlabeled input data.',
    unit: 3,
    category: 'ML Paradigms',
    conceptHref: '/learn/unit-3/ml-paradigms',
    relatedTerms: ['supervised learning', 'reinforcement learning'],
  },
  'reinforcement learning': {
    term: 'Reinforcement Learning',
    definition:
      'A paradigm where an agent learns an optimal behavioral policy by taking actions in an environment to maximize cumulative numerical reward signals.',
    unit: 3,
    category: 'ML Paradigms',
    conceptHref: '/learn/unit-3/ml-paradigms',
    relatedTerms: ['supervised learning', 'rational agent'],
  },
  'simple linear regression': {
    term: 'Simple Linear Regression',
    definition:
      'A statistical model estimating the linear relationship between a single continuous scalar feature x and continuous target y by minimizing squared residual loss.',
    unit: 3,
    category: 'Regression',
    conceptHref: '/learn/unit-3/simple-linear-regression',
    formula: '\\hat{y} = w_1 x + w_0',
    relatedTerms: ['multiple linear regression', 'ordinary least squares', 'gradient descent'],
  },
  'multiple linear regression': {
    term: 'Multiple Linear Regression',
    definition:
      'A linear regression model predicting a continuous target from two or more explanatory feature variables simultaneously.',
    unit: 3,
    category: 'Regression',
    conceptHref: '/learn/unit-3/multiple-regression',
    formula: '\\hat{y} = X w',
    relatedTerms: ['simple linear regression', 'ordinary least squares', 'ridge regularization'],
  },
  'ordinary least squares': {
    term: 'Ordinary Least Squares (OLS)',
    definition:
      'The closed-form analytical normal equation solution minimizing residual sum of squares: w = (X^T X)^(-1) X^T y.',
    unit: 3,
    category: 'Regression',
    conceptHref: '/learn/unit-3/multiple-regression',
    formula: 'w^* = (X^T X)^{-1} X^T y',
    relatedTerms: ['multiple linear regression', 'gradient descent'],
  },
  'gradient descent': {
    term: 'Gradient Descent',
    definition:
      'A first-order iterative optimization algorithm finding local minima of a differentiable loss function by taking steps proportional to the negative gradient.',
    unit: 3,
    category: 'Optimization',
    conceptHref: '/learn/unit-3/gradient-descent',
    formula: 'w := w - \\alpha \\nabla J(w)',
    relatedTerms: ['learning rate', 'simple linear regression', 'logistic regression'],
  },
  'learning rate': {
    term: 'Learning Rate (alpha)',
    definition:
      'The step-size hyperparameter in gradient descent governing the magnitude of parameter updates at each optimization iteration.',
    unit: 3,
    category: 'Optimization',
    conceptHref: '/learn/unit-3/gradient-descent',
    formula: '\\alpha',
    relatedTerms: ['gradient descent', 'bias-variance tradeoff'],
  },
  'mean squared error': {
    term: 'Mean Squared Error (MSE)',
    definition:
      'The average squared difference between model predictions and true observed values, heavily penalizing large residual deviations.',
    unit: 3,
    category: 'Evaluation Metrics',
    conceptHref: '/learn/unit-3/regression-metrics',
    formula: '\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i)^2',
    relatedTerms: ['r-squared', 'ordinary least squares'],
  },
  'r-squared': {
    term: 'R-Squared (Coefficient of Determination)',
    definition:
      'A statistical metric expressing the proportion of total variance in the target variable explained by the regression features relative to a baseline mean predictor.',
    unit: 3,
    category: 'Evaluation Metrics',
    conceptHref: '/learn/unit-3/regression-metrics',
    formula: 'R^2 = 1 - \\frac{\\text{SS}_{\\text{res}}}{\\text{SS}_{\\text{tot}}}',
    relatedTerms: ['mean squared error', 'simple linear regression'],
  },
  'polynomial regression': {
    term: 'Polynomial Regression',
    definition:
      'A form of regression modeling non-linear relationships by mapping input features into d-th degree polynomial power representations.',
    unit: 3,
    category: 'Regression',
    conceptHref: '/learn/unit-3/polynomial-regression',
    formula: '\\hat{y} = w_0 + w_1 x + w_2 x^2 + \\dots + w_d x^d',
    relatedTerms: ['bias-variance tradeoff', 'ridge regularization'],
  },
  'bias-variance tradeoff': {
    term: 'Bias-Variance Tradeoff',
    definition:
      'The fundamental decomposition of generalization error into underfitting bias (inflexible model) and overfitting variance (excessive sensitivity to training fluctuations).',
    unit: 3,
    category: 'ML Theory',
    conceptHref: '/learn/unit-3/bias-variance',
    formula: '\\text{Error} = \\text{Bias}^2 + \\text{Variance} + \\sigma^2',
    relatedTerms: ['polynomial regression', 'ridge regularization', 'tree pruning'],
  },
  'locally weighted regression': {
    term: 'Locally Weighted Regression (LWR)',
    definition:
      'A non-parametric lazy regression algorithm that fits a local linear model for each query point using Gaussian distance-weighted least squares.',
    unit: 3,
    category: 'Non-Parametric ML',
    conceptHref: '/learn/unit-3/locally-weighted-regression',
    formula: 'w_i = \\exp\\left(-\\frac{\\|x_i - x_q\\|^2}{2\\tau^2}\\right)',
    relatedTerms: ['k-nearest neighbors', 'simple linear regression'],
  },
  'feature scaling': {
    term: 'Feature Scaling (Standardization)',
    definition:
      'Transforming feature dimensions to zero mean and unit variance z = (x - mu) / sigma to equalize gradient rates and prevent distance distortion.',
    unit: 3,
    category: 'Preprocessing',
    conceptHref: '/learn/unit-3/feature-engineering',
    formula: 'z = \\frac{x - \\mu}{\\sigma}',
    relatedTerms: ['gradient descent', 'k-nearest neighbors', 'support vector machine'],
  },
  'ridge regularization': {
    term: 'Ridge Regularization (L2)',
    definition:
      'A regularized least-squares method adding an L2 squared weight penalty lambda * ||w||^2 to the loss, shrinking parameters smoothly to combat multicollinearity.',
    unit: 3,
    category: 'Regularization',
    conceptHref: '/learn/unit-3/regularization',
    formula: 'J(w) = \\text{MSE} + \\lambda \\|w\\|_2^2',
    relatedTerms: ['lasso regularization', 'elastic net', 'bias-variance tradeoff'],
  },
  'lasso regularization': {
    term: 'Lasso Regularization (L1)',
    definition:
      'A regularized regression technique adding an L1 absolute weight penalty lambda * ||w||_1 to the loss, driving non-informative coefficients exactly to zero for feature selection.',
    unit: 3,
    category: 'Regularization',
    conceptHref: '/learn/unit-3/regularization',
    formula: 'J(w) = \\text{MSE} + \\lambda \\|w\\|_1',
    relatedTerms: ['ridge regularization', 'elastic net'],
  },
  'elastic net': {
    term: 'Elastic Net',
    definition:
      'A regularized regression model combining L1 and L2 penalties in convex combination to encourage sparsity while maintaining grouping stability among correlated features.',
    unit: 3,
    category: 'Regularization',
    conceptHref: '/learn/unit-3/regularization',
    formula: 'J(w) = \\text{MSE} + \\lambda_1 \\|w\\|_1 + \\lambda_2 \\|w\\|_2^2',
    relatedTerms: ['ridge regularization', 'lasso regularization'],
  },
  'cross validation': {
    term: 'K-Fold Cross-Validation',
    definition:
      'A model validation technique partitioning the dataset into K disjoint folds, iteratively training on K-1 folds and validating on the remaining fold to evaluate generalization.',
    unit: 3,
    category: 'Model Evaluation',
    conceptHref: '/learn/unit-3/cross-validation',
    relatedTerms: ['bias-variance tradeoff', 'feature scaling'],
  },

  // UNIT 4: INSTANCES & PROBABILISTIC MODELS
  'bayes theorem': {
    term: "Bayes' Theorem",
    definition:
      'The foundational formula of probabilistic inference relating the posterior probability of a hypothesis to its prior, likelihood, and marginal evidence.',
    unit: 4,
    category: 'Probabilistic Reasoning',
    conceptHref: '/learn/unit-4/bayes-theorem',
    formula: 'P(C|X) = \\frac{P(X|C) P(C)}{P(X)}',
    relatedTerms: ['prior probability', 'posterior probability', 'naive bayes'],
  },
  'prior probability': {
    term: 'Prior Probability P(C)',
    definition:
      'The baseline unconditional probability of a hypothesis or class prior to observing feature evidence.',
    unit: 4,
    category: 'Probabilistic Reasoning',
    conceptHref: '/learn/unit-4/bayes-theorem',
    formula: 'P(C)',
    relatedTerms: ['posterior probability', 'base rate fallacy'],
  },
  'posterior probability': {
    term: 'Posterior Probability P(C|X)',
    definition:
      'The updated conditional probability of a class hypothesis after incorporating observed feature evidence X through Bayes theorem.',
    unit: 4,
    category: 'Probabilistic Reasoning',
    conceptHref: '/learn/unit-4/bayes-theorem',
    formula: 'P(C|X)',
    relatedTerms: ['bayes theorem', 'prior probability'],
  },
  'base rate fallacy': {
    term: 'Base Rate Fallacy',
    definition:
      'A cognitive distortion where people misjudge posterior risk by ignoring rare prior disease prevalence in screening diagnostic tests.',
    unit: 4,
    category: 'Probabilistic Reasoning',
    conceptHref: '/learn/unit-4/bayes-theorem',
    relatedTerms: ['prior probability', 'accuracy paradox'],
  },
  'naive bayes': {
    term: 'Naive Bayes Classifier',
    definition:
      'A generative probabilistic classifier applying Bayes theorem under the strong simplifying assumption that all input features are conditionally independent given the class label.',
    unit: 4,
    category: 'Probabilistic ML',
    conceptHref: '/learn/unit-4/naive-bayes',
    formula: 'P(C|x_1, \\dots, x_d) \\propto P(C) \\prod_{i=1}^d P(x_i|C)',
    relatedTerms: ['conditional independence', 'laplace smoothing', 'bayes theorem'],
  },
  'conditional independence': {
    term: 'Conditional Independence',
    definition:
      'The mathematical condition stating that observing feature X1 yields no extra predictive power regarding X2 once class label C is known: P(X1, X2 | C) = P(X1 | C) P(X2 | C).',
    unit: 4,
    category: 'Probabilistic ML',
    conceptHref: '/learn/unit-4/naive-bayes',
    formula: 'P(X_1, X_2|C) = P(X_1|C) P(X_2|C)',
    relatedTerms: ['naive bayes', 'bayes theorem'],
  },
  'laplace smoothing': {
    term: 'Laplace (Additive) Smoothing',
    definition:
      'A probability estimation technique adding a pseudo-count alpha to observed counts, preventing unseen vocabulary tokens from collapsing the posterior probability to zero.',
    unit: 4,
    category: 'Probabilistic ML',
    conceptHref: '/learn/unit-4/laplace-smoothing',
    formula: '\\hat{P}(w|C) = \\frac{N_{wc} + \\alpha}{N_c + \\alpha |V|}',
    relatedTerms: ['naive bayes', 'conditional independence'],
  },
  'logistic regression': {
    term: 'Logistic Regression',
    definition:
      'A linear classification model that maps a linear combination of input features into predicted probability bounds (0, 1) using the logistic sigmoid link function.',
    unit: 4,
    category: 'Classification',
    conceptHref: '/learn/unit-4/logistic-regression',
    formula: 'P(y=1|x) = \\sigma(w^T x + b) = \\frac{1}{1 + e^{-(w^T x + b)}}',
    relatedTerms: ['sigmoid function', 'cross-entropy loss', 'gradient descent'],
  },
  'sigmoid function': {
    term: 'Sigmoid Function (Logistic Curve)',
    definition:
      'A smooth, monotonic S-shaped activation function sigma(z) = 1 / (1 + exp(-z)) mapping real values into probabilities between 0 and 1.',
    unit: 4,
    category: 'Classification',
    conceptHref: '/learn/unit-4/logistic-regression',
    formula: '\\sigma(z) = \\frac{1}{1 + e^{-z}}',
    relatedTerms: ['logistic regression', 'cross-entropy loss'],
  },
  'cross-entropy loss': {
    term: 'Cross-Entropy Loss (Log-Loss)',
    definition:
      'The convex loss function used in logistic regression penalizing diverging probability predictions logarithmically.',
    unit: 4,
    category: 'Classification',
    conceptHref: '/learn/unit-4/logistic-regression',
    formula: 'L = -\\left[y \\ln p + (1-y) \\ln(1-p)\\right]',
    relatedTerms: ['logistic regression', 'gradient descent'],
  },
  'confusion matrix': {
    term: 'Confusion Matrix',
    definition:
      'A 2x2 layout table contrasting true binary target labels against model predictions: True Positives (TP), False Positives (FP), False Negatives (FN), and True Negatives (TN).',
    unit: 4,
    category: 'Evaluation Metrics',
    conceptHref: '/learn/unit-4/classification-metrics',
    relatedTerms: ['precision', 'recall', 'accuracy paradox'],
  },
  'accuracy paradox': {
    term: 'Accuracy Paradox',
    definition:
      'The phenomenon where a naive trivial model predicting only the majority class scores 99% accuracy on highly imbalanced data despite producing zero practical utility.',
    unit: 4,
    category: 'Evaluation Metrics',
    conceptHref: '/learn/unit-4/classification-metrics',
    relatedTerms: ['confusion matrix', 'precision', 'recall'],
  },
  precision: {
    term: 'Precision (Positive Predictive Value)',
    definition:
      'The proportion of positive model predictions that are genuinely positive: TP / (TP + FP).',
    unit: 4,
    category: 'Evaluation Metrics',
    conceptHref: '/learn/unit-4/classification-metrics',
    formula: '\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}',
    relatedTerms: ['recall', 'f1 score', 'confusion matrix'],
  },
  recall: {
    term: 'Recall (Sensitivity, True Positive Rate)',
    definition:
      'The proportion of actual positive cases successfully identified by the classifier: TP / (TP + FN).',
    unit: 4,
    category: 'Evaluation Metrics',
    conceptHref: '/learn/unit-4/classification-metrics',
    formula: '\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}',
    relatedTerms: ['precision', 'f1 score', 'roc curve'],
  },
  'f1 score': {
    term: 'F1 Score',
    definition:
      'The harmonic mean of precision and recall, balancing both metrics when class distributions are asymmetric.',
    unit: 4,
    category: 'Evaluation Metrics',
    conceptHref: '/learn/unit-4/classification-metrics',
    formula:
      'F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}',
    relatedTerms: ['precision', 'recall', 'confusion matrix'],
  },
  'roc curve': {
    term: 'ROC Curve (Receiver Operating Characteristic)',
    definition:
      'A graphical curve plotting True Positive Rate (Sensitivity) against False Positive Rate (1 - Specificity) across sweeping decision thresholds.',
    unit: 4,
    category: 'Evaluation Metrics',
    conceptHref: '/learn/unit-4/roc-auc',
    formula: '\\text{FPR} = \\frac{\\text{FP}}{\\text{FP} + \\text{TN}}',
    relatedTerms: ['auc', 'recall', 'confusion matrix'],
  },
  auc: {
    term: 'AUC (Area Under the ROC Curve)',
    definition:
      'The aggregate probability that a classifier ranks a randomly chosen positive instance higher than a randomly chosen negative instance, ranging from 0.5 (random) to 1.0 (perfect).',
    unit: 4,
    category: 'Evaluation Metrics',
    conceptHref: '/learn/unit-4/roc-auc',
    formula: '\\text{AUC} \\in [0.5, 1.0]',
    relatedTerms: ['roc curve', 'confusion matrix'],
  },
  'k-nearest neighbors': {
    term: 'k-Nearest Neighbors (k-NN)',
    definition:
      'An instance-based non-parametric lazy learner classifying a query point based on the majority vote or distance-weighted vote of its k nearest training samples.',
    unit: 4,
    category: 'Instance-Based ML',
    conceptHref: '/learn/unit-4/knn',
    relatedTerms: ['minkowski distance', 'curse of dimensionality', 'feature scaling'],
  },
  'minkowski distance': {
    term: 'Minkowski Distance',
    definition:
      'A generalized family of metric distances between vectors: L1 (Manhattan) when p=1, L2 (Euclidean) when p=2, and Chebyshev as p approaches infinity.',
    unit: 4,
    category: 'Instance-Based ML',
    conceptHref: '/learn/unit-4/knn',
    formula: 'D(x, y) = \\left( \\sum_{i=1}^d |x_i - y_i|^p \\right)^{1/p}',
    relatedTerms: ['k-nearest neighbors', 'curse of dimensionality'],
  },
  'curse of dimensionality': {
    term: 'Curse of Dimensionality',
    definition:
      'The geometric phenomenon where hyperspace volume expands exponentially with feature count d, causing all pairwise sample distances to become approximately equidistant and rendering proximity metrics ineffective.',
    unit: 4,
    category: 'Instance-Based ML',
    conceptHref: '/learn/unit-4/knn',
    formula: '\\lim_{d \\to \\infty} \\frac{d_{\\max} - d_{\\min}}{d_{\\min}} \\to 0',
    relatedTerms: ['k-nearest neighbors', 'minkowski distance'],
  },
  'variational inference': {
    term: 'Variational Inference (VI)',
    definition:
      'A deterministic Bayesian approximation technique that converts intractable posterior distribution estimation into an optimization task by maximizing the Evidence Lower Bound.',
    unit: 4,
    category: 'Advanced Probabilistic',
    conceptHref: '/learn/unit-4/variational-inference',
    relatedTerms: ['elbo', 'bayes theorem'],
  },
  elbo: {
    term: 'Evidence Lower Bound (ELBO)',
    definition:
      'The objective function optimized in variational inference that balances data likelihood reconstruction with Kullback-Leibler divergence from the prior.',
    unit: 4,
    category: 'Advanced Probabilistic',
    conceptHref: '/learn/unit-4/variational-inference',
    formula: '\\ln p(x) = \\text{ELBO} + D_{\\text{KL}}(q \\parallel p)',
    relatedTerms: ['variational inference', 'bayes theorem'],
  },

  // UNIT 5: LINEAR & DECISION MODELS
  'decision tree': {
    term: 'Decision Tree',
    definition:
      'A non-parametric hierarchical model that recursively partitions the feature space into orthogonal axis-aligned hyper-rectangles using greedy greedy impurity reduction splits.',
    unit: 5,
    category: 'Decision Trees',
    conceptHref: '/learn/unit-5/decision-trees',
    relatedTerms: ['shannon entropy', 'gini impurity', 'information gain', 'tree pruning'],
  },
  'shannon entropy': {
    term: 'Shannon Entropy H(S)',
    definition:
      'The fundamental information-theoretic metric quantifying the expected uncertainty or impurity in a discrete class distribution.',
    unit: 5,
    category: 'Decision Trees',
    conceptHref: '/learn/unit-5/impurity-split-criteria',
    formula: 'H(S) = -\\sum_{i=1}^k p_i \\log_2(p_i)',
    relatedTerms: ['information gain', 'gini impurity', 'decision tree'],
  },
  'information gain': {
    term: 'Information Gain (IG)',
    definition:
      'The reduction in expected entropy achieved by partitioning a sample dataset according to a candidate attribute split.',
    unit: 5,
    category: 'Decision Trees',
    conceptHref: '/learn/unit-5/decision-trees',
    formula: 'IG(S, A) = H(S) - \\sum_{v \\in \\text{Values}(A)} \\frac{|S_v|}{|S|} H(S_v)',
    relatedTerms: ['shannon entropy', 'gain ratio', 'decision tree'],
  },
  'gini impurity': {
    term: 'Gini Impurity',
    definition:
      'A computational split metric used in CART measuring the probability that a randomly chosen element would be incorrectly labeled if classified according to the subset class distribution.',
    unit: 5,
    category: 'Decision Trees',
    conceptHref: '/learn/unit-5/impurity-split-criteria',
    formula: 'I_G(S) = 1 - \\sum_{i=1}^k p_i^2',
    relatedTerms: ['shannon entropy', 'information gain', 'decision tree'],
  },
  'gain ratio': {
    term: 'Gain Ratio',
    definition:
      'The split metric used in C4.5 that normalizes Information Gain by the split information value to penalize high-cardinality attributes like ID numbers.',
    unit: 5,
    category: 'Decision Trees',
    conceptHref: '/learn/unit-5/impurity-split-criteria',
    formula: '\\text{GainRatio}(S, A) = \\frac{IG(S, A)}{\\text{SplitInfo}(S, A)}',
    relatedTerms: ['information gain', 'shannon entropy'],
  },
  'tree pruning': {
    term: 'Tree Pruning',
    definition:
      'The systematic removal of statistically insignificant subtrees to reduce model variance, prevent leaf memorization, and enhance test set generalization.',
    unit: 5,
    category: 'Decision Trees',
    conceptHref: '/learn/unit-5/tree-pruning',
    relatedTerms: ['cost-complexity pruning', 'decision tree', 'bias-variance tradeoff'],
  },
  'cost-complexity pruning': {
    term: 'Cost-Complexity Pruning (alpha-Pruning)',
    definition:
      'A post-pruning technique minimizing the cost function R_alpha(T) = R(T) + alpha * |T|, penalizing tree leaf count through regularization parameter alpha.',
    unit: 5,
    category: 'Decision Trees',
    conceptHref: '/learn/unit-5/tree-pruning',
    formula: 'R_\\alpha(T) = R(T) + \\alpha |T|',
    relatedTerms: ['tree pruning', 'decision tree'],
  },
  'support vector machine': {
    term: 'Support Vector Machine (SVM)',
    definition:
      'A maximum-margin supervised learning algorithm that determines the optimal separating hyperplane maximizing the clearance corridor to the nearest training instances.',
    unit: 5,
    category: 'Support Vector Machines',
    conceptHref: '/learn/unit-5/svm-fundamentals',
    formula:
      '\\min_{w, b} \\frac{1}{2} \\|w\\|^2 \\quad \\text{s.t.} \\quad y_i(w^T x_i + b) \\ge 1',
    relatedTerms: ['maximum margin', 'support vectors', 'kernel trick'],
  },
  'maximum margin': {
    term: 'Maximum Margin',
    definition:
      'The geometric orthogonal width 2 / ||w|| separating canonical hyperplanes w^T x + b = +1 and w^T x + b = -1.',
    unit: 5,
    category: 'Support Vector Machines',
    conceptHref: '/learn/unit-5/svm-fundamentals',
    formula: '\\text{Margin Width} = \\frac{2}{\\|w\\|}',
    relatedTerms: ['support vector machine', 'support vectors'],
  },
  'support vectors': {
    term: 'Support Vectors',
    definition:
      'The critical subset of training instances that lie exactly on the margin boundaries w^T x + b = +-1 or violate them, exclusively determining the optimal hyperplane orientation.',
    unit: 5,
    category: 'Support Vector Machines',
    conceptHref: '/learn/unit-5/svm-fundamentals',
    relatedTerms: ['support vector machine', 'maximum margin', 'soft margin'],
  },
  'soft margin': {
    term: 'Soft-Margin SVM (C Parameter)',
    definition:
      'The SVM formulation introducing slack variables xi_i >= 0 and regularization parameter C to permit controlled margin violations on noisy non-linearly separable data.',
    unit: 5,
    category: 'Support Vector Machines',
    conceptHref: '/learn/unit-5/svm-fundamentals',
    formula: '\\min \\frac{1}{2}\\|w\\|^2 + C \\sum_{i=1}^n \\xi_i',
    relatedTerms: ['support vector machine', 'support vectors'],
  },
  'kernel trick': {
    term: 'The Kernel Trick',
    definition:
      'A mathematical technique allowing linear algorithms to learn non-linear boundaries by replacing dot products with kernel functions K(x, z) = phi(x)^T phi(z) without explicitly evaluating high-dimensional mappings.',
    unit: 5,
    category: 'Support Vector Machines',
    conceptHref: '/learn/unit-5/svm-kernels',
    formula: 'K(x, z) = \\phi(x)^T \\phi(z)',
    relatedTerms: ['rbf kernel', 'support vector machine'],
  },
  'rbf kernel': {
    term: 'Radial Basis Function (RBF) Kernel',
    definition:
      'A popular stationary kernel function K(x, z) = exp(-gamma * ||x - z||^2) implicitly lifting feature points into an infinite-dimensional reproducing kernel Hilbert space.',
    unit: 5,
    category: 'Support Vector Machines',
    conceptHref: '/learn/unit-5/svm-kernels',
    formula: 'K(x, z) = \\exp(-\\gamma \\|x - z\\|^2)',
    relatedTerms: ['kernel trick', 'support vector machine'],
  },
  'ensemble learning': {
    term: 'Ensemble Learning',
    definition:
      'A meta-learning paradigm training multiple diverse base models and combining their predictions to achieve superior predictive accuracy and lower generalization error.',
    unit: 5,
    category: 'Ensemble Methods',
    conceptHref: '/learn/unit-5/ensemble-significance',
    relatedTerms: ['bagging', 'random forest', 'adaboost', 'stacking'],
  },
  bagging: {
    term: 'Bootstrap Aggregating (Bagging)',
    definition:
      'An ensemble technique training independent base estimators on bootstrap samples of the training data and combining their outputs via uniform voting or averaging to reduce variance.',
    unit: 5,
    category: 'Ensemble Methods',
    conceptHref: '/learn/unit-5/bagging-random-forests',
    relatedTerms: ['random forest', 'out-of-bag error', 'ensemble learning'],
  },
  'out-of-bag error': {
    term: 'Out-of-Bag (OOB) Error',
    definition:
      'The mean cross-validation error computed on each training sample using only the ensemble trees that excluded that sample during bootstrap drawing (approximately 36.8% of trees).',
    unit: 5,
    category: 'Ensemble Methods',
    conceptHref: '/learn/unit-5/bagging-random-forests',
    formula:
      '\\lim_{n \\to \\infty} \\left(1 - \\frac{1}{n}\\right)^n = \\frac{1}{e} \\approx 0.368',
    relatedTerms: ['bagging', 'random forest'],
  },
  'random forest': {
    term: 'Random Forest',
    definition:
      'An ensemble of unpruned decision trees combining bootstrap sample bagging with random feature subspace selection (m = sqrt(d)) at each split to strictly decorrelate individual trees.',
    unit: 5,
    category: 'Ensemble Methods',
    conceptHref: '/learn/unit-5/bagging-random-forests',
    formula: 'm = \\lfloor \\sqrt{d} \\rfloor',
    relatedTerms: ['bagging', 'out-of-bag error', 'decision tree'],
  },
  adaboost: {
    term: 'AdaBoost (Adaptive Boosting)',
    definition:
      'A sequential boosting algorithm that fits consecutive weak decision stumps, exponentially increasing sample weights for misclassified instances to force focus on difficult cases.',
    unit: 5,
    category: 'Ensemble Methods',
    conceptHref: '/learn/unit-5/adaboost',
    formula: '\\alpha_t = \\frac{1}{2} \\ln\\left(\\frac{1 - \\epsilon_t}{\\epsilon_t}\\right)',
    relatedTerms: ['ensemble learning', 'decision tree', 'stacking'],
  },
  stacking: {
    term: 'Stacking (Stacked Generalization)',
    definition:
      'An ensemble framework where out-of-fold predictions from multiple heterogeneous base models serve as input meta-features to train a second-level meta-learner.',
    unit: 5,
    category: 'Ensemble Methods',
    conceptHref: '/learn/unit-5/boosting-stacking',
    relatedTerms: ['ensemble learning', 'bagging', 'adaboost'],
  },
};
