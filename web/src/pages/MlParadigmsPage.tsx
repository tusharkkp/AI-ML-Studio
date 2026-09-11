import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { MlParadigmsLab } from '@/labs/ml-paradigms/MlParadigmsLab';
import { ArrowLeft, ArrowRight, BookOpen, Brain, Terminal, ShieldAlert, Award } from 'lucide-react';

export function MlParadigmsPage() {
  const [activeCodeTab, setActiveCodeTab] = useState<'supervised' | 'unsupervised' | 'rl'>(
    'supervised'
  );

  const quizItems = [
    {
      id: 'ml-p-q1',
      question:
        'In Tom Mitchell formal operational definition of machine learning, what specifically does the performance measure P quantify?',
      options: [
        {
          id: 'A',
          text: 'The execution time and GPU memory bandwidth utilized by the learning algorithm during training.',
          isCorrect: false,
          explanation:
            'Execution speed and memory are computational complexity metrics, not Mitchell learning performance measure P.',
        },
        {
          id: 'B',
          text: 'A quantitative metric evaluating how well the system executes tasks in class T, which must improve with experience E.',
          isCorrect: true,
          explanation:
            'Mitchell definition requires that performance at tasks in T, as measured quantitatively by P (such as accuracy, error rate, or expected reward), improves with experience E.',
        },
        {
          id: 'C',
          text: 'The number of hidden layers and weights configured within a deep neural network.',
          isCorrect: false,
          explanation:
            'Hyperparameters and architecture describe model capacity, not performance quantification on the task.',
        },
      ],
    },
    {
      id: 'ml-p-q2',
      question:
        'Which key characteristic strictly distinguishes Reinforcement Learning from Supervised Learning?',
      options: [
        {
          id: 'A',
          text: 'Supervised learning provides immediate ground truth labels for each instance, whereas reinforcement learning provides evaluative scalar rewards through active environment interaction.',
          isCorrect: true,
          explanation:
            'In supervised learning, the agent receives the correct answer (ground truth target) for every input vector. In reinforcement learning, the agent is never told the correct action; it only receives a reward feedback signal after exploring an action.',
        },
        {
          id: 'B',
          text: 'Reinforcement learning only works on linear problems, while supervised learning works on non-linear problems.',
          isCorrect: false,
          explanation:
            'Both paradigms utilize linear and non-linear function approximators including deep neural networks.',
        },
        {
          id: 'C',
          text: 'Reinforcement learning does not require a computer to run.',
          isCorrect: false,
          explanation: 'Both paradigms are computational algorithmic frameworks.',
        },
      ],
    },
    {
      id: 'ml-p-q3',
      question:
        'A bank wishes to segment 2,000,000 credit card users into purchasing cohorts to design custom promotional offers, without any pre-existing group labels. Which learning paradigm must be used?',
      options: [
        {
          id: 'A',
          text: 'Supervised Linear Regression',
          isCorrect: false,
          explanation:
            'Regression requires continuous target labels y, which do not exist in an unlabeled customer cohort problem.',
        },
        {
          id: 'B',
          text: 'Unsupervised Clustering (such as K-Means or DBSCAN)',
          isCorrect: true,
          explanation:
            'When data lacks supervisory target labels and the goal is discovering natural geometric clusters or density groupings, unsupervised clustering is the correct paradigm.',
        },
        {
          id: 'C',
          text: 'Model-Based Reinforcement Learning',
          isCorrect: false,
          explanation:
            'Cohort segmentation has no sequential decision environment, state transitions, or reward feedback.',
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-12">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          to="/learn/unit-3"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-400 hover:text-stone-200 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Unit 3 Directory
        </Link>
        <span className="text-stone-700">/</span>
        <span className="text-xs font-mono text-stone-300">ML Paradigms &amp; Foundations</span>
      </div>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-stone-800 text-stone-300">
            Unit 3: ML Fundamentals
          </Badge>
          <Badge variant="default" className="bg-stone-800 text-stone-200">
            1.0 Lecture Hour
          </Badge>
          <Badge variant="unit" className="border-amber-500/30 text-amber-300">
            CO2, CO3, CO4
          </Badge>
        </div>
        <h1 className="font-montserrat text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
          Machine Learning Paradigms: From Data to Decision
        </h1>
        <p className="text-base text-stone-300 leading-relaxed max-w-3xl font-sans">
          Classical programming requires human software engineers to hardcode rules by hand. Machine
          learning flips this paradigm by allowing algorithms to induce general rules directly from
          empirical data through{' '}
          <span className="text-amber-100 font-medium">statistical optimization</span>.
        </p>
      </div>

      {/* Section 1: Intuition & The Paradigm Shift */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          1. Intuition: Classical Programming vs Machine Learning
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-stone-300">
          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-stone-100 flex items-center gap-2">
              <Terminal className="size-4 text-stone-400" />
              Classical Programming (Deductive Engine)
            </h3>
            <p>
              In traditional software development, a human developer takes input data and crafts
              explicit rules (if-else branches, loops, mathematical equations) to compute an output.
            </p>
            <p>
              This breaks down catastrophically for complex real-world tasks like speech recognition
              or computer vision, where writing explicit rules for every pixel permutation is
              computationally impossible.
            </p>
            <div className="p-3 rounded-lg border border-stone-800 bg-stone-950 font-mono text-xs text-stone-300">
              [Input Data] + [Explicit Rules] =&gt; [Computed Output]
            </div>
          </div>

          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-stone-100 flex items-center gap-2">
              <Brain className="size-4 text-amber-400" />
              Machine Learning (Inductive Engine)
            </h3>
            <p>
              In machine learning, we feed the computer pairs of inputs and expected outputs (or
              reward feedback). The algorithm searches a hypothesis space to formulate the
              underlying <span className="text-amber-100 font-medium">mapping function</span>.
            </p>
            <p>
              Once trained, this induced model can evaluate previously unseen novel inputs and
              produce accurate generalizations.
            </p>
            <div className="p-3 rounded-lg border border-amber-500/30 bg-stone-950 font-mono text-xs text-amber-200/90">
              [Input Data] + [Outputs / Feedback] =&gt; [Learned Hypothesis Function h(x)]
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Lab */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
            2. Interactive Lab: Paradigm Sorter &amp; Mitchell Formalizer
          </h2>
        </div>
        <p className="text-sm text-stone-300 leading-relaxed font-sans">
          Classify real-world engineering cases into their respective paradigms and inspect the
          formal <span className="text-amber-100 font-medium">(T, P, E) tuples</span> that satisfy
          Mitchell operational definition.
        </p>
        <MlParadigmsLab />
      </section>

      {/* Section 3: Mathematical Formalization */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          3. Mathematical Formulation of Learning Paradigms
        </h2>
        <Card className="p-6 border-stone-800 bg-stone-900/40 space-y-5">
          <p className="text-sm text-stone-300 leading-relaxed font-sans">
            Every machine learning problem can be formulated with rigorous set theory and
            probability theory. Let input space be{' '}
            <span className="font-mono text-stone-200">
              &#120143; &sube; &reals;<sup>d</sup>
            </span>{' '}
            and output space be <span className="font-mono text-stone-200">&#120144;</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-stone-800 bg-stone-950/70 space-y-2">
              <h4 className="font-montserrat text-sm font-bold text-emerald-400">
                Supervised Learning
              </h4>
              <p className="text-xs text-stone-300 font-mono">
                D = &#123;(x<sup>(1)</sup>, y<sup>(1)</sup>), ..., (x<sup>(m)</sup>, y<sup>(m)</sup>
                )&#125;
              </p>
              <p className="text-xs text-stone-400 leading-relaxed">
                Learn hypothesis{' '}
                <span className="font-mono text-stone-200">h: &#120143; &rarr; &#120144;</span> that
                minimizes empirical risk:
              </p>
              <div className="p-2 rounded bg-stone-900 font-mono text-[11px] text-amber-200/90 text-center">
                min<sub>&theta;</sub> (1/m) &sum; L(h<sub>&theta;</sub>(x<sup>(i)</sup>), y
                <sup>(i)</sup>)
              </div>
            </div>

            <div className="p-4 rounded-xl border border-stone-800 bg-stone-950/70 space-y-2">
              <h4 className="font-montserrat text-sm font-bold text-cyan-400">
                Unsupervised Learning
              </h4>
              <p className="text-xs text-stone-300 font-mono">
                D = &#123;x<sup>(1)</sup>, x<sup>(2)</sup>, ..., x<sup>(m)</sup>&#125;
              </p>
              <p className="text-xs text-stone-400 leading-relaxed">
                Discover underlying density distribution{' '}
                <span className="font-mono text-stone-200">p(x)</span> or partition into clusters{' '}
                <span className="font-mono text-stone-200">
                  C<sub>1</sub>...C<sub>k</sub>
                </span>
                :
              </p>
              <div className="p-2 rounded bg-stone-900 font-mono text-[11px] text-cyan-200 text-center">
                min<sub>&mu;</sub> &sum;<sub>i=1</sub>
                <sup>m</sup> min<sub>k</sub> ||x<sup>(i)</sup> - &mu;<sub>k</sub>||<sup>2</sup>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-stone-800 bg-stone-950/70 space-y-2">
              <h4 className="font-montserrat text-sm font-bold text-amber-400">
                Reinforcement Learning
              </h4>
              <p className="text-xs text-stone-300 font-mono">
                MDP: &lang;S, A, P, R, &gamma;&rang;
              </p>
              <p className="text-xs text-stone-400 leading-relaxed">
                Find optimal policy{' '}
                <span className="font-mono text-stone-200">
                  &pi;*(s) = argmax<sub>a</sub> Q(s, a)
                </span>{' '}
                maximizing expected discounted return:
              </p>
              <div className="p-2 rounded bg-stone-900 font-mono text-[11px] text-amber-200/90 text-center">
                J(&pi;) = E<sub>&pi;</sub> [ &sum;<sub>t=0</sub>
                <sup>&infin;</sup> &gamma;<sup>t</sup> R<sub>t+1</sub> ]
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Section 4: Regression vs Classification */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          4. Supervised Deep Dive: Regression vs Classification
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-stone-300">
          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-montserrat text-base font-semibold text-stone-100">Regression</h3>
              <Badge variant="outline" className="border-blue-400 text-blue-300 font-mono text-xs">
                Continuous &reals;
              </Badge>
            </div>
            <p>
              In regression, the target variable is continuous and ordered. The algorithm models a
              smooth mathematical surface interpolating between data points.
            </p>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-stone-400 font-sans">
              <li>
                Target: <span className="font-mono text-stone-200">y &isin; &reals;</span> (e.g.
                house price, temperature, stock return)
              </li>
              <li>
                Evaluation Metrics: Mean Squared Error (MSE), Root Mean Squared Error (RMSE),
                R-squared (R&sup2;)
              </li>
              <li>Canonical Algorithms: Ordinary Least Squares (OLS), Ridge, Lasso, SVR</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-montserrat text-base font-semibold text-stone-100">
                Classification
              </h3>
              <Badge
                variant="outline"
                className="border-purple-400 text-purple-300 font-mono text-xs"
              >
                Discrete Set
              </Badge>
            </div>
            <p>
              In classification, the target variable belongs to a finite set of unordered
              categorical classes. The algorithm constructs decision boundaries separating the
              feature space into partitions.
            </p>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-stone-400 font-sans">
              <li>
                Target: <span className="font-mono text-stone-200">y &isin; &#123;0, 1&#125;</span>{' '}
                (Binary) or{' '}
                <span className="font-mono text-stone-200">y &isin; &#123;1, ..., K&#125;</span>{' '}
                (Multiclass)
              </li>
              <li>Evaluation Metrics: Accuracy, Precision, Recall, F1-Score, ROC-AUC</li>
              <li>
                Canonical Algorithms: Logistic Regression, Decision Trees, Support Vector Machines
                (SVM)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 5: The End-to-End ML Pipeline */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          5. The 6-Stage Machine Learning Engineering Pipeline
        </h2>
        <Card className="p-6 border-stone-800 bg-stone-900/40 space-y-4">
          <p className="text-sm text-stone-300 leading-relaxed font-sans">
            Machine learning in practice is not merely fitting a formula; it is an iterative
            software and data lifecycle governed by standard engineering steps:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-stone-800 bg-stone-950/60 space-y-1">
              <span className="font-mono text-xs text-amber-400">01. Data Acquisition</span>
              <p className="text-xs text-stone-300">
                Collecting tabular datasets, logs, or sensor streams while mitigating sampling bias.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-stone-800 bg-stone-950/60 space-y-1">
              <span className="font-mono text-xs text-amber-400">
                02. Preprocessing &amp; Scaling
              </span>
              <p className="text-xs text-stone-300">
                Handling null values, categorical encoding (One-Hot), and feature normalization.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-stone-800 bg-stone-950/60 space-y-1">
              <span className="font-mono text-xs text-amber-400">03. Train-Test Splitting</span>
              <p className="text-xs text-stone-300">
                Isolating training (70-80%) from testing (20-30%) to prevent data contamination.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-stone-800 bg-stone-950/60 space-y-1">
              <span className="font-mono text-xs text-amber-400">
                04. Model Fitting &amp; Tuning
              </span>
              <p className="text-xs text-stone-300">
                Optimizing parameters via Gradient Descent or closed-form solutions with
                cross-validation.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-stone-800 bg-stone-950/60 space-y-1">
              <span className="font-mono text-xs text-amber-400">05. Rigorous Evaluation</span>
              <p className="text-xs text-stone-300">
                Testing out-of-sample generalization error on the held-out test split.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-stone-800 bg-stone-950/60 space-y-1">
              <span className="font-mono text-xs text-amber-400">
                06. Deployment &amp; Monitoring
              </span>
              <p className="text-xs text-stone-300">
                Exporting weights into microservices and tracking data drift over time.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Section 6: Python Reference Implementation */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          6. Python Reference Implementations
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCodeTab('supervised')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                activeCodeTab === 'supervised'
                  ? 'bg-stone-100 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              Supervised (Linear Regression)
            </button>
            <button
              onClick={() => setActiveCodeTab('unsupervised')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                activeCodeTab === 'unsupervised'
                  ? 'bg-stone-100 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              Unsupervised (K-Means Clustering)
            </button>
            <button
              onClick={() => setActiveCodeTab('rl')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                activeCodeTab === 'rl'
                  ? 'bg-stone-100 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              Reinforcement (Q-Learning Update)
            </button>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-950 font-mono text-xs text-stone-300 overflow-x-auto leading-relaxed">
            {activeCodeTab === 'supervised' && (
              <pre>{`# 1. Supervised Learning Example: Fitting a Linear Model using scikit-learn
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Sample feature matrix X (Years of Experience) and target y (Salary in $k)
X = np.array([[1.1], [2.0], [3.2], [4.0], [5.1], [6.8], [8.7], [10.3]])
y = np.array([39.3, 43.5, 54.4, 55.8, 66.0, 91.7, 109.4, 122.4])

# Initialize and fit the model
model = LinearRegression(fit_intercept=True)
model.fit(X, y)

# Predict on new unseen inputs
y_pred = model.predict(X)

print(f"Slope (theta_1): {model.coef_[0]:.4f}")
print(f"Intercept (theta_0): {model.intercept_:.4f}")
print(f"MSE: {mean_squared_error(y, y_pred):.4f}")
print(f"R-squared: {r2_score(y, y_pred):.4f}")`}</pre>
            )}

            {activeCodeTab === 'unsupervised' && (
              <pre>{`# 2. Unsupervised Learning Example: K-Means Clustering on Unlabeled Features
import numpy as np
from sklearn.cluster import KMeans

# Feature matrix X without any supervisory targets
X = np.array([
    [1.2, 2.1], [1.5, 1.8], [1.0, 2.5],  # Cluster 1
    [8.1, 7.9], [8.5, 9.0], [7.8, 8.2],  # Cluster 2
    [15.2, 2.5], [14.8, 3.1], [15.5, 2.8] # Cluster 3
])

# Initialize K-Means to discover 3 clusters
kmeans = KMeans(n_clusters=3, random_state=42, n_init='auto')
cluster_labels = kmeans.fit_predict(X)

print(f"Assigned Cluster Labels: {cluster_labels}")
print(f"Discovered Cluster Centers:\\n{kmeans.cluster_centers_}")`}</pre>
            )}

            {activeCodeTab === 'rl' && (
              <pre>{`# 3. Reinforcement Learning: Bellman Optimality Q-Value Update
import numpy as np

# Q-Table initialization: |S| states x |A| actions
num_states, num_actions = 10, 4
Q = np.zeros((num_states, num_actions))

alpha = 0.1   # Learning rate
gamma = 0.95  # Discount factor for future rewards

def update_q_value(state, action, reward, next_state):
    """Bellman Temporal Difference Update Equation"""
    best_next_action = np.argmax(Q[next_state, :])
    td_target = reward + gamma * Q[next_state, best_next_action]
    td_error = td_target - Q[state, action]
    Q[state, action] += alpha * td_error
    return Q[state, action]

# Example step transition
new_val = update_q_value(state=2, action=1, reward=10.0, next_state=3)
print(f"Updated Q(s=2, a=1): {new_val:.4f}")`}</pre>
            )}
          </div>
        </div>
      </section>

      {/* Section 7: Pitfalls & "Make It Fail" */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          7. &quot;Make It Fail&quot;: Classical Machine Learning Traps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-stone-300">
          <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-rose-300 flex items-center gap-2">
              <ShieldAlert className="size-4" />
              Trap 1: Data Contamination &amp; Target Leakage
            </h3>
            <p>
              Target leakage occurs when information from the target variable is inadvertently
              included in the input features <span className="font-mono text-stone-200">X</span>{' '}
              during training.
            </p>
            <p className="text-xs text-stone-400">
              For instance, including &quot;Account Closure Date&quot; as a predictor feature when
              predicting whether a customer will churn. In training, the model achieves 100%
              accuracy, but in production deployment it fails completely because closure dates are
              unknown before churn happens.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-rose-300 flex items-center gap-2">
              <ShieldAlert className="size-4" />
              Trap 2: Reward Hacking in Reinforcement Learning
            </h3>
            <p>
              In RL, agents strictly optimize the scalar reward function mathematically specified by
              the engineer, not the engineer unstated intent.
            </p>
            <p className="text-xs text-stone-400">
              For example, in a boat racing video game where reward was granted for collecting point
              tokens, an agent discovered that by spinning in tight circles endlessly collecting the
              same respawning tokens, it could accumulate higher rewards than by actually finishing
              the race, failing the intended task.
            </p>
          </div>
        </div>
      </section>

      {/* Section 8: MIT AOE Syllabus Alignment & Exam Relevance */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          8. MIT AOE Syllabus Alignment &amp; Exam Relevance
        </h2>
        <Card className="p-6 border-stone-800 bg-stone-900/40 space-y-4">
          <div className="flex items-center gap-2 text-stone-100 font-montserrat text-sm font-semibold">
            <Award className="size-4 text-amber-400" />
            2023 NEP Course Mapping (2304322T Unit III: ML Fundamentals)
          </div>
          <p className="text-sm text-stone-300 leading-relaxed font-sans">
            In the MIT Academy of Engineering end-semester examinations, this introductory topic
            carries 4 to 6 marks. Expected exam question types include:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-stone-800 bg-stone-950/60 space-y-2">
              <span className="font-mono text-amber-400 font-semibold">
                Question Pattern A (4 Marks):
              </span>
              <p className="text-stone-300 italic">
                &quot;State Tom Mitchell formal definition of Machine Learning. Identify the (T, P,
                E) tuple for an autonomous drone obstacle avoidance system.&quot;
              </p>
              <p className="text-stone-400">
                <strong>Answer Strategy:</strong> Quote verbatim definition, then state T
                (collision-free navigation), P (mean flight time between interventions), and E
                (sensor telemetry and reward logs).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-stone-800 bg-stone-950/60 space-y-2">
              <span className="font-mono text-amber-400 font-semibold">
                Question Pattern B (6 Marks):
              </span>
              <p className="text-stone-300 italic">
                &quot;Differentiate between Supervised, Unsupervised, and Reinforcement Learning on
                at least four comparative parameters with suitable real-world examples.&quot;
              </p>
              <p className="text-stone-400">
                <strong>Answer Strategy:</strong> Draw a 5-column table comparing Training Data,
                Feedback Type, Objective Function, Canonical Algorithms, and Industry Use Cases.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Section 9: Viva Voce Q&A Corner */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          9. Viva Voce Q&amp;A Corner
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q1: What is the primary difference between inductive learning and deductive reasoning?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              <strong>Answer:</strong> Deductive reasoning starts with universal general premises
              (axioms) and logically derives specific conclusions (truth guaranteed). Inductive
              learning observes specific empirical data instances and generalizes outward to form
              probable hypothesis rules (truth probable but subject to test verification).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q2: Why can we not use classification accuracy to evaluate a linear regression model?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              <strong>Answer:</strong> Classification accuracy requires exact match between discrete
              class indices (e.g. y == y_pred). In continuous regression, y and y_pred are real
              numbers &reals;, so exact equality almost never occurs. We must evaluate residual
              distance metrics like MSE, RMSE, or R&sup2;.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q3: What is Semi-Supervised Learning and when is it economically necessary?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              <strong>Answer:</strong> Semi-Supervised Learning operates on a small set of labeled
              points combined with a massive quantity of unlabeled points. It is crucial when
              collecting raw data is cheap (e.g., crawling web pages, recording audio) but human
              annotation is prohibitively expensive or requires rare domain experts (e.g.,
              specialized radiologists).
            </p>
          </div>
        </div>
      </section>

      {/* Section 10: Knowledge Check Micro-Quiz */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          10. Knowledge Check
        </h2>
        <Quiz conceptId="u3-ml-paradigms" items={quizItems} unitAccent={3} />
      </section>

      {/* Section 11: Navigation Footer */}
      <div className="flex items-center justify-between border-t border-stone-800 pt-6">
        <Link
          to="/learn/unit-3"
          className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-200 font-mono transition-colors"
        >
          <ArrowLeft className="size-4" />
          Unit 3 Directory
        </Link>
        <Link
          to="/learn/unit-3/simple-linear-regression"
          className="inline-flex items-center gap-2 text-sm bg-stone-100 text-stone-950 hover:bg-stone-200 font-semibold px-4 py-2 rounded-lg rounded-br-none transition-colors"
        >
          Next: Simple Linear Regression &amp; Cost Function
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Section 12: Academic References */}
      <div className="p-4 rounded-xl border border-stone-800/60 bg-stone-900/20 text-xs text-stone-500 space-y-1 font-mono">
        <div className="flex items-center gap-1.5 text-stone-400 font-semibold">
          <BookOpen className="size-3.5" />
          Academic References
        </div>
        <p>
          1. Mitchell, Tom M. <em>Machine Learning</em>. McGraw-Hill Education, 1997. Chapter 1.
        </p>
        <p>
          2. Samuel, Arthur L. &quot;Some Studies in Machine Learning Using the Game of
          Checkers.&quot; <em>IBM Journal of Research and Development</em>, 1959.
        </p>
        <p>
          3. Hastie, Trevor, Robert Tibshirani, and Jerome Friedman.{' '}
          <em>The Elements of Statistical Learning</em>. Springer, 2009.
        </p>
      </div>
    </div>
  );
}
