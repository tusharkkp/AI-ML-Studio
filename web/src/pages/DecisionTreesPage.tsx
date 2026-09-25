import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  Scale,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Quiz, QuizItem } from '@/features/quiz/Quiz';
import { DecisionTreeSplitLab } from '@/labs/decision-tree/DecisionTreeSplitLab';

const QUIZ_ITEMS: QuizItem[] = [
  {
    id: 'dt-q1',
    question:
      'Why do standard decision trees produce orthogonal (axis-aligned) decision boundaries?',
    options: [
      {
        id: 'opt-a',
        text: 'Because each internal node tests only one single feature at a time against a threshold',
        isCorrect: true,
        explanation:
          'Correct: Testing an inequality like x_i <= c partitions the space parallel to the other coordinate axes, producing rectangular decision regions.',
      },
      {
        id: 'opt-b',
        text: 'Because decision trees rely on linear algebra projections',
        isCorrect: false,
        explanation:
          'Incorrect: Trees perform recursive logical branching without matrix projections or vector dot products.',
      },
      {
        id: 'opt-c',
        text: 'Because entropy requires features to be mutually independent',
        isCorrect: false,
        explanation:
          'Incorrect: Decision trees make no conditional independence assumption (unlike Naive Bayes).',
      },
      {
        id: 'opt-d',
        text: 'Because diagonal splits are computationally impossible in computer science',
        isCorrect: false,
        explanation:
          'Incorrect: Oblique decision trees can perform linear combination splits, but classic CART/ID3 trees test single attributes for interpretability.',
      },
    ],
  },
  {
    id: 'dt-q2',
    question: 'How does a decision tree classify a new query instance once trained?',
    options: [
      {
        id: 'opt-a',
        text: 'By calculating Euclidean distance to all training samples',
        isCorrect: false,
        explanation:
          'Incorrect: That describes k-Nearest Neighbors; trees do not store or scan training instances at test time.',
      },
      {
        id: 'opt-b',
        text: 'By traversing from the root to a leaf node following attribute test outcomes',
        isCorrect: true,
        explanation:
          'Correct: Test evaluation at each node routes the sample down a single branch until reaching a leaf containing the majority class.',
      },
      {
        id: 'opt-c',
        text: 'By computing the global gradient across all features',
        isCorrect: false,
        explanation:
          'Incorrect: Gradient descent is used in logistic regression and neural nets, not in decision tree inference.',
      },
      {
        id: 'opt-d',
        text: 'By averaging the predictions of 100 randomly sampled sub-nodes',
        isCorrect: false,
        explanation:
          'Incorrect: That describes a Random Forest ensemble, not a single decision tree.',
      },
    ],
  },
  {
    id: 'dt-q3',
    question:
      'What happens if a decision tree is grown to maximum depth without any stopping conditions on noisy training data?',
    options: [
      {
        id: 'opt-a',
        text: 'The tree underfits and achieves low training accuracy',
        isCorrect: false,
        explanation:
          'Incorrect: An unconstrained tree will continue splitting until leaves are 100% pure, achieving 100% training accuracy.',
      },
      {
        id: 'opt-b',
        text: 'The tree achieves high bias and low variance',
        isCorrect: false,
        explanation: 'Incorrect: Deep trees have very low bias but excessively high variance.',
      },
      {
        id: 'opt-c',
        text: 'The tree memorizes noise and outliers, severely degrading validation performance',
        isCorrect: true,
        explanation:
          'Correct: Unconstrained growth isolates individual noisy points into bespoke leaves, causing catastrophic overfitting.',
      },
      {
        id: 'opt-d',
        text: 'The tree automatically transforms into a Support Vector Machine',
        isCorrect: false,
        explanation:
          'Incorrect: Tree architecture is structurally distinct from maximum-margin hyperplanes.',
      },
    ],
  },
  {
    id: 'dt-q4',
    question:
      'Which of the following is a major advantage of decision trees over logistic regression and neural networks?',
    options: [
      {
        id: 'opt-a',
        text: 'They are immune to data rotation and coordinate transformations',
        isCorrect: false,
        explanation:
          'Incorrect: Trees are notoriously sensitive to rotation because their splits are strictly axis-aligned.',
      },
      {
        id: 'opt-b',
        text: 'They provide white-box interpretability through human-readable if-then rules',
        isCorrect: true,
        explanation:
          'Correct: Any decision path from root to leaf can be translated directly into a transparent logical rule.',
      },
      {
        id: 'opt-c',
        text: 'They require extensive feature scaling such as Z-score standardization',
        isCorrect: false,
        explanation:
          'Incorrect: Trees are invariant to monotonic feature scaling; standardization has zero impact on split points.',
      },
      {
        id: 'opt-d',
        text: 'They have lower variance than ensemble methods',
        isCorrect: false,
        explanation:
          'Incorrect: Single decision trees suffer from high variance, which is why ensembles were created.',
      },
    ],
  },
];

export const DecisionTreesPage: React.FC = () => {
  const [showMath, setShowMath] = useState<boolean>(false);
  const [predictionRevealed, setPredictionRevealed] = useState<boolean>(false);

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
          <Badge variant="outline">45 Mins</Badge>
          <Badge variant="outline">Topic ID: u5-decision-trees</Badge>
          <Badge variant="outline">CO2, CO4</Badge>
          <Badge variant="default">Core Concept</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground font-manrope">
          Decision tree fundamentals & structure
        </h1>

        <p className="text-base text-muted-foreground leading-relaxed">
          Recursive hierarchical partitioning: learn how{' '}
          <span className="text-cream font-medium">axis-aligned decision rules</span> transform
          complex feature spaces into transparent, human-readable logic flowcharts.
        </p>
      </div>

      {/* 2. The Hook */}
      <Card className="p-6 border-orange-50/15 bg-black/10 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground font-manrope">
          <Sparkles className="w-4 h-4 text-cream" />
          <span>The Hook: How do loan officers evaluate credit?</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          When an underwriter reviews an applicant, they do not multiply 40 weights into a sigmoid
          function. They ask sequential questions:{' '}
          <span className="text-cream font-medium">"Is income above ₹50,000?"</span> If yes: "Is
          credit score above 750?" If yes, approve immediately. Decision trees mirror this natural
          human deductive flowchart by recursively slicing continuous and categorical features.
        </p>
      </Card>

      {/* 3. Intuition */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          1. Intuition: Axis-aligned space partitioning
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Imagine scattering blue and orange marbles across a tabletop. A linear classifier draws
          one single straight diagonal line across the entire board. A decision tree operates like a
          guillotine: it makes{' '}
          <span className="text-cream font-medium">horizontal and vertical cuts</span>, slicing the
          table into rectangular bounding boxes until every box contains only one color.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-2">
            <h3 className="text-sm font-semibold text-foreground font-manrope">The Tree Anatomy</h3>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>
                <strong>Root Node:</strong> The master question that splits the entire dataset (e.g.
                Outlook).
              </li>
              <li>
                <strong>Internal Nodes:</strong> Subsequent conditional tests applied to specific
                subsets.
              </li>
              <li>
                <strong>Branches:</strong> The outcome pathways for each value (e.g. Sunny,
                Overcast, Rain).
              </li>
              <li>
                <strong>Leaf Nodes:</strong> Terminal endpoints containing final class predictions
                or probability distributions.
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-2">
            <h3 className="text-sm font-semibold text-foreground font-manrope">
              Orthogonal Boundary Consequence
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Because cuts are strictly perpendicular to feature axes, decision trees can easily
              capture step functions and non-linear interactions. However, approximating a smooth
              45-degree diagonal boundary requires an inefficient, staircase-like sequence of dozens
              of tiny vertical and horizontal cuts.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Interactive Lab */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-2xl font-medium text-foreground font-manrope">
            2. Interactive Lab: Split builder on Play Tennis
          </h2>
          <Badge variant="outline" size="sm">
            Predict-then-Reveal Mode
          </Badge>
        </div>

        {/* Prediction Prompt */}
        {!predictionRevealed ? (
          <div className="p-4 rounded-xl border border-cream/30 bg-cream/5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-cream">
              <HelpCircle className="w-4 h-4" />
              <span>Predict Before You Run:</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Look at the 14-day Play Tennis dataset. Which attribute (Outlook, Temperature,
              Humidity, or Wind) will yield the{' '}
              <span className="text-cream font-medium">highest information gain</span> and become
              the root node?
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {['Outlook', 'Temperature', 'Humidity', 'Wind'].map((feat) => (
                <Button
                  key={feat}
                  variant="outline"
                  size="sm"
                  onClick={() => setPredictionRevealed(true)}
                >
                  Predict {feat}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-xs text-muted-foreground flex items-center justify-between">
            <div>
              <span className="font-semibold text-emerald-400">Prediction Recorded: </span>
              Outlook provides the highest Information Gain (0.247) because its "Overcast" partition
              produces an instantly 100% pure leaf!
            </div>
            <Button variant="ghost" size="sm" onClick={() => setPredictionRevealed(false)}>
              Reset
            </Button>
          </div>
        )}

        <DecisionTreeSplitLab />
      </div>

      {/* 5. Step-by-Step on Paper */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          3. Step-by-Step on Paper: Tracing a sample down the tree
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Suppose a new Saturday arrives with weather:{' '}
          <span className="text-cream font-medium">
            (Outlook = Sunny, Temp = Cool, Humidity = High, Wind = Strong)
          </span>
          . Here is how the trained Mitchell decision tree evaluates it step-by-step:
        </p>

        <div className="p-5 rounded-xl border border-border/60 bg-black/20 space-y-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-foreground">
            <span className="text-cream font-bold">Step 1:</span>
            <span>
              Evaluate Root Node: <strong>Outlook = ?</strong>
            </span>
          </div>
          <p className="text-muted-foreground pl-6">
            Input Outlook is "Sunny". The tree follows the "Sunny" branch down to the next internal
            node.
          </p>

          <div className="flex items-center gap-2 text-foreground pt-2">
            <span className="text-cream font-bold">Step 2:</span>
            <span>
              Evaluate Sub-Node: <strong>Humidity = ?</strong>
            </span>
          </div>
          <p className="text-muted-foreground pl-6">
            Input Humidity is "High". The tree branches along "High" and reaches a leaf node labeled{' '}
            <strong>Play: No</strong>.
          </p>

          <div className="flex items-center gap-2 text-foreground pt-2">
            <span className="text-cream font-bold">Step 3:</span>
            <span>
              Final Decision Emitted: <strong>No Tennis (Play = No)</strong>
            </span>
          </div>
          <p className="text-muted-foreground pl-6">
            Notice that Temperature and Wind were never even inspected. Decision trees only test
            features relevant to the active branch path.
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
              Tree Induction as Greedy Optimization
            </h3>
            <p>
              Finding the globally optimal minimal decision tree is known to be NP-complete.
              Algorithms like ID3 (Iterative Dichotomiser 3) and CART (Classification and Regression
              Trees) use a{' '}
              <span className="text-cream font-medium">greedy, top-down recursive heuristic</span>:
              at each step, select the feature that maximizes impurity reduction.
            </p>

            <div className="p-4 rounded-lg bg-black/40 border border-border/40 font-mono text-xs space-y-2">
              <div className="text-foreground font-bold">Recursive Partitioning Objective:</div>
              <div>{'$$j^*, t^* = \\arg\\max_{j, t} \\Delta I(S, j, t)$$'}</div>
              <div>
                {
                  '$$\\Delta I(S, j, t) = I(S) - \\left( \\frac{|S_L|}{|S|} I(S_L) + \\frac{|S_R|}{|S|} I(S_R) \\right)$$'
                }
              </div>
              <div className="text-muted-foreground">
                where $j$ is the feature index, $t$ is the threshold, and $I(\cdot)$ is the impurity
                measure (Entropy or Gini).
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* 7. Algorithm Pseudocode */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          5. Algorithm Pseudocode (ID3 / CART)
        </h2>
        <Card className="p-5 border-border/60 bg-black/30 font-mono text-xs text-muted-foreground space-y-2 overflow-x-auto">
          <div className="text-cream font-bold">// Recursive Decision Tree Induction</div>
          <div>function BuildTree(dataset S, features F, depth d):</div>
          <div className="pl-4">if AllInstancesSameClass(S): return Leaf(Class(S))</div>
          <div className="pl-4">if F is empty or d &gt;= maxDepth or |S| &lt; minSamples:</div>
          <div className="pl-8">return Leaf(MajorityClass(S))</div>
          <div className="pl-4">bestGain = -inf, bestFeature = null</div>
          <div className="pl-4">for each feature f in F:</div>
          <div className="pl-8">gain = CalculateImpurityReduction(S, f)</div>
          <div className="pl-8">if gain &gt; bestGain: bestGain = gain, bestFeature = f</div>
          <div className="pl-4">if bestGain &lt;= 0: return Leaf(MajorityClass(S))</div>
          <div className="pl-4">node = CreateInternalNode(feature: bestFeature)</div>
          <div className="pl-4">for each outcome v of bestFeature:</div>
          <div className="pl-8">S_v = Subset(S, bestFeature == v)</div>
          <div className="pl-8">
            node.children[v] = BuildTree(S_v, F \ {'{bestFeature}'}, d + 1)
          </div>
          <div className="pl-4">return node</div>
          <div className="pt-2 text-muted-foreground border-t border-border/30">
            Complexity: Time $O(M \cdot N \cdot D)$ where $M$ is features, $N$ is samples, $D$ is
            tree depth. Space $O(N)$ for leaf storage.
          </div>
        </Card>
      </div>

      {/* 8. Code It in Python */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          6. Code It in Python (scikit-learn vs Pure TypeScript)
        </h2>
        <Card className="p-5 border-border/60 bg-black/30 font-mono text-xs text-muted-foreground space-y-3">
          <div className="flex items-center justify-between text-foreground">
            <span className="font-semibold">Python (scikit-learn DecisionTreeClassifier)</span>
            <Badge variant="outline" size="sm">
              Standard Library
            </Badge>
          </div>
          <pre className="text-emerald-300 overflow-x-auto">
            {`from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.preprocessing import OrdinalEncoder
import pandas as pd

# Load Play Tennis dataset
df = pd.read_csv('play_tennis.csv')
X = OrdinalEncoder().fit_transform(df[['outlook', 'temp', 'humidity', 'wind']])
y = df['play']

# Train CART tree with Gini criterion and max depth constraint
clf = DecisionTreeClassifier(criterion='gini', max_depth=3, random_state=42)
clf.fit(X, y)

# Print human-readable ASCII decision tree rules
print(export_text(clf, feature_names=['outlook', 'temp', 'humidity', 'wind']))`}
          </pre>
        </Card>
      </div>

      {/* 9. Make It Fail */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          7. Make It Fail: The high variance instability trap
        </h2>
        <Card className="p-6 border-danger/40 bg-danger/5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm font-manrope">
            <AlertTriangle className="w-4 h-4" />
            <span>High Variance & Instability: Small data changes flip the root node</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The fundamental flaw of single decision trees is{' '}
            <span className="text-cream font-medium">high structural variance</span>. Because tree
            construction is hierarchical and greedy, changing or removing just 1 or 2 rows in the
            training data can cause a different attribute to win at the root node. This radically
            alters every subsequent downstream branch and prediction rule.
          </p>
        </Card>
      </div>

      {/* 10. Strengths, Limitations & When NOT to Use */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          8. Strengths, Limitations & When NOT to Use (CO4)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 border-border/60 bg-muted/20 space-y-2">
            <h3 className="font-semibold text-sm text-foreground font-manrope flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Strengths
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>High interpretability (white-box rules).</li>
              <li>Requires zero feature scaling or normalization.</li>
              <li>Naturally handles mixed categorical and continuous attributes.</li>
              <li>Fast $O(D)$ inference per query sample.</li>
            </ul>
          </Card>

          <Card className="p-5 border-border/60 bg-muted/20 space-y-2">
            <h3 className="font-semibold text-sm text-foreground font-manrope flex items-center gap-1.5 text-rose-400">
              <AlertTriangle className="w-4 h-4" /> Limitations
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Greedy search does not guarantee global optimal tree.</li>
              <li>Prone to extreme overfitting on unpruned trees.</li>
              <li>Axis-aligned cuts struggle with diagonal decision boundaries.</li>
              <li>High sensitivity to small perturbations in training data.</li>
            </ul>
          </Card>

          <Card className="p-5 border-border/60 bg-muted/20 space-y-2">
            <h3 className="font-semibold text-sm text-foreground font-manrope flex items-center gap-1.5 text-amber-400">
              <Scale className="w-4 h-4" /> When NOT to Use
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>
                When maximum predictive accuracy is required (prefer Random Forests or XGBoost).
              </li>
              <li>On smooth continuous regression curves with linear trends.</li>
              <li>When the target depends on diagonal linear combinations of features.</li>
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
              Misconception 1: "Standardizing features changes decision tree splits."
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Reality:</strong> Decision trees depend solely on the relative order of
              values, not their scale. Multiplying a feature by 1,000 or applying Z-score
              standardization preserves identical rank order, leaving split points and tree
              structure 100% unchanged.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-1">
            <span className="font-semibold text-sm text-foreground">
              Misconception 2: "Decision trees find the smallest possible tree that fits the data."
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Reality:</strong> ID3 and CART use greedy myopic heuristics (picking the best
              split right now). They cannot look ahead two steps to find a split that looks weak now
              but leads to a much smaller tree overall.
            </p>
          </div>
        </div>
      </div>

      {/* 12. Check Yourself (Micro-Quiz) */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          10. Check Yourself: Decision tree micro-quiz
        </h2>
        <Quiz conceptId="u5-decision-trees" items={QUIZ_ITEMS} />
      </div>

      {/* 13. Exam & Viva Corner */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          11. Exam & Viva Corner
        </h2>
        <div className="space-y-3">
          <Card className="p-4 border-border/60 bg-black/20 space-y-2">
            <span className="font-semibold text-sm text-cream font-mono">
              Q1: What is the stopping condition for recursive tree induction?
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Model Answer:</strong> Growth stops when: 1) all instances at the node belong
              to the same class (pure leaf), 2) no remaining features are available for further
              splitting, 3) the pre-pruning maximum depth is reached, or 4) the node sample count
              falls below min_samples_split.
            </p>
          </Card>

          <Card className="p-4 border-border/60 bg-black/20 space-y-2">
            <span className="font-semibold text-sm text-cream font-mono">
              Q2: Differentiate between ID3, C4.5, and CART decision tree algorithms.
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Model Answer:</strong> ID3 uses Shannon Entropy / Information Gain on
              categorical features only. C4.5 enhances ID3 by supporting continuous features and
              using Gain Ratio to counter multi-valued attribute bias. CART (Breiman 1984) uses Gini
              Impurity, constructs strictly binary trees, and supports both classification and
              regression.
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
            Decision trees recursively partition feature space into{' '}
            <span className="text-cream font-medium">axis-aligned rectangular regions</span>.
          </li>
          <li>
            At each internal node, greedy selection picks the attribute yielding the highest
            impurity reduction.
          </li>
          <li>
            They provide transparent white-box interpretability through equivalent if-then
            propositional logic rules.
          </li>
          <li>
            They are invariant to monotonic feature scaling, requiring zero numerical
            standardization.
          </li>
          <li>
            Unpruned trees suffer from high variance and noise memorization, demanding careful
            pruning techniques.
          </li>
        </ul>

        <div className="pt-4 border-t border-border/40 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Up Next: Split Criteria Mathematics</span>
          <Link to="/learn/unit-5/impurity-split-criteria">
            <Button variant="primary" size="sm">
              Explore Entropy & Gini Impurity <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
