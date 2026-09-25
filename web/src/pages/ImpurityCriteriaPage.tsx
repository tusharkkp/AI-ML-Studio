import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
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
    id: 'imp-q1',
    question:
      'What is the theoretical maximum Shannon Entropy for a binary classification problem (K = 2)?',
    options: [
      {
        id: 'opt-a',
        text: '1.0 bit, occurring when both classes are equally likely (p1 = p2 = 0.5)',
        isCorrect: true,
        explanation:
          'Correct: When p = 0.5, H(S) = -(0.5*log2(0.5) + 0.5*log2(0.5)) = -(0.5*(-1) + 0.5*(-1)) = 1.0 bit.',
      },
      {
        id: 'opt-b',
        text: '0.5 bits, occurring when one class has 100% frequency',
        isCorrect: false,
        explanation: 'Incorrect: A pure node has an entropy of exactly 0.0 bits.',
      },
      {
        id: 'opt-c',
        text: 'Infinity, because entropy is unbounded for continuous probabilities',
        isCorrect: false,
        explanation:
          'Incorrect: For discrete distributions with K states, entropy is bounded by log2(K).',
      },
      {
        id: 'opt-d',
        text: '0.459, corresponding to the Gini impurity value',
        isCorrect: false,
        explanation:
          'Incorrect: 0.459 is the Gini impurity of the Play Tennis root, not maximum entropy.',
      },
    ],
  },
  {
    id: 'imp-q2',
    question:
      'Why did Quinlan introduce Gain Ratio in C4.5 to replace raw Information Gain from ID3?',
    options: [
      {
        id: 'opt-a',
        text: 'Because raw Information Gain is biased toward attributes with many distinct fine-grained values',
        isCorrect: true,
        explanation:
          'Correct: Attributes with numerous unique values (like Customer ID or Date) produce many tiny pure subsets, inflating Information Gain while having zero predictive power.',
      },
      {
        id: 'opt-b',
        text: 'Because Information Gain cannot be calculated with logarithms',
        isCorrect: false,
        explanation: 'Incorrect: Information Gain relies directly on base-2 logarithms.',
      },
      {
        id: 'opt-c',
        text: 'Because Gini impurity is mathematically superior in every possible domain',
        isCorrect: false,
        explanation:
          'Incorrect: Gain Ratio was designed within entropy theory, not as an abandonment of it.',
      },
      {
        id: 'opt-d',
        text: 'Because Gain Ratio forces all decision trees to be strictly binary',
        isCorrect: false,
        explanation:
          'Incorrect: C4.5 with Gain Ratio still produces multi-way splits for discrete attributes.',
      },
    ],
  },
  {
    id: 'imp-q3',
    question:
      'How do Gini Impurity and Shannon Entropy compare in practical computational performance?',
    options: [
      {
        id: 'opt-a',
        text: 'Gini impurity is faster to compute because it avoids logarithmic operations',
        isCorrect: true,
        explanation:
          'Correct: Gini only requires squaring probabilities (1 - sum(p_i^2)), whereas entropy requires floating-point log2 evaluations.',
      },
      {
        id: 'opt-b',
        text: 'Entropy is always 10x faster due to bitwise operations',
        isCorrect: false,
        explanation:
          'Incorrect: Logarithms are computationally heavier than simple multiplication and subtraction.',
      },
      {
        id: 'opt-c',
        text: 'They produce completely opposite decision tree topologies on 99% of datasets',
        isCorrect: false,
        explanation:
          'Incorrect: In practice, Gini and Entropy select identical split attributes over 95% of the time.',
      },
      {
        id: 'opt-d',
        text: 'Gini cannot handle multiclass problems beyond binary classes',
        isCorrect: false,
        explanation:
          'Incorrect: Gini generalizes seamlessly to any arbitrary K classes via 1 - sum_{i=1}^K p_i^2.',
      },
    ],
  },
  {
    id: 'imp-q4',
    question:
      'If a node contains 10 samples of class A and 0 samples of class B, what are its Entropy and Gini Impurity?',
    options: [
      {
        id: 'opt-a',
        text: 'Entropy = 0, Gini = 0',
        isCorrect: true,
        explanation:
          'Correct: A completely pure node has zero uncertainty, yielding 0 bits of entropy and 0.0 Gini impurity.',
      },
      {
        id: 'opt-b',
        text: 'Entropy = 1, Gini = 0.5',
        isCorrect: false,
        explanation: 'Incorrect: These values correspond to maximum impurity in a 50/50 mixture.',
      },
      {
        id: 'opt-c',
        text: 'Entropy = 0.940, Gini = 0.459',
        isCorrect: false,
        explanation: 'Incorrect: These are the values for the 9-to-5 Play Tennis dataset.',
      },
      {
        id: 'opt-d',
        text: 'Entropy = -1, Gini = -0.5',
        isCorrect: false,
        explanation: 'Incorrect: Neither Entropy nor Gini can ever be negative.',
      },
    ],
  },
];

export const ImpurityCriteriaPage: React.FC = () => {
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
          <Badge variant="outline">50 Mins</Badge>
          <Badge variant="outline">Topic ID: u5-impurity-split-criteria</Badge>
          <Badge variant="outline">CO2, CO4</Badge>
          <Badge variant="default">Core Concept</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground font-manrope">
          Impurity measures: Entropy, information gain & Gini
        </h1>

        <p className="text-base text-muted-foreground leading-relaxed">
          The mathematical compass of tree induction: understand how{' '}
          <span className="text-cream font-medium">Shannon Entropy and Gini Impurity</span> quantify
          node disorder to discover optimal split boundaries.
        </p>
      </div>

      {/* 2. The Hook */}
      <Card className="p-6 border-orange-50/15 bg-black/10 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground font-manrope">
          <Sparkles className="w-4 h-4 text-cream" />
          <span>The Hook: The unpredictability of coin tosses</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Toss a two-headed coin: you know with 100% certainty it will land on Heads. The outcome
          contains zero surprise. Now toss a fair coin: you have zero clue what will happen. Claude
          Shannon formulated information theory in 1948 to quantify this exact intuition:{' '}
          <span className="text-cream font-medium">how many bits of surprise</span> are contained in
          an outcome distribution.
        </p>
      </Card>

      {/* 3. Intuition: Entropy vs Gini */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          1. Intuition: Quantifying node impurity
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          In a decision tree, our ultimate goal is purity: we want every leaf to contain instances
          of only one single class. At every step, the algorithm seeks the split that produces the{' '}
          <span className="text-cream font-medium">greatest drop in disorder</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <Card className="p-5 border-border/60 bg-muted/20 space-y-2">
            <h3 className="text-sm font-semibold text-foreground font-manrope">
              Shannon Entropy (ID3 / C4.5)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Measures the average number of bits required to encode the class of an instance drawn
              at random from the subset. Peaks at 1.0 bit when classes are equally balanced (50/50),
              and drops smoothly to 0.0 bits when all instances belong to one class.
            </p>
          </Card>

          <Card className="p-5 border-border/60 bg-muted/20 space-y-2">
            <h3 className="text-sm font-semibold text-foreground font-manrope">
              Gini Impurity (CART)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Measures the probability of misclassifying a randomly chosen element from the set if
              it were randomly labeled according to the class distribution. Peaks at 0.5 for
              balanced binary classes, and reaches 0.0 for pure nodes.
            </p>
          </Card>
        </div>
      </div>

      {/* 4. Interactive Lab */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          2. Interactive Lab: Play Tennis split benchmark
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Toggle between Entropy (ID3) and Gini Impurity (CART). Observe how both metrics
          independently arrive at the exact same optimal root decision attribute:{' '}
          <span className="text-cream font-medium">Outlook</span>.
        </p>
        <DecisionTreeSplitLab />
      </div>

      {/* 5. Step-by-Step on Paper */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          3. Step-by-Step on Paper: Calculating Information Gain
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Let us calculate by hand the exact Information Gain of splitting by{' '}
          <span className="text-cream font-medium">Outlook</span> on the 14-instance Play Tennis
          training set:
        </p>

        <div className="p-5 rounded-xl border border-border/60 bg-black/20 space-y-4 text-xs font-mono">
          <div>
            <div className="text-foreground font-bold">1. Calculate Parent Node Entropy H(S):</div>
            <p className="text-muted-foreground mt-1">
              {'S has 9 Yes and 5 No (|S| = 14):'}
              <br />
              {
                '$$H(S) = -\\left(\\frac{9}{14}\\log_2\\frac{9}{14} + \\frac{5}{14}\\log_2\\frac{5}{14}\\right) \\approx 0.940\\text{ bits}$$'
              }
            </p>
          </div>

          <div>
            <div className="text-foreground font-bold">
              2. Calculate Subset Entropies for Outlook:
            </div>
            <ul className="text-muted-foreground mt-1 space-y-1 list-disc pl-4">
              <li>
                <strong>Sunny (5 rows: 2 Yes, 3 No):</strong>{' '}
                {'H(S_Sunny) = -(2/5*log2(2/5) + 3/5*log2(3/5)) ≈ 0.971 bits'}
              </li>
              <li>
                <strong>Overcast (4 rows: 4 Yes, 0 No):</strong>{' '}
                {'H(S_Overcast) = -(1*log2(1) + 0) = 0.000 bits (Pure!)'}
              </li>
              <li>
                <strong>Rain (5 rows: 3 Yes, 2 No):</strong>{' '}
                {'H(S_Rain) = -(3/5*log2(3/5) + 2/5*log2(2/5)) ≈ 0.971 bits'}
              </li>
            </ul>
          </div>

          <div>
            <div className="text-foreground font-bold">3. Compute Weighted Remainder Entropy:</div>
            <p className="text-muted-foreground mt-1">
              {
                '$$H(S, \\text{Outlook}) = \\frac{5}{14}(0.971) + \\frac{4}{14}(0.000) + \\frac{5}{14}(0.971) \\approx 0.693\\text{ bits}$$'
              }
            </p>
          </div>

          <div>
            <div className="text-foreground font-bold">4. Final Information Gain:</div>
            <p className="text-cream font-bold mt-1">
              {
                '$$IG(S, \\text{Outlook}) = H(S) - H(S, \\text{Outlook}) = 0.940 - 0.693 = 0.247\\text{ bits}$$'
              }
            </p>
          </div>
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
              Formulas & Definitions
            </h3>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-3.5 rounded-lg bg-black/40 border border-border/40 space-y-1">
                <span className="text-foreground font-bold">Shannon Entropy:</span>
                <div>{'$$H(S) = -\\sum_{i=1}^K p_i \\log_2(p_i)$$'}</div>
              </div>

              <div className="p-3.5 rounded-lg bg-black/40 border border-border/40 space-y-1">
                <span className="text-foreground font-bold">Gini Impurity:</span>
                <div>{'$$I_G(S) = 1 - \\sum_{i=1}^K p_i^2 = \\sum_{i \\neq j} p_i p_j$$'}</div>
              </div>

              <div className="p-3.5 rounded-lg bg-black/40 border border-border/40 space-y-1">
                <span className="text-foreground font-bold">C4.5 Gain Ratio:</span>
                <div>
                  {
                    '$$\\text{SplitInfo}(S, A) = -\\sum_{v \\in \\text{values}(A)} \\frac{|S_v|}{|S|} \\log_2 \\left(\\frac{|S_v|}{|S|}\\right)$$'
                  }
                </div>
                <div>
                  {'$$\\text{GainRatio}(S, A) = \\frac{IG(S, A)}{\\text{SplitInfo}(S, A)}$$'}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* 7. Pseudocode */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          5. Algorithm Pseudocode (Impurity & Split Evaluation)
        </h2>
        <Card className="p-5 border-border/60 bg-black/30 font-mono text-xs text-muted-foreground space-y-2 overflow-x-auto">
          <div className="text-cream font-bold">// Best Split Criterion Evaluator</div>
          <div>function FindBestSplit(dataset S, features F, criterion):</div>
          <div className="pl-4">parentImpurity = ComputeImpurity(S, criterion)</div>
          <div className="pl-4">bestGain = 0, bestFeature = null</div>
          <div className="pl-4">for each attribute A in F:</div>
          <div className="pl-8">weightedChildImpurity = 0</div>
          <div className="pl-8">for each partition S_v in Split(S, A):</div>
          <div className="pl-12">weight = |S_v| / |S|</div>
          <div className="pl-12">
            weightedChildImpurity += weight * ComputeImpurity(S_v, criterion)
          </div>
          <div className="pl-8">gain = parentImpurity - weightedChildImpurity</div>
          <div className="pl-8">if criterion == 'gain_ratio':</div>
          <div className="pl-12">splitInfo = ComputeSplitInfo(S, A)</div>
          <div className="pl-12">gain = splitInfo &gt; 0 ? (gain / splitInfo) : 0</div>
          <div className="pl-8">if gain &gt; bestGain: bestGain = gain, bestFeature = A</div>
          <div className="pl-4">return bestFeature, bestGain</div>
        </Card>
      </div>

      {/* 8. Code It in Python */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          6. Code It in Python: Verifying with scikit-learn
        </h2>
        <Card className="p-5 border-border/60 bg-black/30 font-mono text-xs text-muted-foreground space-y-3">
          <pre className="text-emerald-300 overflow-x-auto">
            {`import numpy as np

def entropy(labels):
    _, counts = np.unique(labels, return_counts=True)
    probs = counts / len(labels)
    return -np.sum(probs * np.log2(probs))

def gini(labels):
    _, counts = np.unique(labels, return_counts=True)
    probs = counts / len(labels)
    return 1.0 - np.sum(probs ** 2)

# Play Tennis Root: 9 Yes, 5 No
y = np.array(['Yes']*9 + ['No']*5)
print(f"Root Entropy: {entropy(y):.3f}")  # 0.940
print(f"Root Gini:    {gini(y):.3f}")     # 0.459`}
          </pre>
        </Card>
      </div>

      {/* 9. Make It Fail: Unique ID Trap */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          7. Make It Fail: The Unique ID Trap of Information Gain
        </h2>
        <Card className="p-6 border-danger/40 bg-danger/5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm font-manrope">
            <AlertTriangle className="w-4 h-4" />
            <span>Pathological Failure: Splitting on Customer ID or Transaction Date</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If a dataset contains a unique identifier (like{' '}
            <span className="text-cream font-medium">Customer_ID</span>), splitting on it creates 14
            separate branches, each containing exactly 1 sample. Every branch has an entropy of 0.
            Raw Information Gain evaluates to an enticing{' '}
            <span className="text-white font-mono">0.940</span>, declaring it the "best" feature,
            even though it possesses absolutely zero predictive power on future unseen customers.
          </p>
        </Card>
      </div>

      {/* 10. Strengths, Limitations & When NOT to Use */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          8. Strengths & Limitations of Split Criteria (CO4)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 border-border/60 bg-muted/20 space-y-2">
            <h3 className="font-semibold text-sm text-foreground font-manrope flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Gini Impurity (CART)
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Requires no transcendental $\log_2$ functions; faster tree training.</li>
              <li>Favors isolating the single largest class into its own pure node.</li>
              <li>Standard choice in modern scikit-learn and LightGBM implementations.</li>
            </ul>
          </Card>

          <Card className="p-5 border-border/60 bg-muted/20 space-y-2">
            <h3 className="font-semibold text-sm text-foreground font-manrope flex items-center gap-1.5 text-amber-400">
              <Scale className="w-4 h-4" /> Shannon Entropy (ID3 / C4.5)
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Directly grounded in Shannon information theory.</li>
              <li>Penalizes impure branches slightly more severely than Gini.</li>
              <li>Prone to multi-valued attribute bias unless normalized with Gain Ratio.</li>
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
              Misconception 1: "Entropy cannot exceed 1.0."
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Reality:</strong> For binary classification ($K=2$), maximum entropy is indeed
              $\log_2(2) = 1.0$. However, for multi-class problems with $K$ balanced classes,
              maximum entropy is $\log_2(K)$. For 8 classes, max entropy is 3.0 bits.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-1">
            <span className="font-semibold text-sm text-foreground">
              Misconception 2: "Gini impurity and Gini coefficient are the same thing."
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Reality:</strong> The Gini coefficient in economics measures income inequality
              across a population (from 0 to 1). The Gini impurity in CART machine learning measures
              the probability of misclassification ($1 - \sum p_i^2$). They share a historical root
              but are completely different formulas.
            </p>
          </div>
        </div>
      </div>

      {/* 12. Check Yourself */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          10. Check Yourself: Impurity measures micro-quiz
        </h2>
        <Quiz conceptId="u5-impurity-split-criteria" items={QUIZ_ITEMS} />
      </div>

      {/* 13. Exam & Viva Corner */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-foreground font-manrope">
          11. Exam & Viva Corner
        </h2>
        <div className="space-y-3">
          <Card className="p-4 border-border/60 bg-black/20 space-y-2">
            <span className="font-semibold text-sm text-cream font-mono">
              Q1: Define Information Gain and write its general mathematical expression.
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Model Answer:</strong> Information Gain is the expected reduction in entropy
              achieved by partitioning a dataset $S$ according to an attribute $A$:
              {' $IG(S, A) = H(S) - \\sum_{v \\in \\text{Values}(A)} \\frac{|S_v|}{|S|} H(S_v)$.'}
            </p>
          </Card>

          <Card className="p-4 border-border/60 bg-black/20 space-y-2">
            <span className="font-semibold text-sm text-cream font-mono">
              Q2: Why does CART prefer Gini Impurity over Shannon Entropy?
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Model Answer:</strong> Gini impurity $1 - \sum p_i^2$ does not compute
              logarithmic functions, making tree construction significantly faster computationally
              while yielding virtually identical split choices on empirical data.
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
          <li>Shannon Entropy quantifies uncertainty in bits: $H(S) = -\sum p_i \log_2 p_i$.</li>
          <li>
            Gini Impurity quantifies misclassification probability: $I_G(S) = 1 - \sum p_i^2$.
          </li>
          <li>
            Information Gain is the reduction in impurity between parent and weighted child subsets.
          </li>
          <li>
            ID3's bias toward high-cardinality attributes is remedied by C4.5's Gain Ratio
            normalizer.
          </li>
          <li>
            Gini and Entropy produce identical split attribute choices over 95% of the time in
            practical benchmarks.
          </li>
        </ul>

        <div className="pt-4 border-t border-border/40 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Up Next: Controlling Tree Overfitting
          </span>
          <Link to="/learn/unit-5/tree-pruning">
            <Button variant="primary" size="sm">
              Explore Tree Pruning Strategies <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
