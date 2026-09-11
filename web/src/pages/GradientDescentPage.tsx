import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { GradientDescentLab } from '@/labs/gradient-descent/GradientDescentLab';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Compass,
  Cpu,
  Layers,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';

export function GradientDescentPage() {
  const [activeCodeTab, setActiveCodeTab] = useState<'batch' | 'sgd' | 'sklearn'>('batch');

  const quizItems = [
    {
      id: 'gd-q1',
      question:
        'In the gradient descent update equation theta_j := theta_j - alpha * (dJ / d_theta_j), why is it mandatory to perform simultaneous updates across all parameters?',
      options: [
        {
          id: 'A',
          text: 'Because gradient descent computes the gradient vector evaluated at the current joint coordinate (theta_0, theta_1). If theta_0 were updated first, the subsequent calculation for theta_1 would evaluate the gradient at an artificial intermediate point not on the original surface path.',
          isCorrect: true,
          explanation:
            'Simultaneous updates ensure that all partial derivatives are computed using the exact same parameter coordinates from iteration t before advancing the coordinates to iteration t+1.',
        },
        {
          id: 'B',
          text: 'Because CPUs cannot perform sequential mathematical operations in RAM.',
          isCorrect: false,
          explanation:
            'CPUs execute instructions sequentially; this is a mathematical consistency requirement.',
        },
        {
          id: 'C',
          text: 'To ensure the learning rate alpha is automatically multiplied by 2.',
          isCorrect: false,
          explanation:
            'Learning rate alpha remains constant unless governed by an explicit decay schedule.',
        },
      ],
    },
    {
      id: 'gd-q2',
      question:
        'Why does feature scaling (such as Z-score normalization) dramatically accelerate the convergence rate of Gradient Descent?',
      options: [
        {
          id: 'A',
          text: 'It transforms elongated, highly eccentric elliptical loss contours into spherical circular bowls, enabling gradient vectors to point directly toward the global minimum rather than oscillating perpendicular to ravine walls.',
          isCorrect: true,
          explanation:
            'Unscaled features with vastly different magnitudes (e.g. square footage in thousands vs bedrooms 1-5) create steep ravine valleys. In such valleys, gradients point mostly across the steep walls rather than down the gently sloping floor toward the minimum.',
        },
        {
          id: 'B',
          text: 'It eliminates the need to calculate partial derivatives entirely.',
          isCorrect: false,
          explanation:
            'Gradients must still be calculated at every step regardless of feature scaling.',
        },
        {
          id: 'C',
          text: 'It permanently forces the learning rate alpha to 1.0.',
          isCorrect: false,
          explanation: 'Alpha is a separate hyperparameter chosen by the engineer.',
        },
      ],
    },
    {
      id: 'gd-q3',
      question:
        'What is the fundamental trade-off between Batch Gradient Descent and Stochastic Gradient Descent (SGD)?',
      options: [
        {
          id: 'A',
          text: 'Batch GD computes exact deterministic gradients over all m instances (smooth descent, slow on massive datasets), whereas SGD updates weights using 1 random sample at a time (fast updates, noisy wandering path, escapes shallow local traps).',
          isCorrect: true,
          explanation:
            'Batch GD requires processing the entire dataset for a single parameter update (O(m) per step). SGD takes immediate noisy steps per instance (O(1) per step), introducing stochastic jitter that helps escape shallow local minima in deep non-convex landscapes.',
        },
        {
          id: 'B',
          text: 'Batch GD only works on classification, while SGD only works on regression.',
          isCorrect: false,
          explanation: 'Both algorithms optimize any differentiable objective function.',
        },
        {
          id: 'C',
          text: 'SGD requires inverting the complete feature matrix in memory.',
          isCorrect: false,
          explanation:
            'Neither algorithm performs matrix inversion; matrix inversion is characteristic of the Normal Equation.',
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
        <span className="text-xs font-mono text-stone-300">Gradient Descent Optimization</span>
      </div>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-stone-800 text-stone-300">
            Unit 3: ML Fundamentals
          </Badge>
          <Badge variant="default" className="bg-stone-800 text-stone-200">
            1.5 Lecture Hours
          </Badge>
          <Badge variant="unit" className="border-amber-500/30 text-amber-300">
            CO2, CO3
          </Badge>
        </div>
        <h1 className="font-montserrat text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
          Gradient Descent Optimization: Mechanics, Dynamics &amp; Convergence
        </h1>
        <p className="text-base text-stone-300 leading-relaxed max-w-3xl font-sans">
          When datasets scale to millions of rows or thousands of features, analytical matrix
          inversion becomes intractable. Gradient Descent provides the universal iterative engine
          that powers modern machine learning by taking steps{' '}
          <span className="text-amber-100 font-medium">proportional to the negative gradient</span>{' '}
          of the loss function.
        </p>
      </div>

      {/* Section 1: Intuition */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          1. Intuition: The Blind Mountaineer in the Fog
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-stone-300">
          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-stone-100 flex items-center gap-2">
              <Compass className="size-4 text-amber-400" />
              Feeling the Slope Underfoot
            </h3>
            <p>
              Imagine standing on a steep mountain ridge enveloped in dense fog with zero
              visibility. Your objective is reaching the lowest elevation in the valley floor.
            </p>
            <p>
              Even without seeing the landscape, you can feel the slope of the ground beneath your
              boots. By repeatedly stepping in the direction of steepest downward descent, you
              naturally move closer to the valley bottom with every stride.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-stone-100 flex items-center gap-2">
              <Layers className="size-4 text-amber-400" />
              The Danger of Step Size (&alpha;)
            </h3>
            <p>
              Your stride length represents the{' '}
              <span className="text-amber-100 font-medium">learning rate &alpha;</span>. If your
              strides are microscopic (0.1 millimeters), you will spend a lifetime crawling down the
              mountain.
            </p>
            <p>
              Conversely, if you take colossal leaps (100 meters), you will leap entirely across the
              valley, slam into the opposite cliff face, and ricochet higher and higher into outer
              space: mathematical divergence.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Lab */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          2. Interactive Lab: Loss Surface Contour &amp; Trajectory Simulator
        </h2>
        <p className="text-sm text-stone-300 leading-relaxed font-sans">
          Experiment with step-by-step gradient descent updates. Toggle Z-score normalization to
          observe how feature scaling transforms elongated ravine contours into circular spherical
          bowls.
        </p>
        <GradientDescentLab />
      </section>

      {/* Section 3: Mathematical Formalism */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          3. Mathematical Formulation &amp; Partial Derivative Derivations
        </h2>
        <Card className="p-6 border-stone-800 bg-stone-900/40 space-y-5">
          <p className="text-sm text-stone-300 leading-relaxed font-sans">
            Let the cost function be the Mean Squared Error over{' '}
            <span className="font-mono text-stone-200">m</span> training samples:
          </p>
          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 font-mono text-xs text-stone-200 text-center">
            J(&theta;<sub>0</sub>, &theta;<sub>1</sub>) = (1 / 2m) &times; &sum;<sub>i=1</sub>
            <sup>m</sup> (h<sub>&theta;</sub>(x<sup>(i)</sup>) - y<sup>(i)</sup>)<sup>2</sup>
          </div>

          <p className="text-sm text-stone-300 leading-relaxed font-sans">
            The gradient vector <span className="font-mono text-stone-200">&nabla;J(&theta;)</span>{' '}
            points in the direction of steepest ascent. To minimize loss, we step in the exact
            opposite direction:
          </p>
          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 font-mono text-xs text-amber-200/90 text-center">
            &theta;<sub>j</sub> := &theta;<sub>j</sub> - &alpha; &times; (&part;J / &part;&theta;
            <sub>j</sub>)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-stone-800 bg-stone-950 space-y-2">
              <span className="font-mono text-xs text-amber-400 font-semibold">
                Gradient for Intercept &theta;<sub>0</sub> (Bias term):
              </span>
              <div className="p-2.5 rounded bg-stone-900 font-mono text-xs text-stone-200">
                &part;J / &part;&theta;<sub>0</sub> = (1/m) &sum;<sub>i=1</sub>
                <sup>m</sup> (h<sub>&theta;</sub>(x<sup>(i)</sup>) - y<sup>(i)</sup>)
              </div>
              <p className="text-xs text-stone-400">
                The gradient for &theta;<sub>0</sub> is simply the average residual error across all
                samples.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-stone-800 bg-stone-950 space-y-2">
              <span className="font-mono text-xs text-amber-400 font-semibold">
                Gradient for Slope &theta;<sub>1</sub> (Weight term):
              </span>
              <div className="p-2.5 rounded bg-stone-900 font-mono text-xs text-stone-200">
                &part;J / &part;&theta;<sub>1</sub> = (1/m) &sum;<sub>i=1</sub>
                <sup>m</sup> (h<sub>&theta;</sub>(x<sup>(i)</sup>) - y<sup>(i)</sup>) &times; x
                <sup>(i)</sup>
              </div>
              <p className="text-xs text-stone-400">
                The gradient for &theta;<sub>1</sub> weights each residual error by its
                corresponding input feature magnitude x<sup>(i)</sup>.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Section 4: Batch vs SGD vs Mini-batch */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          4. Comparative Taxonomy: Batch vs Stochastic vs Mini-Batch
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-montserrat text-sm font-bold text-stone-100">Batch GD</h4>
              <Badge
                variant="outline"
                className="border-blue-400 text-blue-300 font-mono text-[10px]"
              >
                All m samples
              </Badge>
            </div>
            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              Computes gradients using the entire dataset at every step. Trajectory is perfectly
              smooth and deterministic, but computational cost per iteration scales with O(m).
            </p>
            <div className="text-[11px] font-mono text-stone-400 space-y-1 border-t border-stone-800/60 pt-2">
              <p>&bull; Memory: High (loads all data)</p>
              <p>&bull; Path: Monotonically smooth</p>
              <p>&bull; Scalability: Poor on big data</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-montserrat text-sm font-bold text-stone-100">
                Stochastic GD (SGD)
              </h4>
              <Badge
                variant="outline"
                className="border-emerald-400 text-emerald-300 font-mono text-[10px]"
              >
                1 sample / step
              </Badge>
            </div>
            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              Updates parameters immediately after evaluating a single randomly chosen sample.
              Updates are lightning fast, but the descent path jitters erratically.
            </p>
            <div className="text-[11px] font-mono text-stone-400 space-y-1 border-t border-stone-800/60 pt-2">
              <p>&bull; Memory: Extremely low (O(1))</p>
              <p>&bull; Path: Noisy Brownian walk</p>
              <p>&bull; Advantage: Escapes local minima</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-montserrat text-sm font-bold text-stone-100">Mini-Batch GD</h4>
              <Badge
                variant="outline"
                className="border-amber-400 text-amber-300 font-mono text-[10px]"
              >
                32 to 512 samples
              </Badge>
            </div>
            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              The universal industry standard. Groups data into small batches, leveraging SIMD GPU
              tensor acceleration while preserving moderate gradient noise.
            </p>
            <div className="text-[11px] font-mono text-stone-400 space-y-1 border-t border-stone-800/60 pt-2">
              <p>&bull; Memory: Tunable (GPU VRAM)</p>
              <p>&bull; Path: Moderately smooth</p>
              <p>&bull; Status: Standard for Deep Learning</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Feature Normalization Impact */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          5. Why Feature Normalization Matters: Ravine vs Sphere
        </h2>
        <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-4 text-sm text-stone-300 leading-relaxed font-sans">
          <p>
            When input features have unscaled disparate ranges (e.g. Years of Experience &isin; [1,
            10] vs House Square Footage &isin; [1000, 5000]), the quadratic cost function stretches
            into an <span className="text-amber-100 font-medium">eccentric elliptical ravine</span>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-rose-500/30 bg-stone-950 space-y-2">
              <span className="font-mono text-rose-300 font-semibold block">
                Unnormalized Data (Ravine):
              </span>
              <p className="text-stone-400">
                Gradient vectors point almost horizontally across the steep valley walls rather than
                down the shallow ravine floor toward the minimum. Descent steps waste energy
                oscillating wildly back and forth across the cliffs.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-stone-950 space-y-2">
              <span className="font-mono text-emerald-300 font-semibold block">
                Standardized Z-Score Data (Sphere):
              </span>
              <p className="text-stone-400">
                Applying <span className="font-mono text-stone-200">z = (x - &mu;) / &sigma;</span>{' '}
                ensures all feature axes have unit variance. The loss contours become symmetric
                circles where negative gradient vectors point directly toward the center minimum!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Python Code */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <Cpu className="size-5 text-amber-400" />
          6. Python Reference Implementations
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCodeTab('batch')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                activeCodeTab === 'batch'
                  ? 'bg-stone-100 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              Batch Gradient Descent (NumPy)
            </button>
            <button
              onClick={() => setActiveCodeTab('sgd')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                activeCodeTab === 'sgd'
                  ? 'bg-stone-100 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              Stochastic GD (NumPy)
            </button>
            <button
              onClick={() => setActiveCodeTab('sklearn')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                activeCodeTab === 'sklearn'
                  ? 'bg-stone-100 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              Scikit-Learn SGDRegressor
            </button>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-950 font-mono text-xs text-stone-300 overflow-x-auto leading-relaxed">
            {activeCodeTab === 'batch' && (
              <pre>{`import numpy as np

def batch_gradient_descent(X, y, alpha=0.01, epochs=1000):
    """
    Vectorized Batch Gradient Descent for Linear Regression: y_hat = X @ theta
    X: (m, d+1) design matrix including bias column of ones
    y: (m,) target vector
    """
    m, d = X.shape
    theta = np.zeros(d)
    cost_history = []

    for epoch in range(epochs):
        predictions = X @ theta
        errors = predictions - y
        gradient = (1 / m) * (X.T @ errors)
        
        # Simultaneous parameter update
        theta = theta - alpha * gradient
        
        # Record loss
        cost = (1 / (2 * m)) * np.sum(errors ** 2)
        cost_history.append(cost)

    return theta, cost_history`}</pre>
            )}

            {activeCodeTab === 'sgd' && (
              <pre>{`import numpy as np

def stochastic_gradient_descent(X, y, alpha=0.01, epochs=50):
    """Stochastic Gradient Descent updating weights after each individual sample"""
    m, d = X.shape
    theta = np.zeros(d)
    
    for epoch in range(epochs):
        # Shuffle instances every epoch
        indices = np.random.permutation(m)
        for i in indices:
            xi = X[i:i+1] # (1, d)
            yi = y[i:i+1] # (1,)
            prediction = xi @ theta
            error = prediction - yi
            gradient = xi.T @ error
            theta = theta - alpha * gradient.flatten()

    return theta`}</pre>
            )}

            {activeCodeTab === 'sklearn' && (
              <pre>{`from sklearn.linear_model import SGDRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
import numpy as np

# Sample training data
X = np.array([[1.1], [2.0], [3.2], [4.0], [5.1], [6.8], [8.7], [10.3]])
y = np.array([39.3, 43.5, 54.4, 55.8, 66.0, 91.7, 109.4, 122.4])

# SGD requires feature scaling pipeline for stable convergence
pipeline = make_pipeline(
    StandardScaler(),
    SGDRegressor(max_iter=1000, tol=1e-3, eta0=0.01, learning_rate='invscaling', random_state=42)
)

pipeline.fit(X, y)
print("Trained SGD Pipeline successfully fitted.")`}</pre>
            )}
          </div>
        </div>
      </section>

      {/* Section 7: "Make It Fail" */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <AlertTriangle className="size-5 text-rose-400" />
          7. &quot;Make It Fail&quot;: Divergence &amp; Non-Simultaneous Updates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-stone-300">
          <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-rose-300">
              Catastrophic Exploding Gradients
            </h3>
            <p>
              When learning rate &alpha; exceeds the inverse of the maximum eigenvalue of the
              Hessian matrix, the descent step overshoots the parabolic basin.
            </p>
            <p className="text-xs text-stone-400">
              At step t+1, the parameter is farther from the minimum than at step t. The gradient
              grows larger, causing an even larger leap at step t+2, triggering exponential runaway
              into NaN or overflow within 10 iterations.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-rose-300">
              The Asynchronous Update Bug
            </h3>
            <p>
              A classic student coding error: updating &theta;<sub>0</sub> in-place, and then using
              the new &theta;<sub>0</sub> value immediately when computing &part;J/&part;&theta;
              <sub>1</sub>.
            </p>
            <p className="text-xs text-stone-400">
              This violates vector calculus: the gradient vector &nabla;J must be evaluated at the
              single fixed coordinate point (&theta;<sub>0</sub>
              <sup>(t)</sup>, &theta;<sub>1</sub>
              <sup>(t)</sup>). Always compute temporary gradient buffers before applying updates.
            </p>
          </div>
        </div>
      </section>

      {/* Section 8: MIT AOE Syllabus Alignment */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          8. MIT AOE Syllabus Alignment &amp; Exam Relevance
        </h2>
        <Card className="p-6 border-stone-800 bg-stone-900/40 space-y-4">
          <p className="text-sm text-stone-300 leading-relaxed font-sans">
            In the MIT Academy of Engineering end-semester examination (2304322T Unit III), gradient
            descent is tested through both descriptive concepts and manual 1-step numerical
            calculations (6 marks):
          </p>
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-950/70 space-y-2 text-xs">
            <span className="font-mono text-amber-400 font-semibold">
              Typical Exam Numerical Question:
            </span>
            <p className="text-stone-300 italic">
              &quot;Consider 3 data points (x, y): (1, 2), (2, 4), (3, 5). Given initial parameters
              &theta;<sub>0</sub> = 0, &theta;<sub>1</sub> = 0, and learning rate &alpha; = 0.1,
              compute the updated parameter values after one complete iteration of Batch Gradient
              Descent.&quot;
            </p>
            <div className="pt-2 text-stone-400 space-y-1">
              <p>&bull; Step 1: For each point, prediction ŷ = 0 + 0(x) = 0. Errors: -2, -4, -5.</p>
              <p>
                &bull; Step 2: &part;J/&part;&theta;<sub>0</sub> = (1/3) &times; [(-2) + (-4) +
                (-5)] = -11/3 = -3.67
              </p>
              <p>
                &bull; Step 3: &part;J/&part;&theta;<sub>1</sub> = (1/3) &times; [(-2)(1) + (-4)(2)
                + (-5)(3)] = -25/3 = -8.33
              </p>
              <p>
                &bull; Step 4: &theta;<sub>0</sub> := 0 - (0.1)(-3.67) = +0.367
              </p>
              <p>
                &bull; Step 5: &theta;<sub>1</sub> := 0 - (0.1)(-8.33) = +0.833
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Section 9: Viva Voce Corner */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <HelpCircle className="size-5 text-amber-400" />
          9. Viva Voce Q&amp;A Corner
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q1: Can Gradient Descent get trapped in local minima for Linear Regression?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              <strong>Answer:</strong> No. The Mean Squared Error cost function for linear
              regression is a strictly convex paraboloid (bowl-shaped). A convex function has
              exactly one unique minimum, which is globally optimal. There are zero sub-optimal
              local minima.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q2: What is the stopping criterion for terminating Gradient Descent?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              <strong>Answer:</strong> Typical stopping criteria include: 1) Gradient norm falls
              below a prespecified tolerance (||&nabla;J|| &lt; &epsilon;), 2) Change in cost
              between consecutive iterations is infinitesimal (|J<sub>t</sub> - J<sub>t-1</sub>|
              &lt; &delta;), or 3) Maximum iteration limit is reached.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q3: What is the physical meaning of the gradient vector &nabla;J?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              <strong>Answer:</strong> In multivariable calculus, the gradient vector points in the
              direction of maximum instantaneous rate of increase of the scalar field J. Its
              Euclidean magnitude represents the steepness of that slope. Consequently, -&nabla;J
              points in the direction of steepest descent.
            </p>
          </div>
        </div>
      </section>

      {/* Section 10: Knowledge Check */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          10. Knowledge Check
        </h2>
        <Quiz conceptId="u3-gradient-descent" items={quizItems} unitAccent={3} />
      </section>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between border-t border-stone-800 pt-6">
        <Link
          to="/learn/unit-3/simple-linear-regression"
          className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-200 font-mono transition-colors"
        >
          <ArrowLeft className="size-4" />
          Previous: Simple Linear Regression
        </Link>
        <Link
          to="/learn/unit-3"
          className="inline-flex items-center gap-2 text-sm bg-stone-100 text-stone-950 hover:bg-stone-200 font-semibold px-4 py-2 rounded-lg rounded-br-none transition-colors"
        >
          Unit 3 Directory
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Academic References */}
      <div className="p-4 rounded-xl border border-stone-800/60 bg-stone-900/20 text-xs text-stone-500 space-y-1 font-mono">
        <div className="flex items-center gap-1.5 text-stone-400 font-semibold">
          <BookOpen className="size-3.5" />
          Academic References
        </div>
        <p>
          1. Boyd, Stephen, and Lieven Vandenberghe. <em>Convex Optimization</em>. Cambridge
          University Press, 2004.
        </p>
        <p>
          2. Goodfellow, Ian, Yoshua Bengio, and Aaron Courville. <em>Deep Learning</em>. MIT Press,
          2016. Chapter 4: Numerical Computation.
        </p>
      </div>
    </div>
  );
}
