import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { LocallyWeightedLab } from '@/labs/locally-weighted/LocallyWeightedLab';
import { ArrowLeft, ArrowRight, BookOpen, Waves, Database, Code2, HelpCircle } from 'lucide-react';

export function LocallyWeightedRegressionPage() {
  const quizItems = [
    {
      id: 'lwr-q1',
      question:
        'Why is Locally Weighted Linear Regression classified as a "Non-Parametric" learning algorithm?',
      options: [
        {
          id: 'A',
          text: 'Because it cannot discard the training data after fitting: the effective number of parameters to represent the hypothesis scales with dataset size m, and all training instances must be retained in memory at inference time.',
          isCorrect: true,
          explanation:
            'A parametric model summarizes training data into a fixed vector of weights theta of size d, after which data can be discarded. A non-parametric model like LWR must evaluate every training sample to compute weights w_i whenever an inference query x_0 arrives.',
        },
        {
          id: 'B',
          text: 'Because it does not use any mathematical parameters or numbers.',
          isCorrect: false,
          explanation:
            'LWR uses weighted linear parameters theta locally at each query coordinate.',
        },
        {
          id: 'C',
          text: 'Because it only works on non-linear neural networks.',
          isCorrect: false,
          explanation: 'LWR is a classical non-parametric instance-based regression algorithm.',
        },
      ],
    },
    {
      id: 'lwr-q2',
      question:
        'In the Gaussian weighting kernel w_i = exp( - (x_i - x_0)^2 / (2 * tau^2) ), what happens mathematically as the bandwidth parameter tau approaches infinity (tau -> infinity)?',
      options: [
        {
          id: 'A',
          text: 'The exponent approaches zero, so every training instance receives an identical weight w_i approx 1.0, causing LWR to degenerate into standard global Ordinary Least Squares linear regression.',
          isCorrect: true,
          explanation:
            'As tau -> infinity, (x_i - x_0)^2 / (2 * tau^2) -> 0, so exp(0) = 1 for all data points. The diagonal weight matrix W becomes the identity matrix I, and theta = (X^T W X)^(-1) X^T W y simplifies directly to (X^T X)^(-1) X^T y.',
        },
        {
          id: 'B',
          text: 'The weights blow up to infinity, triggering numerical NaN error.',
          isCorrect: false,
          explanation:
            'Because tau is in the denominator of a negative exponent, weights approach 1.0, not infinity.',
        },
        {
          id: 'C',
          text: 'The algorithm transforms into a decision tree.',
          isCorrect: false,
          explanation: 'LWR remains a weighted linear least-squares model.',
        },
      ],
    },
    {
      id: 'lwr-q3',
      question:
        'What is the primary operational drawback of Locally Weighted Linear Regression in high-throughput production systems?',
      options: [
        {
          id: 'A',
          text: 'High computational latency and memory consumption at inference time: evaluating every single prediction requires loading all m training points and inverting a matrix, scaling with O(m * d + d^3) per query.',
          isCorrect: true,
          explanation:
            'Parametric models predict in O(d) time using a dot product. LWR requires querying the entire database for every API request, making it prohibitively sluggish for web services processing thousands of requests per second on large datasets.',
        },
        {
          id: 'B',
          text: 'It cannot fit non-linear curves under any circumstances.',
          isCorrect: false,
          explanation: 'LWR is exceptionally good at fitting complex non-linear curves locally.',
        },
        {
          id: 'C',
          text: 'It requires labels to be binary boolean values.',
          isCorrect: false,
          explanation: 'LWR is a continuous regression algorithm.',
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
        <span className="text-xs font-mono text-stone-300">Locally Weighted Linear Regression</span>
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
            CO2, CO4
          </Badge>
        </div>
        <h1 className="font-montserrat text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
          Locally Weighted Linear Regression (LWR): Non-Parametric Modeling
        </h1>
        <p className="text-base text-stone-300 leading-relaxed max-w-3xl font-sans">
          Parametric linear regression fixes model parameters once during training and discards the
          dataset. Locally Weighted Regression flips this paradigm: it keeps the full dataset in
          memory and fits a custom{' '}
          <span className="text-amber-100 font-medium">localized tangent line</span> on the fly for
          each query point using Gaussian proximity weights.
        </p>
      </div>

      {/* Section 1: Intuition */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          1. Intuition: Lazy Learning &amp; The Local Spotlight
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-stone-300">
          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-stone-100 flex items-center gap-2">
              <Waves className="size-4 text-amber-400" />
              The Gaussian Spotlight
            </h3>
            <p>
              Imagine hiking a winding, serpentine mountain trail at night holding a focused
              flashlight. You do not need to model the global geography of the entire continent to
              take your next step.
            </p>
            <p>
              You only care about the ground illuminated directly in front of your boots. LWR shines
              a Gaussian bell-curve spotlight centered at query coordinate{' '}
              <span className="font-mono text-stone-200">
                x<sub>0</sub>
              </span>
              , weighting nearby training points heavily and ignoring distant points completely.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-stone-100 flex items-center gap-2">
              <Database className="size-4 text-amber-400" />
              Parametric vs Non-Parametric
            </h3>
            <p>
              In parametric regression, training consumes CPU time to yield a compact vector
              &theta;. After training, you delete the training data and evaluate predictions in O(d)
              time.
            </p>
            <p>
              LWR is a <span className="text-amber-100 font-medium">lazy learner</span>. It does
              zero work during training, but performs a full weighted least-squares fit on demand
              whenever a query arrives.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Lab */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          2. Interactive Lab: Bandwidth (&tau;) Sweeper &amp; Local Tangent Explorer
        </h2>
        <p className="text-sm text-stone-300 leading-relaxed font-sans">
          Slide the query probe coordinate x<sub>0</sub> to observe the Gaussian kernel slide across
          points. Adjust bandwidth parameter &tau; to watch the model shift from jagged overfitting
          to rigid linear underfitting.
        </p>
        <LocallyWeightedLab />
      </section>

      {/* Section 3: Mathematical Formalism */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          3. Mathematical Formulation of Weighted Least Squares
        </h2>
        <Card className="p-6 border-stone-800 bg-stone-900/40 space-y-5">
          <p className="text-sm text-stone-300 leading-relaxed font-sans">
            To evaluate a prediction at query coordinate{' '}
            <span className="font-mono text-stone-200">
              x<sub>0</sub>
            </span>
            , LWR minimizes the weighted residual sum of squares:
          </p>
          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 font-mono text-xs text-amber-200/90 text-center">
            J(&theta;) = &sum;<sub>i=1</sub>
            <sup>m</sup> w<sup>(i)</sup> (y<sup>(i)</sup> - &theta;<sup>T</sup>x<sup>(i)</sup>
            )&sup2; = (X&theta; - y)<sup>T</sup> W (X&theta; - y)
          </div>

          <p className="text-sm text-stone-300 leading-relaxed font-sans">
            Where{' '}
            <span className="font-mono text-stone-200">
              W &isin; &reals;<sup>m &times; m</sup>
            </span>{' '}
            is a diagonal matrix populated by the Gaussian weighting kernel:
          </p>
          <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 font-mono text-xs text-stone-200 text-center">
            w<sup>(i)</sup> = exp( - ||x<sup>(i)</sup> - x<sub>0</sub>||&sup2; / (2 &tau;&sup2;) )
          </div>

          <p className="text-sm text-stone-300 leading-relaxed font-sans">
            Setting the matrix gradient{' '}
            <span className="font-mono text-stone-200">
              &nabla;<sub>&theta;</sub> J(&theta;) = 0
            </span>{' '}
            yields the Weighted Normal Equation:
          </p>
          <div className="p-3 rounded-lg bg-stone-950 border border-emerald-500/40 font-mono text-xs text-emerald-300 text-center font-bold">
            &theta; = (X<sup>T</sup> W X)<sup>-1</sup> X<sup>T</sup> W y
          </div>
          <p className="text-xs text-stone-400 font-sans">
            Once &theta; is computed for query x<sub>0</sub>, the local prediction is simply{' '}
            <span className="font-mono text-stone-200">
              ŷ = &theta;<sup>T</sup> x<sub>0</sub>
            </span>
            .
          </p>
        </Card>
      </section>

      {/* Section 4: Python Code */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <Code2 className="size-5 text-amber-400" />
          4. Python Reference Implementation (Pure NumPy)
        </h2>
        <div className="p-4 rounded-xl border border-stone-800 bg-stone-950 font-mono text-xs text-stone-300 overflow-x-auto leading-relaxed">
          <pre>{`import numpy as np

def locally_weighted_linear_regression(X_train, y_train, x_query, tau=0.5):
    """
    Locally Weighted Linear Regression at query coordinate x_query
    X_train: (m, d) array of features
    y_train: (m,) array of targets
    x_query: (d,) single query vector
    """
    m, d = X_train.shape
    # Add bias column of 1s
    X_b = np.c_[np.ones((m, 1)), X_train]
    x_q_b = np.array([1, *x_query])
    
    # Compute Gaussian diagonal weights: w_i = exp(-||x_i - x_0||^2 / (2 * tau^2))
    diff = X_train - x_query
    distances_sq = np.sum(diff ** 2, axis=1)
    weights = np.exp(-distances_sq / (2 * (tau ** 2)))
    W = np.diag(weights)
    
    # Weighted Normal Equation: theta = inv(X_b.T @ W @ X_b) @ X_b.T @ W @ y_train
    XtW = X_b.T @ W
    theta = np.linalg.pinv(XtW @ X_b) @ (XtW @ y_train)
    
    # Predict at query coordinate
    y_pred = x_q_b @ theta
    return y_pred, theta`}</pre>
        </div>
      </section>

      {/* Section 5: Viva Voce Corner */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <HelpCircle className="size-5 text-amber-400" />
          5. Viva Voce Q&amp;A Corner
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q1: What happens if query point x_0 is located far outside the range of training data?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              <strong>Answer:</strong> If x<sub>0</sub> is far in extrapolation territory, ||x
              <sub>i</sub> - x<sub>0</sub>|| is huge for all training points. All weights w
              <sub>i</sub> decay to zero, making the matrix X<sup>T</sup>WX numerically singular
              with zero determinant. LWR is designed for local interpolation within supported data
              manifolds, not far extrapolation.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q2: How does LWR differ fundamentally from K-Nearest Neighbors (KNN)?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              <strong>Answer:</strong> Standard KNN averages target values of K discrete points with
              equal or distance weights, producing flat piece-wise constant step predictions. LWR
              fits an actual sloped linear plane locally to weighted points, producing smooth,
              continuous differentiable curves with local trend estimation.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Knowledge Check */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          6. Knowledge Check
        </h2>
        <Quiz conceptId="u3-locally-weighted-regression" items={quizItems} unitAccent={3} />
      </section>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between border-t border-stone-800 pt-6">
        <Link
          to="/learn/unit-3/bias-variance-tradeoff"
          className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-200 font-mono transition-colors"
        >
          <ArrowLeft className="size-4" />
          Previous: Bias-Variance Tradeoff
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
          1. Cleveland, William S. &quot;Robust Locally Weighted Regression and Smoothing
          Scatterplots.&quot; <em>Journal of the American Statistical Association</em>, 1979.
        </p>
        <p>
          2. Ng, Andrew.{' '}
          <em>CS229 Lecture Notes: Supervised Learning &amp; Locally Weighted Regression</em>.
          Stanford University, 2023.
        </p>
      </div>
    </div>
  );
}
