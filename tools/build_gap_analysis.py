import json
import os

DOCS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs")

with open(os.path.join(DOCS_DIR, "content-map.json"), "r", encoding="utf-8") as f:
    cmap = json.load(f)

gaps_and_partials = [x for x in cmap if x["status"] in ["gap", "partial"]]

gap_authoring_strategies = {
    # Unit 1
    "u1-ethics-impact": {
        "authoring_plan": "Author original scenarios on AI bias (recruitment filter, face recognition demographic disparity), autonomy dilemmas (self-driving decisions), and copyright in generative models.",
        "interactive_element": "Ethics Scenario Cards: Interactive dilemma explorer with consequence trade-offs and bias detection on a mini dataset.",
        "verification_oracle": "Conceptual consistency against ACM/IEEE ethical guidelines and syllabus benchmarks."
    },
    "u1-expert-systems": {
        "authoring_plan": "Design clear architectural diagrams: Knowledge Base + Working Memory + Inference Engine + Explanation Facility ('Why' and 'How').",
        "interactive_element": "Mini Expert System Builder: Interactive rule graph allowing students to trace how queries are satisfied and inspect backward-chaining proof trees.",
        "verification_oracle": "Custom TypeScript rule engine test suite verifying deterministic forward/backward resolution proofs."
    },
    "u1-knowledge-acquisition": {
        "authoring_plan": "Detail knowledge elicitation techniques (interviews, protocol analysis) and the knowledge engineering lifecycle.",
        "interactive_element": "Knowledge Acquisition Pipeline: Visual flowchart converting natural-language rules into formal IF-THEN rules.",
        "verification_oracle": "Self-contained rule parsing and conflict resolution test cases."
    },
    "u1-case-medical": {
        "authoring_plan": "Expand the instructor's `blood.pl` into a complete, clinically sound educational medical diagnostic module (fever, rash, symptoms -> infectious diagnosis).",
        "interactive_element": "Medical Diagnostic System with active 'Why did you ask that?' and 'How did you conclude this?' explanation inspector.",
        "verification_oracle": "Deterministic logic tests asserting diagnostic conclusions matching clinical rule tables."
    },
    "u1-case-self-driving": {
        "authoring_plan": "Synthesize the PEAS framework and architecture of an autonomous vehicle (LiDAR/cameras perception, path planning reasoning, actuator control).",
        "interactive_element": "Autonomous Vehicle Simulator: 2D lane-following and obstacle avoidance interactive view with PEAS inspection overlay.",
        "verification_oracle": "Simulator state machine invariant tests (stop on red/obstacle, follow speed limit)."
    },
    "u1-self-prompt-eng": {
        "authoring_plan": "Synthesize modern prompt engineering principles: persona/role definition, clear instructions, few-shot examples, chain-of-thought prompting.",
        "interactive_element": "Prompt Engineering Sandbox: Client-side simulator showing pre-baked model outputs to demonstrated prompt variations (zero-shot vs few-shot vs chain-of-thought). No external API keys.",
        "verification_oracle": "Deterministic string matcher and pattern validator for sandbox presets."
    },
    "u1-further-agi": {
        "authoring_plan": "Explain ANI vs AGI vs ASI, Turing test limitations, Chinese Room argument, Alignment problem, and compute scaling limits.",
        "interactive_element": "AGI Horizons Timeline & Capability Radar Chart comparing narrow systems to human-level cognitive faculties.",
        "verification_oracle": "Editorial review against standard literature (Russell & Norvig, Bostrom)."
    },

    # Unit 2
    "u2-case-gps": {
        "authoring_plan": "Develop a real-world graph navigation case study based on Indian cities / Pune road network with Euclidean distance heuristics.",
        "interactive_element": "GPS Navigation Map Graph: Live route planning comparing BFS, UCS, and A* with travel time and nodes explored.",
        "verification_oracle": "Engine comparison tests verifying A* optimal path matches Dijkstra / UCS on positive edge weights."
    },
    "u2-case-chess": {
        "authoring_plan": "Break down game evaluation functions: material count, piece-square tables, king safety, center control, and tree search depth.",
        "interactive_element": "Chess Position Evaluator & Minimax Visualizer: Step through a 2-ply / 3-ply chess tactical position with alpha-beta cutoffs highlighted.",
        "verification_oracle": "Golden minimax valuation tests on curated Forsyth-Edwards Notation (FEN) positions."
    },
    "u2-further-game-theory": {
        "authoring_plan": "Explain normal-form games, dominant strategies, Pareto efficiency, and Nash Equilibrium.",
        "interactive_element": "Interactive Payoff Matrix & Prisoner's Dilemma Simulator: Play against defect/cooperate strategies with iterated score tracking.",
        "verification_oracle": "Game-theoretic payoff matrix invariant tests (e.g. Defect is strictly dominant in standard Prisoner's Dilemma)."
    },

    # Unit 3
    "u3-case-healthcare": {
        "authoring_plan": "Design a clean, ethically grounded regression case study predicting medical treatment costs or diabetes progression from physiological features.",
        "interactive_element": "Healthcare Cost Predictor: Feature selection and polynomial regression lab on a curated, sanitized dataset (<= 150 KB).",
        "verification_oracle": "scikit-learn golden fixture comparison for coefficients, MSE, and R-squared."
    },
    "u3-self-regularization": {
        "authoring_plan": "Detail the formulation of L1 (Lasso), L2 (Ridge), and Elastic Net (combined L1 + L2 with mixing parameter rho/l1_ratio).",
        "interactive_element": "Regularization Shrinkage Explorer: Interactive lambda/alpha slider showing coefficient shrinkage paths and feature selection zeroing in Lasso vs Ridge vs Elastic Net.",
        "verification_oracle": "scikit-learn ElasticNet / Ridge / Lasso golden fixture JSON comparisons within 1e-4 tolerance."
    },
    "u3-further-kfold-cv": {
        "authoring_plan": "Explain train/test leakage, k-fold cross validation mechanism, stratified splits, and validation variance reduction.",
        "interactive_element": "K-Fold CV Visualizer: Interactive split slider (k=2 to 10) showing train/val partitions, fold test errors, and overall mean/std metric bands.",
        "verification_oracle": "Deterministic partitioning test ensuring each sample appears in exactly one test fold."
    },

    # Unit 4
    "u4-laplace-smoothing": {
        "authoring_plan": "Explain the zero-probability multiplication trap in Naive Bayes and the mathematical formulation of additive Laplace smoothing (k=1) and Lidstone smoothing.",
        "interactive_element": "Smoothing Parameter Lab: Interactive alpha slider demonstrating how unseen vocabulary terms receive non-zero probabilities.",
        "verification_oracle": "Hand-worked calculation test asserting exact posterior probabilities under alpha=0 vs alpha=1."
    },
    "u4-roc-auc": {
        "authoring_plan": "Deconstruct True Positive Rate (Sensitivity) vs False Positive Rate (1 - Specificity) across sweeping classification thresholds.",
        "interactive_element": "Interactive ROC Curve & AUC Calculator: Move threshold slider to observe confusion matrix shift, ROC point traversal, and trapezoidal AUC area calculation.",
        "verification_oracle": "scikit-learn roc_curve and roc_auc_score golden fixtures comparison."
    },
    "u4-case-churn": {
        "authoring_plan": "Build an end-to-end customer churn analysis using `Social_Network_Ads.csv` (or an equivalent telecom churn dataset subset <= 200 KB).",
        "interactive_element": "Customer Churn Decision Lab: Tune decision threshold to balance false churn predictions vs missed customer retention.",
        "verification_oracle": "scikit-learn LogisticRegression cross-check for parameters and classification report."
    },
    "u4-further-variational-inference": {
        "authoring_plan": "Provide intuitive, conceptual overview of Bayesian posterior intractability, Evidence Lower Bound (ELBO), and optimization-based inference vs MCMC sampling.",
        "interactive_element": "Variational Approximation Explorer: Fit a simple Gaussian distribution q(z) to a bimodal or complex target distribution p(z|x) via KL divergence minimization.",
        "verification_oracle": "Conceptual consistency against Bishop PRML and Blei et al. canonical survey."
    },

    # Unit 5
    "u5-tree-pruning": {
        "authoring_plan": "Explain the mechanics of pre-pruning (early stopping) and post-pruning (minimal cost-complexity pruning with ccp_alpha).",
        "interactive_element": "Decision Tree Pruning Lab: Sliders for max_depth, min_samples_split, and ccp_alpha showing real-time tree simplification and validation error curve.",
        "verification_oracle": "scikit-learn DecisionTreeClassifier(ccp_alpha=...) golden fixtures asserting identical tree depth and node counts."
    },
    "u5-boosting-stacking": {
        "authoring_plan": "Structure the conceptual progression: Individual Weak Learner -> Weighted Ensemble (Boosting) -> Heterogeneous Blending (Stacking).",
        "interactive_element": "Stacking & Boosting Architectural Canvas: Visual diagram showing base learners outputs feeding into meta-learner (e.g. Logistic Regression).",
        "verification_oracle": "scikit-learn StackingClassifier prediction and coefficient assertion on synthetic 2D data."
    },
    "u5-self-adaboost": {
        "authoring_plan": "Formulate the discrete AdaBoost algorithm: initial equal weights, error rate calculation epsilon_t, classifier weight alpha_t, and sample re-weighting.",
        "interactive_element": "AdaBoost Reweighting Animation: Step through boosting rounds observing point sizes grow on misclassified points and decision stumps combine.",
        "verification_oracle": "scikit-learn AdaBoostClassifier golden fixture test verifying alpha weights and sequential stump thresholds."
    },
    "u5-further-dt-regression": {
        "authoring_plan": "Explain decision tree regression splitting on variance reduction (MSE) and leaf node value as sample mean.",
        "interactive_element": "Regression Tree Step-Function Visualizer: Drag points and adjust tree depth to see piecewise constant regression steps.",
        "verification_oracle": "scikit-learn DecisionTreeRegressor golden fixture comparison for split values and leaf predictions."
    },

    # Unit 6
    "u6-association-rules": {
        "authoring_plan": "Define transactional database concepts: itemsets, support count, relative support, confidence, lift, and conviction with supermarket basket examples.",
        "interactive_element": "Market Basket Rule Builder: Select transactions or item frequencies to compute support, confidence, and lift interactively.",
        "verification_oracle": "Deterministic test verifying association rule metric formulas on hand-crafted transaction sets."
    },
    "u6-apriori-algorithm": {
        "authoring_plan": "Step-by-step breakdown of Apriori: find frequent 1-itemsets L_1, candidate generation C_k via join step, candidate pruning via downward-closure property, generate L_k.",
        "interactive_element": "Apriori Stepwise Trace Lab: Interactive trace showing candidate generation, pruning, and rule filtering above min_support and min_confidence thresholds.",
        "verification_oracle": "mlxtend / standard Apriori golden fixture comparison on standard transaction dataset."
    },
    "u6-clustering-overview": {
        "authoring_plan": "Comprehensive comparison table and decision guide for partitional (k-Means), hierarchical (Agglomerative), and density-based (DBSCAN) clustering paradigms.",
        "interactive_element": "Clustering Paradigm Comparison Arena: Side-by-side execution on 4 dataset types (spherical blobs, concentric circles, moons, variable density).",
        "verification_oracle": "Taxonomy correctness and algorithm applicability rule tests."
    },
    "u6-kmeans-clustering": {
        "authoring_plan": "Detailed algorithm explanation: initialization (Random vs k-Means++), assignment step, update step, convergence condition, inertia metric, Elbow heuristic, Silhouette coefficient.",
        "interactive_element": "k-Means Interactive Laboratory: Click to place centroids or run auto k-Means, view Voronoi cells, trace inertia reduction, and generate Elbow plot.",
        "verification_oracle": "scikit-learn KMeans golden fixture comparison on synthetic blobs (inertia and cluster assignments within tolerance)."
    },
    "u6-hierarchical-clustering": {
        "authoring_plan": "Agglomerative hierarchical clustering: proximity matrix, linkage metrics (Single, Complete, Average, Ward), dendrogram construction and distance threshold cutting.",
        "interactive_element": "Interactive Dendrogram Slicer: Adjust horizontal cutting threshold to watch clusters merge/split dynamically in 2D space.",
        "verification_oracle": "scipy.cluster.hierarchy linkage matrix and dendrogram cut test comparison."
    },
    "u6-dbscan-clustering": {
        "authoring_plan": "Density-based spatial clustering of applications with noise: epsilon-neighborhood, minPts, core points, border points, density-reachable, density-connected, noise outliers.",
        "interactive_element": "DBSCAN Density Explorer: Adjust eps circle radius and minPts slider to see core/border/noise points highlighted live on non-convex shapes.",
        "verification_oracle": "scikit-learn DBSCAN golden fixture comparison for labels and noise point detection."
    },
    "u6-dim-reduction-motivation": {
        "authoring_plan": "Deconstruct the Curse of Dimensionality: exponential volume growth, distance concentration phenomenon (max distance / min distance -> 1), sample sparsity.",
        "interactive_element": "Curse of Dimensionality Geometric Visualizer: Explore 1D line -> 2D square -> 3D cube -> hypercube volume fraction in corners.",
        "verification_oracle": "Geometric mathematical calculation assertions (sphere volume / cube volume as d -> inf)."
    },
    "u6-feature-selection-extraction": {
        "authoring_plan": "Contrast Feature Selection (preserving original interpretability via filter, wrapper, embedded methods) with Feature Extraction (projecting to new latent basis).",
        "interactive_element": "Selection vs Extraction Decision Matrix & Interactive Tool: Compare dropping features vs projecting with PCA on a 3D dataset.",
        "verification_oracle": "Categorization and transformation consistency tests."
    },
    "u6-pca": {
        "authoring_plan": "Full mathematical & geometric derivation: data mean centering, covariance matrix Sigma, eigendecomposition Sigma v = lambda v, sorting eigenvalues, projection matrix W, explained variance ratio.",
        "interactive_element": "PCA Principal Axes Rotation & Projection Lab: Rotate 2D axes manually to maximize projected variance, compare with calculated eigenvectors, slider for k components.",
        "verification_oracle": "scikit-learn PCA golden fixture comparison for components_, explained_variance_ratio_, and transformed coordinates."
    },
    "u6-case-anomaly-noise": {
        "authoring_plan": "End-to-end industrial case study: Anomaly detection on multi-sensor server metrics comparing statistical Z-score, DBSCAN noise flags, and PCA reconstruction error.",
        "interactive_element": "Multi-Method Anomaly Detection Workbench: Run Z-score, DBSCAN, and PCA reconstruction error side-by-side on industrial sensor data with threshold tuning.",
        "verification_oracle": "Automated evaluation asserting detection precision and recall against synthetic annotated anomaly masks."
    },
    "u6-self-gmm-em": {
        "authoring_plan": "Gaussian Mixture Models: probabilistic soft clustering, mixture weights pi_k, component Gaussians N(mu_k, Sigma_k), Expectation-Maximization (E-step responsibilities, M-step parameter updates).",
        "interactive_element": "GMM & EM Interactive Visualizer: Watch Gaussian ellipses stretch, rotate, and shift towards data clusters with each EM iteration.",
        "verification_oracle": "scikit-learn GaussianMixture golden fixture comparison for converged means and covariances."
    },
    "u6-further-lda": {
        "authoring_plan": "Linear Discriminant Analysis: supervised dimensionality reduction, between-class scatter S_B, within-class scatter S_W, Fisher's criterion J(w) = w^T S_B w / w^T S_W w.",
        "interactive_element": "LDA Supervised Projection Visualizer: Contrast unsupervised PCA axis with supervised LDA axis separating two labeled overlapping Gaussian classes.",
        "verification_oracle": "scikit-learn LinearDiscriminantAnalysis golden fixture comparison for projection weights."
    }
}

gap_md_lines = [
    "# GAP_ANALYSIS — AIML Studio Content & Lab Gap Resolution Plan",
    "",
    "> This document catalogs all syllabus topics where instructor source materials in `ML/` are missing (`GAP`) or only partially covered (`PARTIAL`). For each item, this analysis details the pedagogical authoring approach, interactive laboratory design, and independent verification oracle.",
    "",
    f"## Summary: {len(gaps_and_partials)} Items Requiring Custom Authoring",
    f"- **Partial Topics (Units 1-5):** {sum(1 for x in gaps_and_partials if x['status'] == 'partial')}",
    f"- **Full Gaps (Units 1-5):** {sum(1 for x in gaps_and_partials if x['status'] == 'gap' and x['unit'] < 6)}",
    f"- **Unit 6 (Complete Unit Gap):** {sum(1 for x in gaps_and_partials if x['unit'] == 6)} (All 12 topics authored from syllabus & standard knowledge)",
    "",
    "---",
    "",
    "## Detailed Gap Resolution Specifications",
    ""
]

for item in gaps_and_partials:
    tid = item["topic_id"]
    strat = gap_authoring_strategies.get(tid, {
        "authoring_plan": "Author from syllabus specifications and canonical AI/ML literature.",
        "interactive_element": "Interactive laboratory demonstrating core mechanics and failure modes.",
        "verification_oracle": "Golden fixture comparisons and property tests."
    })
    sources_str = ", ".join([f"`{s}`" for s in item["sources"]]) if item["sources"] else "*None (Syllabus Only)*"
    gap_md_lines.extend([
        f"### `{item['topic_id']}`: {item['topic_name']}",
        f"- **Unit:** Unit {item['unit']} ({item['unit_title']})",
        f"- **Kind:** `{item['kind']}` | **Hours:** {item['hours']} | **Status:** `{item['status'].upper()}`",
        f"- **Existing Source Materials:** {sources_str}",
        f"- **Authoring Strategy:** {strat['authoring_plan']}",
        f"- **Flagship Interactive Element:** {strat['interactive_element']}",
        f"- **Verification Oracle & Integrity Check:** {strat['verification_oracle']}",
        ""
    ])

with open(os.path.join(DOCS_DIR, "GAP_ANALYSIS.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(gap_md_lines))

print("Generated docs/GAP_ANALYSIS.md successfully.")

