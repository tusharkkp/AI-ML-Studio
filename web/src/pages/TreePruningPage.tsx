import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Scissors,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Quiz, QuizItem } from '@/features/quiz/Quiz';
import { TreePruningLab } from '@/labs/tree-pruning/TreePruningLab';

const QUIZ_ITEMS: QuizItem[] = [
  {
    id: 'prune-q1',
    question: 'What is the "Horizon Effect" in decision tree pre-pruning?',
    options: [
      {
        id: 'opt-a',
        text: 'Halting tree growth prematurely before encountering a split that reveals synergistic feature interactions',
        isCorrect: true,
        explanation:
          'Correct: An attribute might have 0 information gain by itself (like in XOR), causing pre-pruning to stop before discovering the decisive second-level split.',
      },
      {
        id: 'opt-b',
        text: 'The phenomenon where tree branches become infinitely long',
        isCorrect: false,
        explanation: 'Incorrect: Pre-pruning bounds tree length; it does not make it infinite.',
      },
      {
        id: 'opt-c',
        text: 'The mathematical distortion caused by converting continuous data to categorical bins',
        isCorrect: false,
        explanation: 'Incorrect: That describes discretization error, not the horizon effect.',
      },
      {
        id: 'opt-d',
        text: 'When validation error decreases monotonically without bound',
        isCorrect: false,
        explanation:
          'Incorrect: Validation error follows a U-shaped curve, rising when overfitting occurs.',
      },
    ],
  },
  {
    id: 'prune-q2',
    question:
      'In Minimal Cost-Complexity Pruning, what does the parameter alpha (α) control in R_α(T) = R(T) + α|T|?',
    options: [
      {
        id: 'opt-a',
        text: 'The learning rate of gradient descent optimization',
        isCorrect: false,
        explanation: 'Incorrect: Gradient descent is not used in decision tree induction.',
      },
      {
        id: 'opt-b',
        text: 'The trade-off penalty between tree misclassification error R(T) and tree size |T|',
        isCorrect: true,
        explanation:
          'Correct: When alpha = 0, the full unpruned tree minimizes R(T). As alpha increases, larger trees are penalized, pruning branches back toward the root.',
      },
      {
        id: 'opt-c',
        text: 'The maximum allowable depth of the tree',
        isCorrect: false,
        explanation:
          'Incorrect: Max depth is a pre-pruning hyperparameter, not the cost-complexity coefficient.',
      },
      {
        id: 'opt-d',
        text: 'The percentage of training samples held out for testing',
        isCorrect: false,
        explanation: 'Incorrect: Holdout fraction is an independent cross-validation parameter.',
      },
    ],
  },
  {
    id: 'prune-q3',
    question: 'Why is post-pruning generally considered mathematically superior to pre-pruning?',
    options: [
      {
        id: 'opt-a',
        text: 'Post-pruning takes less computational training time than pre-pruning',
        isCorrect: false,
        explanation:
          'Incorrect: Post-pruning requires building the entire unconstrained tree first, taking more computation.',
      },
      {
        id: 'opt-b',
        text: 'Post-pruning allows the tree to discover multi-feature interactions before pruning away non-beneficial branches',
        isCorrect: true,
        explanation:
          'Correct: By letting the tree grow completely, weak initial splits that lead to high-purity sub-leaves can be preserved.',
      },
      {
        id: 'opt-c',
        text: 'Post-pruning completely eliminates all training errors permanently',
        isCorrect: false,
        explanation:
          'Incorrect: Pruning intentionally increases training error to improve generalization on unseen test data.',
      },
      {
        id: 'opt-d',
        text: 'Post-pruning transforms categorical trees into continuous neural networks',
        isCorrect: false,
        explanation: 'Incorrect: Post-pruning leaves the model as a decision tree.',
      },
    ],
  },
  {
    id: 'prune-q4',
    question:
      'Which of the following hyperparameters is an example of pre-pruning (early stopping)?',
    options: [
      {
        id: 'opt-a',
        text: 'Cost-complexity pruning parameter ccp_alpha',
        isCorrect: false,
        explanation: 'Incorrect: ccp_alpha is applied post-hoc after the full tree is built.',
      },
      {
        id: 'opt-b',
        text: 'min_samples_leaf and max_depth',
        isCorrect: true,
        explanation:
          'Correct: Restricting minimum leaf size or capping maximum depth stops tree recursion while it is actively growing.',
      },
      {
        id: 'opt-c',
        text: 'Reduced Error Pruning on a validation set',
        isCorrect: false,
        explanation: 'Incorrect: REP traverses an already-built tree bottom-up.',
      },
      {
        id: 'opt-d',
        text: 'Out-Of-Bag (OOB) error estimation',
        isCorrect: false,
        explanation: 'Incorrect: OOB is an evaluation technique for Random Forest bagging.',
      },
    ],
  },
];

export const TreePruningPage: React.FC = () => {
  const [showMath, setShowMath] = useState<boolean>(false);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16 font-montserrat">
      {/* 1. Header & Syllabus Metadata */}
      <div className="space-y-4">
        <Link
          to="/learn/unit-5"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Unit 5 Curriculum
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="unit">Unit 5</Badge>
          <Badge variant="outline">40 Mins</Badge>
          <Badge variant="outline">Topic ID: u5-tree-pruning</Badge>
          <Badge variant="outline">CO2, CO3, CO4</Badge>
          <Badge variant="default">Core Concept</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground font-manrope">
          Tree pruning & overfitting control
        </h1>

        <p className="text-base text-muted-foreground leading-relaxed">
          Taming model variance: master{' '}
          <span className="text-cream font-medium">pre-pruning stopping conditions</span> and
          Breiman's minimal cost-complexity post-pruning to balance tree capacity with
          generalization.
        </p>
      </div>

      {/* 2. The Hook */}
      <Card className="p-6 border-orange-50/15 bg-black/10 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground font-manrope">
          <Scissors className="w-4 h-4 text-cream" />
          <span>The Hook: Why do gardeners prune bonsai trees?</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          An untrimmed tree grows rampant branches that consume all nutrients, blocking sunlight
          from essential leaves. Similarly, an unconstrained decision tree creates bespoke branches
          that isolate individual training outliers. By selectively clipping weak branches, the tree
          achieves <span className="text-cream font-medium">higher structural robustness</span> and
          generalizes cleanly to unseen instances.
        </p>
      </Card>

      {/* 3. Intuition: Bias-Variance Tradeoff in Trees */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          1. Intuition: The two pruning philosophies
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Without constraints, a decision tree will split until every leaf is 100% pure (training
          accuracy = 100%), memoizing noise and outliers. To prevent this, two distinct engineering
          strategies exist:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <Card className="p-5 border-border/60 bg-muted/20 space-y-2">
            <h3 className="text-sm font-semibold text-foreground font-manrope flex items-center gap-1.5 text-amber-400">
              Pre-Pruning (Early Stopping)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Halts node expansion during training before the tree becomes complex. Parameters
              include <span className="text-cream font-medium">max_depth</span>,{' '}
              <span className="text-cream font-medium">min_samples_split</span>, and{' '}
              <span className="text-cream font-medium">min_impurity_decrease</span>. Fast, but risks
              stopping before discovering synergistic combinations (the Horizon Effect).
            </p>
          </Card>

          <Card className="p-5 border-border/60 bg-muted/20 space-y-2">
            <h3 className="text-sm font-semibold text-foreground font-manrope flex items-center gap-1.5 text-emerald-400">
              Post-Pruning (Cost-Complexity)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Grows the tree completely to its unconstrained maximum depth, then works bottom-up,
              collapsing subtrees whose impurity reduction does not justify their complexity penalty
              $\alpha |T|$. Mathematically thorough, avoiding early-stopping myopic traps.
            </p>
          </Card>
        </div>
      </div>

      {/* 4. Interactive Lab */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          2. Interactive Lab: Pre vs Post Pruning Studio
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Adjust the maximum depth slider or the cost-complexity parameter $\alpha$. Turn on the{' '}
          <span className="text-cream font-medium">"Inject Noisy Outliers"</span> toggle to see how
          pruning protects validation accuracy!
        </p>
        <TreePruningLab />
      </div>

      {/* 5. Step-by-Step on Paper */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          3. Step-by-Step on Paper: Minimal Cost-Complexity Pruning
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Breiman's CART algorithm defines the cost-complexity measure for any tree $T$
          parameterized by $\alpha \ge 0$:
          <br />
          {'$$R_\\alpha(T) = R(T) + \\alpha |T|$$'}
        </p>

        <div className="p-5 rounded-xl border border-border/60 bg-black/20 space-y-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-foreground">
            <span className="text-cream font-bold">1. Understand the Variables:</span>
          </div>
          <ul className="text-muted-foreground pl-4 space-y-1 list-disc">
            <li>$R(T)$: Total training misclassification error (or sum of leaf impurities).</li>
            <li>$|T|$: Number of terminal leaf nodes in tree $T$.</li>
            <li>$\alpha$: Complexity penalty per leaf node.</li>
          </ul>

          <div className="flex items-center gap-2 text-foreground pt-2">
            <span className="text-cream font-bold">2. Effective Alpha Formula for Subtree:</span>
          </div>
          <p className="text-muted-foreground pl-4">
            For any internal node $t$, collapsing its entire subtree into a single leaf increases
            error by $R(t) - R(T_t)$, while saving $|T_t| - 1$ leaves. The critical threshold where
            collapsing becomes beneficial is:
            <br />
            {'$$g(t) = \\frac{R(t) - R(T_t)}{|T_t| - 1}$$'}
          </p>

          <div className="flex items-center gap-2 text-foreground pt-2">
            <span className="text-cream font-bold">3. Weakest-Link Selection:</span>
          </div>
          <p className="text-muted-foreground pl-4">
            {
              'At each iteration, CART finds the internal node that minimizes g(t). That node is pruned first, generating the nested sequence T_0 > T_1 > T_2 > ... > root.'
            }
          </p>
        </div>
      </div>

      {/* 6. Formal Mathematical Foundations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium text-foreground font-manrope">
            4. Formal Mathematical Foundations
          </h2>
          <Button variant="outline" size="sm" onClick={() => setShowMath(!showMath)}>
            {showMath ? (
              <ChevronUp className="w-4 h-4 mr-1" />
            ) : (
              <ChevronDown className="w-4 h-4 mr-1" />
            )}
            {showMath ? 'Hide Math' : 'Show Formal Math'}
          </Button>
        </div>

        {showMath && (
          <Card className="p-6 border-orange-50/15 bg-black/20 space-y-4 text-sm text-muted-foreground">
            <h3 className="font-semibold text-foreground text-base font-manrope">
              Reduced Error Pruning (REP) vs Cost-Complexity Pruning (CCP)
            </h3>
            <p>
              In <span className="text-cream font-medium">Reduced Error Pruning</span> (Quinlan
              1987), an independent validation set evaluates whether replacing a subtree with a
              majority leaf increases validation accuracy. In{' '}
              <span className="text-cream font-medium">Cost-Complexity Pruning</span> (Breiman
              1984), a parametric penalty $\alpha$ generates candidate trees, and K-fold
              cross-validation selects the optimal $\alpha^*$.
            </p>
          </Card>
        )}
      </div>

      {/* 7. Pseudocode */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          5. Algorithm Pseudocode (Cost-Complexity Pruning)
        </h2>
        <Card className="p-5 border-border/60 bg-black/30 font-mono text-xs text-muted-foreground space-y-2 overflow-x-auto">
          <div className="text-cream font-bold">// Minimal Cost-Complexity Pruning Algorithm</div>
          <div>function PruneTree(rootNode, alpha):</div>
          <div className="pl-4">function Traverse(node):</div>
          <div className="pl-8">if node.isLeaf: return</div>
          <div className="pl-8">for each child in node.children: Traverse(child)</div>
          <div className="pl-8">if all children are leaves:</div>
          <div className="pl-12">errorIncrease = MisclassIfLeaf(node) - Sum(Misclass(child))</div>
          <div className="pl-12">leafSavings = CountLeaves(node) - 1</div>
          <div className="pl-12">effectiveCost = errorIncrease / leafSavings</div>
          <div className="pl-12">if effectiveCost &lt;= alpha:</div>
          <div className="pl-16">node.isLeaf = true</div>
          <div className="pl-16">node.prediction = MajorityClass(node)</div>
          <div className="pl-16">delete node.children</div>
          <div className="pl-4">Traverse(rootNode)</div>
          <div className="pl-4">return rootNode</div>
        </Card>
      </div>

      {/* 8. Code It in Python */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          6. Code It in Python: scikit-learn Cost Complexity Pruning Path
        </h2>
        <Card className="p-5 border-border/60 bg-black/30 font-mono text-xs text-muted-foreground space-y-3">
          <pre className="text-emerald-300 overflow-x-auto">
            {`from sklearn.tree import DecisionTreeClassifier
import numpy as np

# Train initial unpruned tree
clf = DecisionTreeClassifier(random_state=42)
path = clf.cost_complexity_pruning_path(X_train, y_train)
ccp_alphas, impurities = path.ccp_alphas, path.impurities

# Evaluate each candidate alpha on validation set
clfs = [DecisionTreeClassifier(random_state=42, ccp_alpha=a).fit(X_train, y_train) for a in ccp_alphas]
val_scores = [c.score(X_val, y_val) for c in clfs]

# Pick alpha with peak validation score
best_clf = clfs[np.argmax(val_scores)]
print(f"Optimal Alpha: {ccp_alphas[np.argmax(val_scores)]:.4f}")
print(f"Pruned Tree Depth: {best_clf.get_depth()}, Leaves: {best_clf.get_n_leaves()}")`}
          </pre>
        </Card>
      </div>

      {/* 9. Make It Fail */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          7. Make It Fail: The Horizon Effect in Pre-Pruning
        </h2>
        <Card className="p-6 border-danger/40 bg-danger/5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm font-manrope">
            <AlertTriangle className="w-4 h-4" />
            <span>Premature Termination on Parity / XOR Problems</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In an XOR dataset, individual features $X_1$ and $X_2$ each have an Information Gain of
            exactly $0.0$. If pre-pruning is set with{' '}
            <span className="text-cream font-medium">min_impurity_decrease &gt; 0</span>, the tree
            immediately terminates at the root node, producing a trivial 50% guessing stump.
            Post-pruning avoids this because it grows through the zero-gain split to discover the
            decisive second split.
          </p>
        </Card>
      </div>

      {/* 10. Strengths, Limitations & When NOT to Use */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          8. Pruning Tradeoffs Comparison (CO4)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 border-border/60 bg-muted/20 space-y-2">
            <h3 className="font-semibold text-sm text-foreground font-manrope flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Post-Pruning (Cost Complexity)
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Guarantees no synergistic feature combinations are prematurely missed.</li>
              <li>Generates an explicit nested sequence of optimal subtrees for CV tuning.</li>
              <li>Standard regularization strategy in CART.</li>
            </ul>
          </Card>

          <Card className="p-5 border-border/60 bg-muted/20 space-y-2">
            <h3 className="font-semibold text-sm text-foreground font-manrope flex items-center gap-1.5 text-amber-400">
              <Scale className="w-4 h-4" /> Pre-Pruning (Early Stopping)
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Dramatically cuts computation time by skipping deep tree expansion.</li>
              <li>Directly caps memory usage on massive streaming datasets.</li>
              <li>Susceptible to myopic early termination (Horizon Effect).</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* 11. Common Misconceptions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          9. Common Misconceptions
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-1">
            <span className="font-semibold text-sm text-foreground">
              Misconception 1: "Pruning improves training set accuracy."
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Reality:</strong> Pruning removes splits that fit specific training samples,
              which always slightly decreases training accuracy. Its sole purpose is to lower
              variance and maximize validation / test set accuracy.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-1">
            <span className="font-semibold text-sm text-foreground">
              Misconception 2: "Setting max_depth=3 is sufficient regularization for any problem."
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Reality:</strong> Depth requirements depend on feature interactions. A complex
              decision boundary might need depth 6, but with high min_samples_leaf to prevent leaf
              instability. Rigid small depths cause underfitting.
            </p>
          </div>
        </div>
      </div>

      {/* 12. Check Yourself */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          10. Check Yourself: Tree pruning micro-quiz
        </h2>
        <Quiz conceptId="u5-tree-pruning" items={QUIZ_ITEMS} />
      </div>

      {/* 13. Exam & Viva Corner */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          11. Exam & Viva Corner
        </h2>
        <div className="space-y-3">
          <Card className="p-4 border-border/60 bg-black/20 space-y-2">
            <span className="font-semibold text-sm text-cream font-mono">
              Q1: Differentiate between pre-pruning and post-pruning with suitable examples.
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Model Answer:</strong> Pre-pruning stops tree growth while training based on
              threshold rules (e.g. max_depth = 4, min_samples_split = 10). Post-pruning allows the
              tree to grow to maximum depth, then prunes backward based on validation accuracy or
              cost-complexity penalties (e.g. Minimal Cost-Complexity Pruning with parameter
              ccp_alpha).
            </p>
          </Card>

          <Card className="p-4 border-border/60 bg-black/20 space-y-2">
            <span className="font-semibold text-sm text-cream font-mono">
              Q2: State the formula for Minimal Cost-Complexity Pruning and explain its terms.
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Model Answer:</strong> $R_\alpha(T) = R(T) + \alpha |T|$, where $R(T)$ is the
              total training error, $|T|$ is the number of terminal leaves, and $\alpha \ge 0$ is
              the regularization tuning parameter penalizing tree complexity.
            </p>
          </Card>
        </div>
      </div>

      {/* 14. Summary & Next Up */}
      <Card className="p-6 border-orange-50/15 bg-black/20 space-y-4">
        <h2 className="text-xl font-medium text-foreground font-manrope">
          12. Summary & Key Takeaways
        </h2>
        <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4 leading-relaxed">
          <li>
            Unpruned trees achieve 100% training accuracy by memorizing noise, causing severe
            validation overfitting.
          </li>
          <li>
            Pre-pruning halts growth early using depth and sample thresholds, but risks the Horizon
            Effect.
          </li>
          <li>
            Post-pruning grows a full tree, then uses Cost-Complexity $R_\alpha(T) = R(T) + \alpha
            |T|$ to prune weak branches.
          </li>
          <li>K-fold cross-validation is used to select the optimal penalty $\alpha^*$.</li>
          <li>
            Pruning directly navigates the Bias-Variance tradeoff, sacrificing minor training
            accuracy for peak test generalization.
          </li>
        </ul>

        <div className="pt-4 border-t border-border/40 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Up Next: Support Vector Machines</span>
          <Link to="/learn/unit-5/svm-fundamentals">
            <Button variant="primary" size="sm">
              Discover Maximum Margin SVMs <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
