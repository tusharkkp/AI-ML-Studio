# GAP_ANALYSIS — AIML Studio Content & Lab Gap Resolution Plan

> This document catalogs all syllabus topics where instructor source materials in `ML/` are missing (`GAP`) or only partially covered (`PARTIAL`). For each item, this analysis details the pedagogical authoring approach, interactive laboratory design, and independent verification oracle.

## Summary: 33 Items Requiring Custom Authoring
- **Partial Topics (Units 1-5):** 15
- **Full Gaps (Units 1-5):** 6
- **Unit 6 (Complete Unit Gap):** 12 (All 12 topics authored from syllabus & standard knowledge)

---

## Detailed Gap Resolution Specifications

### `u1-ethics-impact`: Impact & Ethical Concerns of AI
- **Unit:** Unit 1 (Basics of AI)
- **Kind:** `core` | **Hours:** 0.8 | **Status:** `PARTIAL`
- **Existing Source Materials:** `Unit 1/1_Unit I Articial I Intelligence Introduction and Applications.pdf`
- **Authoring Strategy:** Author original scenarios on AI bias (recruitment filter, face recognition demographic disparity), autonomy dilemmas (self-driving decisions), and copyright in generative models.
- **Flagship Interactive Element:** Ethics Scenario Cards: Interactive dilemma explorer with consequence trade-offs and bias detection on a mini dataset.
- **Verification Oracle & Integrity Check:** Conceptual consistency against ACM/IEEE ethical guidelines and syllabus benchmarks.

### `u1-expert-systems`: Architecture of Expert Systems
- **Unit:** Unit 1 (Basics of AI)
- **Kind:** `core` | **Hours:** 0.8 | **Status:** `PARTIAL`
- **Existing Source Materials:** `Unit 1/Recommendation.pl`, `Unit 1/blood.pl`
- **Authoring Strategy:** Design clear architectural diagrams: Knowledge Base + Working Memory + Inference Engine + Explanation Facility ('Why' and 'How').
- **Flagship Interactive Element:** Mini Expert System Builder: Interactive rule graph allowing students to trace how queries are satisfied and inspect backward-chaining proof trees.
- **Verification Oracle & Integrity Check:** Custom TypeScript rule engine test suite verifying deterministic forward/backward resolution proofs.

### `u1-knowledge-acquisition`: Knowledge Acquisition
- **Unit:** Unit 1 (Basics of AI)
- **Kind:** `core` | **Hours:** 0.6 | **Status:** `PARTIAL`
- **Existing Source Materials:** `Unit 1/4_Logic.pdf`
- **Authoring Strategy:** Detail knowledge elicitation techniques (interviews, protocol analysis) and the knowledge engineering lifecycle.
- **Flagship Interactive Element:** Knowledge Acquisition Pipeline: Visual flowchart converting natural-language rules into formal IF-THEN rules.
- **Verification Oracle & Integrity Check:** Self-contained rule parsing and conflict resolution test cases.

### `u1-case-medical`: Case Study: Medical Diagnosis System
- **Unit:** Unit 1 (Basics of AI)
- **Kind:** `case-study` | **Hours:** 0.5 | **Status:** `PARTIAL`
- **Existing Source Materials:** `Unit 1/blood.pl`, `Unit 1/blood(1).pl`
- **Authoring Strategy:** Expand the instructor's `blood.pl` into a complete, clinically sound educational medical diagnostic module (fever, rash, symptoms -> infectious diagnosis).
- **Flagship Interactive Element:** Medical Diagnostic System with active 'Why did you ask that?' and 'How did you conclude this?' explanation inspector.
- **Verification Oracle & Integrity Check:** Deterministic logic tests asserting diagnostic conclusions matching clinical rule tables.

### `u1-case-self-driving`: Case Study: Self-Driving Vehicle
- **Unit:** Unit 1 (Basics of AI)
- **Kind:** `case-study` | **Hours:** 0.5 | **Status:** `GAP`
- **Existing Source Materials:** *None (Syllabus Only)*
- **Authoring Strategy:** Synthesize the PEAS framework and architecture of an autonomous vehicle (LiDAR/cameras perception, path planning reasoning, actuator control).
- **Flagship Interactive Element:** Autonomous Vehicle Simulator: 2D lane-following and obstacle avoidance interactive view with PEAS inspection overlay.
- **Verification Oracle & Integrity Check:** Simulator state machine invariant tests (stop on red/obstacle, follow speed limit).

### `u1-self-prompt-eng`: Self-Study: Prompt Engineering
- **Unit:** Unit 1 (Basics of AI)
- **Kind:** `self-study` | **Hours:** 0.5 | **Status:** `GAP`
- **Existing Source Materials:** *None (Syllabus Only)*
- **Authoring Strategy:** Synthesize modern prompt engineering principles: persona/role definition, clear instructions, few-shot examples, chain-of-thought prompting.
- **Flagship Interactive Element:** Prompt Engineering Sandbox: Client-side simulator showing pre-baked model outputs to demonstrated prompt variations (zero-shot vs few-shot vs chain-of-thought). No external API keys.
- **Verification Oracle & Integrity Check:** Deterministic string matcher and pattern validator for sandbox presets.

### `u1-further-agi`: Further Reading: Artificial General Intelligence (AGI)
- **Unit:** Unit 1 (Basics of AI)
- **Kind:** `further-reading` | **Hours:** 0.3 | **Status:** `GAP`
- **Existing Source Materials:** *None (Syllabus Only)*
- **Authoring Strategy:** Explain ANI vs AGI vs ASI, Turing test limitations, Chinese Room argument, Alignment problem, and compute scaling limits.
- **Flagship Interactive Element:** AGI Horizons Timeline & Capability Radar Chart comparing narrow systems to human-level cognitive faculties.
- **Verification Oracle & Integrity Check:** Editorial review against standard literature (Russell & Norvig, Bostrom).

### `u2-case-gps`: Case Study: GPS Navigation
- **Unit:** Unit 2 (AI Search Strategies)
- **Kind:** `case-study` | **Hours:** 0.5 | **Status:** `PARTIAL`
- **Existing Source Materials:** `UNIT II/Informed Search.pdf`
- **Authoring Strategy:** Develop a real-world graph navigation case study based on Indian cities / Pune road network with Euclidean distance heuristics.
- **Flagship Interactive Element:** GPS Navigation Map Graph: Live route planning comparing BFS, UCS, and A* with travel time and nodes explored.
- **Verification Oracle & Integrity Check:** Engine comparison tests verifying A* optimal path matches Dijkstra / UCS on positive edge weights.

### `u2-case-chess`: Case Study: Chess Game AI
- **Unit:** Unit 2 (AI Search Strategies)
- **Kind:** `case-study` | **Hours:** 0.5 | **Status:** `PARTIAL`
- **Existing Source Materials:** `UNIT II/Adversarial Search.pdf`
- **Authoring Strategy:** Break down game evaluation functions: material count, piece-square tables, king safety, center control, and tree search depth.
- **Flagship Interactive Element:** Chess Position Evaluator & Minimax Visualizer: Step through a 2-ply / 3-ply chess tactical position with alpha-beta cutoffs highlighted.
- **Verification Oracle & Integrity Check:** Golden minimax valuation tests on curated Forsyth-Edwards Notation (FEN) positions.

### `u2-further-game-theory`: Further Reading: Game Theory
- **Unit:** Unit 2 (AI Search Strategies)
- **Kind:** `further-reading` | **Hours:** 0.3 | **Status:** `PARTIAL`
- **Existing Source Materials:** `UNIT II/Adversarial Search.pdf`
- **Authoring Strategy:** Explain normal-form games, dominant strategies, Pareto efficiency, and Nash Equilibrium.
- **Flagship Interactive Element:** Interactive Payoff Matrix & Prisoner's Dilemma Simulator: Play against defect/cooperate strategies with iterated score tracking.
- **Verification Oracle & Integrity Check:** Game-theoretic payoff matrix invariant tests (e.g. Defect is strictly dominant in standard Prisoner's Dilemma).

### `u3-case-healthcare`: Case Study: Healthcare Application
- **Unit:** Unit 3 (ML Fundamentals)
- **Kind:** `case-study` | **Hours:** 0.5 | **Status:** `GAP`
- **Existing Source Materials:** *None (Syllabus Only)*
- **Authoring Strategy:** Design a clean, ethically grounded regression case study predicting medical treatment costs or diabetes progression from physiological features.
- **Flagship Interactive Element:** Healthcare Cost Predictor: Feature selection and polynomial regression lab on a curated, sanitized dataset (<= 150 KB).
- **Verification Oracle & Integrity Check:** scikit-learn golden fixture comparison for coefficients, MSE, and R-squared.

### `u3-self-regularization`: Self-Study: Ridge, Lasso & Elastic Net Regularization
- **Unit:** Unit 3 (ML Fundamentals)
- **Kind:** `self-study` | **Hours:** 0.5 | **Status:** `PARTIAL`
- **Existing Source Materials:** `UNIT III Machine Learning Fundamentals/Linear Regression/Ridge_Lasso.ipynb`
- **Authoring Strategy:** Detail the formulation of L1 (Lasso), L2 (Ridge), and Elastic Net (combined L1 + L2 with mixing parameter rho/l1_ratio).
- **Flagship Interactive Element:** Regularization Shrinkage Explorer: Interactive lambda/alpha slider showing coefficient shrinkage paths and feature selection zeroing in Lasso vs Ridge vs Elastic Net.
- **Verification Oracle & Integrity Check:** scikit-learn ElasticNet / Ridge / Lasso golden fixture JSON comparisons within 1e-4 tolerance.

### `u3-further-kfold-cv`: Further Reading: K-Fold Cross-Validation Case Study
- **Unit:** Unit 3 (ML Fundamentals)
- **Kind:** `further-reading` | **Hours:** 0.3 | **Status:** `GAP`
- **Existing Source Materials:** *None (Syllabus Only)*
- **Authoring Strategy:** Explain train/test leakage, k-fold cross validation mechanism, stratified splits, and validation variance reduction.
- **Flagship Interactive Element:** K-Fold CV Visualizer: Interactive split slider (k=2 to 10) showing train/val partitions, fold test errors, and overall mean/std metric bands.
- **Verification Oracle & Integrity Check:** Deterministic partitioning test ensuring each sample appears in exactly one test fold.

### `u4-laplace-smoothing`: Laplace / Additive Smoothing
- **Unit:** Unit 4 (Instances & Probabilistic Models)
- **Kind:** `core` | **Hours:** 0.6 | **Status:** `PARTIAL`
- **Existing Source Materials:** `UNIT IV INSTANCES AND PROBABILISTIC MODEL/Study Notes/Naive Bayes.pdf`
- **Authoring Strategy:** Explain the zero-probability multiplication trap in Naive Bayes and the mathematical formulation of additive Laplace smoothing (k=1) and Lidstone smoothing.
- **Flagship Interactive Element:** Smoothing Parameter Lab: Interactive alpha slider demonstrating how unseen vocabulary terms receive non-zero probabilities.
- **Verification Oracle & Integrity Check:** Hand-worked calculation test asserting exact posterior probabilities under alpha=0 vs alpha=1.

### `u4-roc-auc`: ROC Curve & Area Under Curve (ROC-AUC)
- **Unit:** Unit 4 (Instances & Probabilistic Models)
- **Kind:** `core` | **Hours:** 0.9 | **Status:** `PARTIAL`
- **Existing Source Materials:** `UNIT IV INSTANCES AND PROBABILISTIC MODEL/Study Notes/Classification.pdf`
- **Authoring Strategy:** Deconstruct True Positive Rate (Sensitivity) vs False Positive Rate (1 - Specificity) across sweeping classification thresholds.
- **Flagship Interactive Element:** Interactive ROC Curve & AUC Calculator: Move threshold slider to observe confusion matrix shift, ROC point traversal, and trapezoidal AUC area calculation.
- **Verification Oracle & Integrity Check:** scikit-learn roc_curve and roc_auc_score golden fixtures comparison.

### `u4-case-churn`: Case Study: Customer Churn Prediction
- **Unit:** Unit 4 (Instances & Probabilistic Models)
- **Kind:** `case-study` | **Hours:** 0.5 | **Status:** `PARTIAL`
- **Existing Source Materials:** `UNIT IV INSTANCES AND PROBABILISTIC MODEL/Social_Network_Ads.csv`
- **Authoring Strategy:** Build an end-to-end customer churn analysis using `Social_Network_Ads.csv` (or an equivalent telecom churn dataset subset <= 200 KB).
- **Flagship Interactive Element:** Customer Churn Decision Lab: Tune decision threshold to balance false churn predictions vs missed customer retention.
- **Verification Oracle & Integrity Check:** scikit-learn LogisticRegression cross-check for parameters and classification report.

### `u4-further-variational-inference`: Further Reading: Variational Inference
- **Unit:** Unit 4 (Instances & Probabilistic Models)
- **Kind:** `further-reading` | **Hours:** 0.3 | **Status:** `GAP`
- **Existing Source Materials:** *None (Syllabus Only)*
- **Authoring Strategy:** Provide intuitive, conceptual overview of Bayesian posterior intractability, Evidence Lower Bound (ELBO), and optimization-based inference vs MCMC sampling.
- **Flagship Interactive Element:** Variational Approximation Explorer: Fit a simple Gaussian distribution q(z) to a bimodal or complex target distribution p(z|x) via KL divergence minimization.
- **Verification Oracle & Integrity Check:** Conceptual consistency against Bishop PRML and Blei et al. canonical survey.

### `u5-tree-pruning`: Tree Pruning & Overfitting Control
- **Unit:** Unit 5 (Linear & Decision Models)
- **Kind:** `core` | **Hours:** 0.8 | **Status:** `PARTIAL`
- **Existing Source Materials:** `UNIT V LINEAR AND DECISION MODELS/Decision Tree/mitchell-dectrees.pdf`
- **Authoring Strategy:** Explain the mechanics of pre-pruning (early stopping) and post-pruning (minimal cost-complexity pruning with ccp_alpha).
- **Flagship Interactive Element:** Decision Tree Pruning Lab: Sliders for max_depth, min_samples_split, and ccp_alpha showing real-time tree simplification and validation error curve.
- **Verification Oracle & Integrity Check:** scikit-learn DecisionTreeClassifier(ccp_alpha=...) golden fixtures asserting identical tree depth and node counts.

### `u5-boosting-stacking`: Boosting Concepts & Stacking (Stacked Generalization)
- **Unit:** Unit 5 (Linear & Decision Models)
- **Kind:** `core` | **Hours:** 0.8 | **Status:** `PARTIAL`
- **Existing Source Materials:** `UNIT V LINEAR AND DECISION MODELS/Ensemble Learning.pdf`, `UNIT V LINEAR AND DECISION MODELS/Ensemble_Models.ipynb`
- **Authoring Strategy:** Structure the conceptual progression: Individual Weak Learner -> Weighted Ensemble (Boosting) -> Heterogeneous Blending (Stacking).
- **Flagship Interactive Element:** Stacking & Boosting Architectural Canvas: Visual diagram showing base learners outputs feeding into meta-learner (e.g. Logistic Regression).
- **Verification Oracle & Integrity Check:** scikit-learn StackingClassifier prediction and coefficient assertion on synthetic 2D data.

### `u5-self-adaboost`: Self-Study: AdaBoost Algorithm Mechanics
- **Unit:** Unit 5 (Linear & Decision Models)
- **Kind:** `self-study` | **Hours:** 0.5 | **Status:** `PARTIAL`
- **Existing Source Materials:** `UNIT V LINEAR AND DECISION MODELS/Ensemble Learning.pdf`, `UNIT V LINEAR AND DECISION MODELS/Ensemble_Models.ipynb`
- **Authoring Strategy:** Formulate the discrete AdaBoost algorithm: initial equal weights, error rate calculation epsilon_t, classifier weight alpha_t, and sample re-weighting.
- **Flagship Interactive Element:** AdaBoost Reweighting Animation: Step through boosting rounds observing point sizes grow on misclassified points and decision stumps combine.
- **Verification Oracle & Integrity Check:** scikit-learn AdaBoostClassifier golden fixture test verifying alpha weights and sequential stump thresholds.

### `u5-further-dt-regression`: Further Reading: Decision Tree for Regression
- **Unit:** Unit 5 (Linear & Decision Models)
- **Kind:** `further-reading` | **Hours:** 0.3 | **Status:** `PARTIAL`
- **Existing Source Materials:** `UNIT V LINEAR AND DECISION MODELS/Decision Tree/Copy of CART.ipynb`
- **Authoring Strategy:** Explain decision tree regression splitting on variance reduction (MSE) and leaf node value as sample mean.
- **Flagship Interactive Element:** Regression Tree Step-Function Visualizer: Drag points and adjust tree depth to see piecewise constant regression steps.
- **Verification Oracle & Integrity Check:** scikit-learn DecisionTreeRegressor golden fixture comparison for split values and leaf predictions.

### `u6-association-rules`: Association Rule Mining: Itemsets, Support, Confidence & Lift
- **Unit:** Unit 6 (Unsupervised Learning)
- **Kind:** `core` | **Hours:** 1.0 | **Status:** `GAP`
- **Existing Source Materials:** *None (Syllabus Only)*
- **Authoring Strategy:** Define transactional database concepts: itemsets, support count, relative support, confidence, lift, and conviction with supermarket basket examples.
- **Flagship Interactive Element:** Market Basket Rule Builder: Select transactions or item frequencies to compute support, confidence, and lift interactively.
- **Verification Oracle & Integrity Check:** Deterministic test verifying association rule metric formulas on hand-crafted transaction sets.

### `u6-apriori-algorithm`: Apriori Algorithm & Downward-Closure Property
- **Unit:** Unit 6 (Unsupervised Learning)
- **Kind:** `core` | **Hours:** 1.2 | **Status:** `GAP`
- **Existing Source Materials:** *None (Syllabus Only)*
- **Authoring Strategy:** Step-by-step breakdown of Apriori: find frequent 1-itemsets L_1, candidate generation C_k via join step, candidate pruning via downward-closure property, generate L_k.
- **Flagship Interactive Element:** Apriori Stepwise Trace Lab: Interactive trace showing candidate generation, pruning, and rule filtering above min_support and min_confidence thresholds.
- **Verification Oracle & Integrity Check:** mlxtend / standard Apriori golden fixture comparison on standard transaction dataset.

### `u6-clustering-overview`: Clustering Paradigms: Partitional, Hierarchical, Density-Based
- **Unit:** Unit 6 (Unsupervised Learning)
- **Kind:** `core` | **Hours:** 0.6 | **Status:** `GAP`
- **Existing Source Materials:** *None (Syllabus Only)*
- **Authoring Strategy:** Comprehensive comparison table and decision guide for partitional (k-Means), hierarchical (Agglomerative), and density-based (DBSCAN) clustering paradigms.
- **Flagship Interactive Element:** Clustering Paradigm Comparison Arena: Side-by-side execution on 4 dataset types (spherical blobs, concentric circles, moons, variable density).
- **Verification Oracle & Integrity Check:** Taxonomy correctness and algorithm applicability rule tests.

### `u6-kmeans-clustering`: k-Means Clustering, Inertia, Elbow Method & Silhouette Score
- **Unit:** Unit 6 (Unsupervised Learning)
- **Kind:** `core` | **Hours:** 1.4 | **Status:** `GAP`
- **Existing Source Materials:** *None (Syllabus Only)*
- **Authoring Strategy:** Detailed algorithm explanation: initialization (Random vs k-Means++), assignment step, update step, convergence condition, inertia metric, Elbow heuristic, Silhouette coefficient.
- **Flagship Interactive Element:** k-Means Interactive Laboratory: Click to place centroids or run auto k-Means, view Voronoi cells, trace inertia reduction, and generate Elbow plot.
- **Verification Oracle & Integrity Check:** scikit-learn KMeans golden fixture comparison on synthetic blobs (inertia and cluster assignments within tolerance).

### `u6-hierarchical-clustering`: Hierarchical Clustering & Dendrograms
- **Unit:** Unit 6 (Unsupervised Learning)
- **Kind:** `core` | **Hours:** 1.0 | **Status:** `GAP`
- **Existing Source Materials:** *None (Syllabus Only)*
- **Authoring Strategy:** Agglomerative hierarchical clustering: proximity matrix, linkage metrics (Single, Complete, Average, Ward), dendrogram construction and distance threshold cutting.
- **Flagship Interactive Element:** Interactive Dendrogram Slicer: Adjust horizontal cutting threshold to watch clusters merge/split dynamically in 2D space.
- **Verification Oracle & Integrity Check:** scipy.cluster.hierarchy linkage matrix and dendrogram cut test comparison.

### `u6-dbscan-clustering`: Density-Based Clustering: DBSCAN & Noise Detection
- **Unit:** Unit 6 (Unsupervised Learning)
- **Kind:** `core` | **Hours:** 1.2 | **Status:** `GAP`
- **Existing Source Materials:** *None (Syllabus Only)*
- **Authoring Strategy:** Density-based spatial clustering of applications with noise: epsilon-neighborhood, minPts, core points, border points, density-reachable, density-connected, noise outliers.
- **Flagship Interactive Element:** DBSCAN Density Explorer: Adjust eps circle radius and minPts slider to see core/border/noise points highlighted live on non-convex shapes.
- **Verification Oracle & Integrity Check:** scikit-learn DBSCAN golden fixture comparison for labels and noise point detection.

### `u6-dim-reduction-motivation`: Dimensionality Reduction: Motivation & Curse of Dimensionality
- **Unit:** Unit 6 (Unsupervised Learning)
- **Kind:** `core` | **Hours:** 0.6 | **Status:** `GAP`
- **Existing Source Materials:** *None (Syllabus Only)*
- **Authoring Strategy:** Deconstruct the Curse of Dimensionality: exponential volume growth, distance concentration phenomenon (max distance / min distance -> 1), sample sparsity.
- **Flagship Interactive Element:** Curse of Dimensionality Geometric Visualizer: Explore 1D line -> 2D square -> 3D cube -> hypercube volume fraction in corners.
- **Verification Oracle & Integrity Check:** Geometric mathematical calculation assertions (sphere volume / cube volume as d -> inf).

### `u6-feature-selection-extraction`: Feature Selection vs Feature Extraction
- **Unit:** Unit 6 (Unsupervised Learning)
- **Kind:** `core` | **Hours:** 0.6 | **Status:** `GAP`
- **Existing Source Materials:** *None (Syllabus Only)*
- **Authoring Strategy:** Contrast Feature Selection (preserving original interpretability via filter, wrapper, embedded methods) with Feature Extraction (projecting to new latent basis).
- **Flagship Interactive Element:** Selection vs Extraction Decision Matrix & Interactive Tool: Compare dropping features vs projecting with PCA on a 3D dataset.
- **Verification Oracle & Integrity Check:** Categorization and transformation consistency tests.

### `u6-pca`: Principal Component Analysis (PCA)
- **Unit:** Unit 6 (Unsupervised Learning)
- **Kind:** `core` | **Hours:** 1.4 | **Status:** `GAP`
- **Existing Source Materials:** *None (Syllabus Only)*
- **Authoring Strategy:** Full mathematical & geometric derivation: data mean centering, covariance matrix Sigma, eigendecomposition Sigma v = lambda v, sorting eigenvalues, projection matrix W, explained variance ratio.
- **Flagship Interactive Element:** PCA Principal Axes Rotation & Projection Lab: Rotate 2D axes manually to maximize projected variance, compare with calculated eigenvectors, slider for k components.
- **Verification Oracle & Integrity Check:** scikit-learn PCA golden fixture comparison for components_, explained_variance_ratio_, and transformed coordinates.

### `u6-case-anomaly-noise`: Case Study: Anomaly Detection & Noise Reduction
- **Unit:** Unit 6 (Unsupervised Learning)
- **Kind:** `case-study` | **Hours:** 0.5 | **Status:** `GAP`
- **Existing Source Materials:** *None (Syllabus Only)*
- **Authoring Strategy:** End-to-end industrial case study: Anomaly detection on multi-sensor server metrics comparing statistical Z-score, DBSCAN noise flags, and PCA reconstruction error.
- **Flagship Interactive Element:** Multi-Method Anomaly Detection Workbench: Run Z-score, DBSCAN, and PCA reconstruction error side-by-side on industrial sensor data with threshold tuning.
- **Verification Oracle & Integrity Check:** Automated evaluation asserting detection precision and recall against synthetic annotated anomaly masks.

### `u6-self-gmm-em`: Self-Study: Probability-Distribution-Based Methods (GMM & EM)
- **Unit:** Unit 6 (Unsupervised Learning)
- **Kind:** `self-study` | **Hours:** 0.5 | **Status:** `GAP`
- **Existing Source Materials:** *None (Syllabus Only)*
- **Authoring Strategy:** Gaussian Mixture Models: probabilistic soft clustering, mixture weights pi_k, component Gaussians N(mu_k, Sigma_k), Expectation-Maximization (E-step responsibilities, M-step parameter updates).
- **Flagship Interactive Element:** GMM & EM Interactive Visualizer: Watch Gaussian ellipses stretch, rotate, and shift towards data clusters with each EM iteration.
- **Verification Oracle & Integrity Check:** scikit-learn GaussianMixture golden fixture comparison for converged means and covariances.

### `u6-further-lda`: Further Reading: Linear Discriminant Analysis (LDA)
- **Unit:** Unit 6 (Unsupervised Learning)
- **Kind:** `further-reading` | **Hours:** 0.3 | **Status:** `GAP`
- **Existing Source Materials:** *None (Syllabus Only)*
- **Authoring Strategy:** Linear Discriminant Analysis: supervised dimensionality reduction, between-class scatter S_B, within-class scatter S_W, Fisher's criterion J(w) = w^T S_B w / w^T S_W w.
- **Flagship Interactive Element:** LDA Supervised Projection Visualizer: Contrast unsupervised PCA axis with supervised LDA axis separating two labeled overlapping Gaussian classes.
- **Verification Oracle & Integrity Check:** scikit-learn LinearDiscriminantAnalysis golden fixture comparison for projection weights.
