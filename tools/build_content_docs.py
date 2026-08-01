import json
import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(ROOT_DIR, "docs")
os.makedirs(DOCS_DIR, exist_ok=True)

with open(os.path.join(DOCS_DIR, "syllabus.json"), "r", encoding="utf-8") as f:
    syllabus = json.load(f)

# Content mapping definition
content_map = []

mapping_data = {
    # Unit 1
    "u1-history-foundations": {
        "status": "covered",
        "sources": ["Unit 1/3_Unit I Introduction_History and Foundation.pdf"],
        "notes": "Covers Turing test, Dartmouth 1956, AI winters, modern resurgence.",
        "seed_lab": "timeline/ai-milestones"
    },
    "u1-types-applications": {
        "status": "covered",
        "sources": ["Unit 1/1_Unit I Articial I Intelligence Introduction and Applications.pdf"],
        "notes": "Covers ANI, AGI, ASI; NLP, vision, robotics, healthcare domains.",
        "seed_lab": "ai-types-classifier"
    },
    "u1-ethics-impact": {
        "status": "partial",
        "sources": ["Unit 1/1_Unit I Articial I Intelligence Introduction and Applications.pdf"],
        "notes": "Slide mentions bias, job displacement, autonomous weapons briefly. Needs concrete scenario cards.",
        "seed_lab": "ethics/trolley-self-driving"
    },
    "u1-intelligent-agents": {
        "status": "covered",
        "sources": ["Unit 1/2_Unit I Intelligent_Rational Agent.pdf", "Unit 1/Vaccum_Cleaner.ipynb"],
        "notes": "PEAS framework, environment characteristics, 4 agent architectures, vacuum cleaner world.",
        "seed_lab": "agent/vacuum-peas"
    },
    "u1-knowledge-representation": {
        "status": "covered",
        "sources": ["Unit 1/4_Logic.pdf"],
        "notes": "Propositional logic, syntax, semantics, truth tables, entailment.",
        "seed_lab": "logic/truth-tables"
    },
    "u1-first-order-logic": {
        "status": "covered",
        "sources": ["Unit 1/4_Logic.pdf", "Unit 1/FamilyTree.pl", "Unit 1/STUDENT_TEACHER.pl"],
        "notes": "Predicates, quantifiers (∀, ∃), unification, resolution, Prolog family tree.",
        "seed_lab": "logic/fol-unification"
    },
    "u1-rule-based-reasoning": {
        "status": "covered",
        "sources": ["Unit 1/Firstexample.pl", "Unit 1/Recommendation.pl", "Unit 1/trans.pl", "Unit 1/blood.pl"],
        "notes": "Forward chaining vs backward chaining mechanisms, rule engines.",
        "seed_lab": "rules/chaining-visualizer"
    },
    "u1-expert-systems": {
        "status": "partial",
        "sources": ["Unit 1/Recommendation.pl", "Unit 1/blood.pl"],
        "notes": "Prolog inference engines demonstrate the knowledge base + inference engine, but explanation facilities need full interactive UI.",
        "seed_lab": "expert/mini-system"
    },
    "u1-knowledge-acquisition": {
        "status": "partial",
        "sources": ["Unit 1/4_Logic.pdf"],
        "notes": "Mentioned briefly in logic notes; needs explicit knowledge engineer cycle and elicitation methods.",
        "seed_lab": "expert/knowledge-pipeline"
    },
    "u1-case-medical": {
        "status": "partial",
        "sources": ["Unit 1/blood.pl", "Unit 1/blood(1).pl"],
        "notes": "Blood compatibility/donor Prolog code exists; needs interactive medical diagnostic UI with why/how explanation facility.",
        "seed_lab": "case-studies/medical-diagnosis"
    },
    "u1-case-self-driving": {
        "status": "gap",
        "sources": [],
        "notes": "Syllabus case study. Not in source files. Needs perception-action PEAS loop simulator.",
        "seed_lab": "case-studies/self-driving-peas"
    },
    "u1-self-chatbot": {
        "status": "covered",
        "sources": ["Unit 1/eliza.pl"],
        "notes": "ELIZA pattern-matching chatbot code in Prolog. To be re-implemented as client-side pattern matching engine.",
        "seed_lab": "chatbot/eliza-pattern"
    },
    "u1-self-prompt-eng": {
        "status": "gap",
        "sources": [],
        "notes": "Syllabus self-study topic. Needs static prompt-engineering sandbox (role, context, few-shot, chain-of-thought demo).",
        "seed_lab": "prompt/prompt-sandbox"
    },
    "u1-further-agi": {
        "status": "gap",
        "sources": [],
        "notes": "Syllabus further reading. Author from canonical literature (Bostrom, Russell, Turing test limitations).",
        "seed_lab": "readings/agi-frontiers"
    },

    # Unit 2
    "u2-state-space-search": {
        "status": "covered",
        "sources": ["UNIT II/Search Stratergies Lecture 1.pdf", "UNIT II/Uninformed Search Stratergies.pdf"],
        "notes": "State formulation, initial state, actions, transition model, goal test, path cost.",
        "seed_lab": "search/state-space-builder"
    },
    "u2-uninformed-search": {
        "status": "covered",
        "sources": ["UNIT II/Uninformed Search Stratergies.pdf", "UNIT II/DFS.ipynb", "UNIT II/BFS DEMO.pptx", "UNIT II/missionariesandcannibals_BFS.ipynb", "UNIT II/MAZE/maze.py", "UNIT II/mc.py", "UNIT II/mc.pl"],
        "notes": "BFS, DFS, DLS, IDDFS, Bidirectional search. Rich implementations in notebooks.",
        "seed_lab": "search/uninformed-race"
    },
    "u2-informed-search": {
        "status": "covered",
        "sources": ["UNIT II/Informed Search.pdf", "UNIT II/A_STAR.ipynb"],
        "notes": "Greedy Best-First, A*, heuristic admissibility h(n) <= h*(n), consistency / monotonicity.",
        "seed_lab": "search/astar-admissibility"
    },
    "u2-local-search": {
        "status": "covered",
        "sources": ["UNIT II/Local Search Algorithms.pdf", "UNIT II/AIHC.ipynb"],
        "notes": "Hill climbing, steepest ascent, local maxima, plateaus, ridges, random restart.",
        "seed_lab": "search/hill-climb-landscape"
    },
    "u2-csp": {
        "status": "covered",
        "sources": ["UNIT II/CSP.pdf", "UNIT II/NQueen.ipynb"],
        "notes": "Variables, domains, constraints; backtracking, AC-3 constraint propagation, forward checking, MRV/LCV.",
        "seed_lab": "csp/nqueens-ac3"
    },
    "u2-adversarial-search": {
        "status": "covered",
        "sources": ["UNIT II/Adversarial Search.pdf", "UNIT II/MinMax.ipynb", "UNIT II/AlphaBeta.ipynb"],
        "notes": "Zero-sum games, game tree, Minimax value recursion, Alpha-Beta pruning guarantees.",
        "seed_lab": "game/minimax-alphabeta"
    },
    "u2-case-gps": {
        "status": "partial",
        "sources": ["UNIT II/Informed Search.pdf"],
        "notes": "Romania map routing covered in slides; needs full interactive GPS graph navigator with distance heuristics.",
        "seed_lab": "case-studies/gps-navigator"
    },
    "u2-case-chess": {
        "status": "partial",
        "sources": ["UNIT II/Adversarial Search.pdf"],
        "notes": "Evaluation functions mentioned; needs interactive chess board evaluation explainer & mini Play-vs-AI.",
        "seed_lab": "case-studies/chess-evaluation"
    },
    "u2-self-genetic": {
        "status": "covered",
        "sources": ["UNIT II/GENETIC ALGORITHM.pdf", "UNIT II/GeneticAlgorithm.ipynb"],
        "notes": "Chromosomes, fitness function, selection, crossover, mutation, convergence.",
        "seed_lab": "search/genetic-algorithm-lab"
    },
    "u2-further-game-theory": {
        "status": "partial",
        "sources": ["UNIT II/Adversarial Search.pdf"],
        "notes": "Payoff matrix touched lightly. Needs Prisoner's Dilemma, Nash Equilibrium interactive lab.",
        "seed_lab": "game/payoff-matrix"
    },

    # Unit 3
    "u3-ml-paradigms": {
        "status": "covered",
        "sources": ["UNIT III Machine Learning Fundamentals/1_INTRODUCTION MACHINE LEARNING.pdf", "UNIT III Machine Learning Fundamentals/2_ML_TASK_Features.pdf"],
        "notes": "Supervised vs Unsupervised vs Reinforcement learning paradigms and task types.",
        "seed_lab": "paradigms/paradigm-sorter"
    },
    "u3-simple-linear-regression": {
        "status": "covered",
        "sources": ["UNIT III Machine Learning Fundamentals/3_Linear_Regression_Introduction.pdf", "UNIT III Machine Learning Fundamentals/4_Linear Regression Cost Function.pdf", "UNIT III Machine Learning Fundamentals/Linear Regression/SimpleRegression.ipynb", "UNIT III Machine Learning Fundamentals/Linear Regression/Salary_Data.csv"],
        "notes": "OLS line fitting, MSE cost surface J(theta_0, theta_1), salary dataset.",
        "seed_lab": "reg/drag-points-regression"
    },
    "u3-gradient-descent": {
        "status": "covered",
        "sources": ["UNIT III Machine Learning Fundamentals/Linear Regression/GradientDescent.ipynb", "UNIT III Machine Learning Fundamentals/Linear Regression/LinearRegressionGD.ipynb", "UNIT III Machine Learning Fundamentals/Linear Regression/Linear_Regression_Gradient_Descent_IMP.ipynb"],
        "notes": "Batch gradient descent update step, learning rate alpha tuning, divergence animation.",
        "seed_lab": "reg/cost-contour-gd"
    },
    "u3-multiple-linear-regression": {
        "status": "covered",
        "sources": ["UNIT III Machine Learning Fundamentals/Linear Regression/MLR.ipynb", "UNIT III Machine Learning Fundamentals/Linear Regression/Linear_X_Train.csv", "UNIT III Machine Learning Fundamentals/Linear Regression/Linear_Y_Train.csv"],
        "notes": "Matrix formulation, normal equation (X^T X)^-1 X^T y, multi-feature regression.",
        "seed_lab": "reg/multiple-regression"
    },
    "u3-polynomial-regression": {
        "status": "covered",
        "sources": ["UNIT III Machine Learning Fundamentals/5_Polynomial regression.pdf", "UNIT III Machine Learning Fundamentals/Linear Regression/ML_LAB_AS_4B.ipynb"],
        "notes": "Non-linear feature expansion, degree slider, underfitting vs overfitting.",
        "seed_lab": "reg/polynomial-overfit"
    },
    "u3-bias-variance-tradeoff": {
        "status": "covered",
        "sources": ["UNIT III Machine Learning Fundamentals/6_BiasVariance.pptx.pdf"],
        "notes": "High bias (underfitting) vs high variance (overfitting), irreducible error, model complexity curve.",
        "seed_lab": "reg/bias-variance-curve"
    },
    "u3-locally-weighted-regression": {
        "status": "covered",
        "sources": ["UNIT III Machine Learning Fundamentals/7_Locally Weighted Linear Regression.pdf", "UNIT III Machine Learning Fundamentals/Linear Regression/LoWtLiRr.ipynb"],
        "notes": "Non-parametric regression, kernel weighting matrix W, bandwidth tau parameter.",
        "seed_lab": "reg/lwr-bandwidth"
    },
    "u3-feature-engineering": {
        "status": "covered",
        "sources": ["UNIT III Machine Learning Fundamentals/Feature Engineering/FeatureEngg.ipynb", "UNIT III Machine Learning Fundamentals/Feature Engineering/Numpy.ipynb", "UNIT III Machine Learning Fundamentals/Feature Engineering/Pandas.ipynb"],
        "notes": "StandardScaler, MinMaxScaler, one-hot encoding, missing value imputation.",
        "seed_lab": "fe/feature-pipeline-lab"
    },
    "u3-regression-metrics": {
        "status": "covered",
        "sources": ["UNIT III Machine Learning Fundamentals/Linear Regression/FirstLR_MSE.py.ipynb", "UNIT III Machine Learning Fundamentals/Linear Regression/SimpleRegression.ipynb"],
        "notes": "Formulas and properties for MSE, RMSE, MAE, R-squared.",
        "seed_lab": "eval/regression-metrics"
    },
    "u3-case-real-estate": {
        "status": "covered",
        "sources": ["UNIT III Machine Learning Fundamentals/Linear Regression/kc_house_data.csv"],
        "notes": "King County house prices dataset with bedrooms, sqft_living, price. Subset to <= 200 KB for web build.",
        "seed_lab": "case-studies/house-price-prediction"
    },
    "u3-case-healthcare": {
        "status": "gap",
        "sources": [],
        "notes": "Syllabus case study. Not in source files. Create clean, curated medical progression/cost regression case study.",
        "seed_lab": "case-studies/healthcare-regression"
    },
    "u3-self-regularization": {
        "status": "partial",
        "sources": ["UNIT III Machine Learning Fundamentals/Linear Regression/Ridge_Lasso.ipynb"],
        "notes": "Ridge (L2) and Lasso (L1) covered in notebook. Elastic Net must be authored.",
        "seed_lab": "reg/regularization-shrinkage"
    },
    "u3-further-kfold-cv": {
        "status": "gap",
        "sources": [],
        "notes": "Syllabus further reading. Build interactive K-fold CV split & validation score variance explorer.",
        "seed_lab": "eval/kfold-cross-validation"
    },

    # Unit 4
    "u4-bayes-theorem": {
        "status": "covered",
        "sources": ["UNIT IV INSTANCES AND PROBABILISTIC MODEL/Study Notes/ProbabilitySSB.pdf"],
        "notes": "Prior, likelihood, marginal, posterior. Medical test false-positive paradox.",
        "seed_lab": "prob/bayes-natural-frequency"
    },
    "u4-naive-bayes": {
        "status": "covered",
        "sources": ["UNIT IV INSTANCES AND PROBABILISTIC MODEL/Study Notes/Naive Bayes.pdf", "UNIT IV INSTANCES AND PROBABILISTIC MODEL/NBClassifier.ipynb", "UNIT IV INSTANCES AND PROBABILISTIC MODEL/NaiveBayesLIB.ipynb"],
        "notes": "Conditional independence assumption, Gaussian / Multinomial Naive Bayes, text/spam classification.",
        "seed_lab": "prob/naive-bayes-stepwise"
    },
    "u4-laplace-smoothing": {
        "status": "partial",
        "sources": ["UNIT IV INSTANCES AND PROBABILISTIC MODEL/Study Notes/Naive Bayes.pdf"],
        "notes": "Zero-frequency problem addressed in slides. Needs interactive alpha smoothing slider.",
        "seed_lab": "prob/laplace-smoothing"
    },
    "u4-logistic-regression": {
        "status": "covered",
        "sources": ["UNIT IV INSTANCES AND PROBABILISTIC MODEL/Study Notes/LOGISTIC REGRESSION.pdf", "UNIT IV INSTANCES AND PROBABILISTIC MODEL/Study Notes/Classification.pdf"],
        "notes": "Sigmoid activation g(z) = 1/(1+e^-z), log-loss / cross-entropy cost, decision boundary threshold.",
        "seed_lab": "cls/logistic-decision-boundary"
    },
    "u4-classification-metrics": {
        "status": "covered",
        "sources": ["UNIT IV INSTANCES AND PROBABILISTIC MODEL/Study Notes/Classification.pdf", "UNIT IV INSTANCES AND PROBABILISTIC MODEL/KNNMODEL.ipynb"],
        "notes": "Confusion matrix (TP, FP, TN, FN), Accuracy, Precision, Recall, Specificity, F1-Score.",
        "seed_lab": "eval/confusion-matrix-lab"
    },
    "u4-roc-auc": {
        "status": "partial",
        "sources": ["UNIT IV INSTANCES AND PROBABILISTIC MODEL/Study Notes/Classification.pdf"],
        "notes": "ROC curve mentioned. Needs dynamic threshold sweeper tracing TPR vs FPR with AUC calculation.",
        "seed_lab": "eval/roc-auc-curve"
    },
    "u4-case-churn": {
        "status": "partial",
        "sources": ["UNIT IV INSTANCES AND PROBABILISTIC MODEL/Social_Network_Ads.csv"],
        "notes": "Social Network Ads dataset is present (User ID, Gender, Age, EstimatedSalary, Purchased). Ideal for customer churn proxy.",
        "seed_lab": "case-studies/customer-churn"
    },
    "u4-self-knn": {
        "status": "covered",
        "sources": ["UNIT IV INSTANCES AND PROBABILISTIC MODEL/Study Notes/KNN.pdf", "UNIT IV INSTANCES AND PROBABILISTIC MODEL/Copy of KNN_GLASS.ipynb", "UNIT IV INSTANCES AND PROBABILISTIC MODEL/K-Nearest Neighbour.ipynb", "UNIT IV INSTANCES AND PROBABILISTIC MODEL/KNNMODEL.ipynb", "UNIT IV INSTANCES AND PROBABILISTIC MODEL/Copy of glass.csv"],
        "notes": "k parameter effect, Euclidean/Manhattan distance, decision boundaries, curse of dimensionality.",
        "seed_lab": "cls/knn-decision-regions"
    },
    "u4-further-variational-inference": {
        "status": "gap",
        "sources": [],
        "notes": "Syllabus further reading. High-level intuition on approximating intractable posterior distributions (ELBO).",
        "seed_lab": "readings/variational-inference"
    },

    # Unit 5
    "u5-decision-trees": {
        "status": "covered",
        "sources": ["UNIT V LINEAR AND DECISION MODELS/Decision Tree/DecisionTrees.pdf", "UNIT V LINEAR AND DECISION MODELS/Decision Tree/mitchell-dectrees.pdf", "UNIT V LINEAR AND DECISION MODELS/Decision Tree/Copy of SSB_DecisionTree.ipynb", "UNIT V LINEAR AND DECISION MODELS/Decision Tree/Copy of play_tennis.csv"],
        "notes": "Root, internal, leaf nodes; recursive binary splitting, play_tennis dataset.",
        "seed_lab": "tree/tree-split-builder"
    },
    "u5-impurity-split-criteria": {
        "status": "covered",
        "sources": ["UNIT V LINEAR AND DECISION MODELS/Decision Tree/DecisionTrees.pdf", "UNIT V LINEAR AND DECISION MODELS/Decision Tree/Copy of CART.ipynb"],
        "notes": "Entropy H(S), Information Gain IG(S, A), Gini Impurity Gini(S), CART vs ID3.",
        "seed_lab": "tree/impurity-calculator"
    },
    "u5-tree-pruning": {
        "status": "partial",
        "sources": ["UNIT V LINEAR AND DECISION MODELS/Decision Tree/mitchell-dectrees.pdf"],
        "notes": "Pre-pruning (max_depth, min_samples) vs post-pruning (cost-complexity ccp_alpha).",
        "seed_lab": "tree/pruning-explorer"
    },
    "u5-svm-fundamentals": {
        "status": "covered",
        "sources": ["UNIT V LINEAR AND DECISION MODELS/SVM/Support Victor Machine.pdf", "UNIT V LINEAR AND DECISION MODELS/SVM/Copy of SSB_SVM_SCRATCH_NOTES__.ipynb", "UNIT V LINEAR AND DECISION MODELS/SVM/Copy of SVM_LIB_SSB.ipynb"],
        "notes": "Hyperplane w^T x + b = 0, margin 2/||w||, support vectors, maximal margin classifier.",
        "seed_lab": "cls/svm-margin-lab"
    },
    "u5-svm-kernels": {
        "status": "covered",
        "sources": ["UNIT V LINEAR AND DECISION MODELS/SVM/Support Victor Machine.pdf", "UNIT V LINEAR AND DECISION MODELS/SVM/Copy of SVM_SSB.ipynb"],
        "notes": "Soft margin C parameter, slack variables xi_i, kernel trick (linear, poly, RBF 2D->3D lift).",
        "seed_lab": "cls/svm-kernel-trick"
    },
    "u5-ensemble-significance": {
        "status": "covered",
        "sources": ["UNIT V LINEAR AND DECISION MODELS/Ensemble Learning.pdf"],
        "notes": "Why ensembles work: Condorcet jury theorem intuition, reducing variance vs bias.",
        "seed_lab": "ens/ensemble-intuition"
    },
    "u5-bagging-random-forests": {
        "status": "covered",
        "sources": ["UNIT V LINEAR AND DECISION MODELS/Ensemble Learning.pdf", "UNIT V LINEAR AND DECISION MODELS/Bagging using ensemble learning.ipynb", "UNIT V LINEAR AND DECISION MODELS/RF_Ensemble learning.ipynb"],
        "notes": "Bootstrap aggregation with replacement, out-of-bag error, feature subset randomisation in RF.",
        "seed_lab": "ens/bagging-forest-visualizer"
    },
    "u5-boosting-stacking": {
        "status": "partial",
        "sources": ["UNIT V LINEAR AND DECISION MODELS/Ensemble Learning.pdf", "UNIT V LINEAR AND DECISION MODELS/Ensemble_Models.ipynb"],
        "notes": "Sequential correction in boosting; stacking meta-model architecture.",
        "seed_lab": "ens/boosting-stacking-diagram"
    },
    "u5-performance-evaluation": {
        "status": "covered",
        "sources": ["UNIT V LINEAR AND DECISION MODELS/Decision Tree/UNIT II Classification.pdf"],
        "notes": "Systematic cross-model comparison (trees vs SVM vs ensembles).",
        "seed_lab": "eval/model-comparison-arena"
    },
    "u5-case-diabetes": {
        "status": "covered",
        "sources": ["UNIT V LINEAR AND DECISION MODELS/Decision Tree/Copy of data.csv"],
        "notes": "Pima Indians Diabetes dataset (Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, Age, Outcome).",
        "seed_lab": "case-studies/diabetes-prediction"
    },
    "u5-self-adaboost": {
        "status": "partial",
        "sources": ["UNIT V LINEAR AND DECISION MODELS/Ensemble Learning.pdf", "UNIT V LINEAR AND DECISION MODELS/Ensemble_Models.ipynb"],
        "notes": "Sample weight updates w_i -> w_i exp(-alpha y h(x)), weak learner weights alpha_t.",
        "seed_lab": "ens/adaboost-reweighting"
    },
    "u5-further-dt-regression": {
        "status": "partial",
        "sources": ["UNIT V LINEAR AND DECISION MODELS/Decision Tree/Copy of CART.ipynb"],
        "notes": "Continuous target splitting via variance reduction / MSE.",
        "seed_lab": "tree/regression-tree-split"
    },

    # Unit 6
    "u6-association-rules": {
        "status": "gap",
        "sources": [],
        "notes": "Market basket analysis: items, itemsets, transactions, support, confidence, lift, conviction.",
        "seed_lab": "assoc/market-basket-rules"
    },
    "u6-apriori-algorithm": {
        "status": "gap",
        "sources": [],
        "notes": "Downward closure property (all subsets of frequent itemset are frequent), candidate generation C_k and L_k pruning.",
        "seed_lab": "assoc/apriori-stepwise"
    },
    "u6-clustering-overview": {
        "status": "gap",
        "sources": [],
        "notes": "Unsupervised taxonomy: partitional vs hierarchical vs density-based clustering.",
        "seed_lab": "cluster/clustering-taxonomy"
    },
    "u6-kmeans-clustering": {
        "status": "gap",
        "sources": [],
        "notes": "k-means algorithm: random/k-means++ init, Voronoi partitions, inertia, Elbow curve, Silhouette score.",
        "seed_lab": "cluster/kmeans-elbow"
    },
    "u6-hierarchical-clustering": {
        "status": "gap",
        "sources": [],
        "notes": "Agglomerative clustering, distance matrix, linkage criteria (single, complete, average, ward), dendrogram slicing.",
        "seed_lab": "cluster/dendrogram-slicer"
    },
    "u6-dbscan-clustering": {
        "status": "gap",
        "sources": [],
        "notes": "Density reachability, epsilon neighborhood, minPts, core points, border points, noise outliers.",
        "seed_lab": "cluster/dbscan-density"
    },
    "u6-dim-reduction-motivation": {
        "status": "gap",
        "sources": [],
        "notes": "Curse of dimensionality, sparsity, distance concentration, computational cost.",
        "seed_lab": "dimred/curse-of-dimensionality"
    },
    "u6-feature-selection-extraction": {
        "status": "gap",
        "sources": [],
        "notes": "Filter, wrapper, embedded selection methods vs projection/transformation extraction methods.",
        "seed_lab": "dimred/selection-vs-extraction"
    },
    "u6-pca": {
        "status": "gap",
        "sources": [],
        "notes": "Principal Component Analysis: centering, covariance matrix, eigenvectors, eigenvalues, explained variance, projection.",
        "seed_lab": "dimred/pca-axes-rotation"
    },
    "u6-case-anomaly-noise": {
        "status": "gap",
        "sources": [],
        "notes": "Anomaly detection case study comparing Z-score, DBSCAN noise flags, and PCA reconstruction error on industrial/server metrics.",
        "seed_lab": "case-studies/anomaly-noise-reduction"
    },
    "u6-self-gmm-em": {
        "status": "gap",
        "sources": [],
        "notes": "Gaussian Mixture Models, soft clustering, Expectation-Maximization (E-step, M-step).",
        "seed_lab": "cluster/gmm-em-visualizer"
    },
    "u6-further-lda": {
        "status": "gap",
        "sources": [],
        "notes": "Linear Discriminant Analysis: maximizing between-class scatter while minimizing within-class scatter.",
        "seed_lab": "readings/lda-discriminant"
    }
}

for u in syllabus["units"]:
    for t in u["topics"]:
        tid = t["id"]
        meta = mapping_data.get(tid, {
            "status": "gap",
            "sources": [],
            "notes": "No mapping metadata provided.",
            "seed_lab": f"lab/{tid}"
        })
        content_map.append({
            "unit": u["unit"],
            "unit_title": u["title"],
            "topic_id": tid,
            "topic_name": t["name"],
            "kind": t["kind"],
            "hours": t["hours"],
            "status": meta["status"],
            "sources": meta["sources"],
            "notes": meta["notes"],
            "seed_lab": meta["seed_lab"]
        })

# Write docs/content-map.json
with open(os.path.join(DOCS_DIR, "content-map.json"), "w", encoding="utf-8") as f:
    json.dump(content_map, f, indent=2)

print("Generated docs/content-map.json successfully.")

# Write docs/CONTENT_MAP.md
md_lines = [
    "# CONTENT_MAP — AIML Studio Content & Source Material Inventory",
    "",
    "> Authoritative mapping between the syllabus for **Artificial Intelligence and Machine Learning (2304322T)** and instructor teaching materials.",
    "",
    "## 1. Summary Statistics",
    f"- **Total Syllabus Topics & Modules:** {len(content_map)}",
    f"- **Fully Covered by Sources:** {sum(1 for x in content_map if x['status'] == 'covered')}",
    f"- **Partially Covered by Sources:** {sum(1 for x in content_map if x['status'] == 'partial')}",
    f"- **Gaps (To Author From Syllabus & Canonical Knowledge):** {sum(1 for x in content_map if x['status'] == 'gap')}",
    "",
    "## 2. Topic-by-Topic Mapping",
    "",
    "| Unit | ID | Topic Name | Kind | Hrs | Status | Primary Source Material | Seed Lab / Module |",
    "|---|---|---|---|---|---|---|---|"
]

for item in content_map:
    sources_str = "<br>".join([f"`{s}`" for s in item["sources"]]) if item["sources"] else "*None (Syllabus only)*"
    status_badge = f"**{item['status'].upper()}**"
    md_lines.append(f"| {item['unit']} | `{item['topic_id']}` | {item['topic_name']} | `{item['kind']}` | {item['hours']} | {status_badge} | {sources_str} | `{item['seed_lab']}` |")

with open(os.path.join(DOCS_DIR, "CONTENT_MAP.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(md_lines))

print("Generated docs/CONTENT_MAP.md successfully.")

