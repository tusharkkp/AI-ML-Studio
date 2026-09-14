import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Quiz } from '@/features/quiz/Quiz';
import { RegressionMetricsLab } from '@/labs/regression-metrics/RegressionMetricsLab';

export const RegressionMetricsPage: React.FC = () => {
  const quizItems = [
    {
      id: 'rm-q1',
      question:
        'If a dataset contains 3 severe measurement outliers, which metric will experience the largest relative distortion?',
      options: [
        {
          id: 'A',
          text: 'Mean Squared Error (MSE)',
          isCorrect: true,
          explanation:
            'MSE squares individual errors. Large outliers produce squared residual terms that dominate the sum of squared errors, distorting MSE far more than linear metrics like MAE.',
        },
        {
          id: 'B',
          text: 'Mean Absolute Error (MAE)',
          isCorrect: false,
          explanation: 'MAE scales linearly and is robust against outlier explosions.',
        },
        {
          id: 'C',
          text: 'Median Absolute Error',
          isCorrect: false,
          explanation: 'Median absolute error is the most outlier-resistant metric of all.',
        },
      ],
    },
    {
      id: 'rm-q2',
      question: 'Under what condition will Adjusted R² be lower than standard R²?',
      options: [
        {
          id: 'A',
          text: 'Always, whenever the number of predictors p is at least 1',
          isCorrect: true,
          explanation:
            'Because the factor (n - 1) / (n - p - 1) is strictly greater than 1 for any p >= 1, (1 - R²) is multiplied by a factor greater than 1, making Adjusted R² strictly lower than or equal to standard R².',
        },
        {
          id: 'B',
          text: 'Only when the model contains negative regression coefficients',
          isCorrect: false,
          explanation:
            'The signs of regression coefficients do not dictate the degree-of-freedom penalty.',
        },
        {
          id: 'C',
          text: 'Only when the residual variance is greater than total variance',
          isCorrect: false,
          explanation: 'Adjusted R² is lower than R² for any positive predictor count p > 0.',
        },
      ],
    },
    {
      id: 'rm-q3',
      question:
        'What does an upward funnel pattern in a Residuals vs Fitted plot directly violate?',
      options: [
        {
          id: 'A',
          text: 'Homoscedasticity (constant error variance)',
          isCorrect: true,
          explanation:
            'A funnel shape shows that the variance of the residuals increases as fitted values grow, which is the definition of heteroscedasticity and a violation of the constant variance assumption.',
        },
        {
          id: 'B',
          text: 'Feature independence',
          isCorrect: false,
          explanation:
            'Funnel variance relates to heteroscedastic error variance, not predictor collinearity.',
        },
        {
          id: 'C',
          text: 'Convexity of gradient descent',
          isCorrect: false,
          explanation: 'Loss convexity is unaffected by data heteroscedasticity.',
        },
      ],
    },
    {
      id: 'rm-q4',
      question:
        'What is indicated if a regression model yields an R² score of -0.25 on a holdout test set?',
      options: [
        {
          id: 'A',
          text: 'The model predictions produce higher squared error than predicting the simple mean of the test labels',
          isCorrect: true,
          explanation:
            'On test data, if SS_res > SS_tot, 1 - (SS_res / SS_tot) becomes negative. This indicates that the model fits the data worse than simply predicting the constant sample mean y_bar.',
        },
        {
          id: 'B',
          text: 'The code has a bug because R² is mathematically proven to be bounded between 0 and 1',
          isCorrect: false,
          explanation:
            'R² is bounded in [0, 1] only on the training set for OLS with an intercept.',
        },
        {
          id: 'C',
          text: 'The slope of the regression line is negative',
          isCorrect: false,
          explanation:
            'Negative slopes can have perfect R² = 1.0 if points fall directly on the line.',
        },
      ],
    },
    {
      id: 'rm-q5',
      question:
        'On a Normal Q-Q plot, if points in both tails bend upwards away from the 45-degree line, what does this indicate about the residuals?',
      options: [
        {
          id: 'A',
          text: 'The residual distribution has positive skewness (right-skewed tail)',
          isCorrect: true,
          explanation:
            'When sample quantiles exceed theoretical normal quantiles at the high end and fail to drop as low at the lower end, the residual distribution exhibits positive right-skewness.',
        },
        {
          id: 'B',
          text: 'The residuals are perfectly Gaussian',
          isCorrect: false,
          explanation: 'Gaussian errors trace the 45-degree line without bending.',
        },
        {
          id: 'C',
          text: 'The model is underfitting due to excessive regularization',
          isCorrect: false,
          explanation:
            'Q-Q bends indicate non-Gaussian distributional asymmetry, not underfitting.',
        },
      ],
    },
  ];
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-12">
      {/* 1. Hero Header & Course Context */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-amber-500/30 text-amber-400">
            MIT AOE B.Tech AI & ML (2304322T)
          </Badge>
          <Badge variant="outline" className="border-stone-800 text-stone-400">
            Unit 3: ML Fundamentals
          </Badge>
          <Badge variant="outline" className="border-stone-800 text-stone-400">
            0.6 Hours • CO2, CO3
          </Badge>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
          Regression Evaluation Metrics & Residual Diagnostics
        </h1>
        <p className="text-base text-stone-400 max-w-3xl leading-relaxed">
          Measuring predictive quality requires selecting{' '}
          <span className="font-medium text-stone-200">
            loss formulations aligned with real-world penalty costs
          </span>
          . While scalar loss numbers like MSE, MAE, and R² summarize model precision, residual
          diagnostics uncover violations of fundamental Gauss-Markov assumptions that scalars
          conceal.
        </p>
      </section>

      {/* 2. Mathematical Formulation & Definitions */}
      <section className="space-y-6">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Mathematical Formulation & Metric Catalog
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Formal definitions of residuals, error aggregations, and the coefficient of
            determination
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-stone-800 bg-stone-950/60">
            <CardHeader className="pb-2">
              <h3 className="font-display text-base font-semibold text-stone-200">
                Residual & Absolute Metrics
              </h3>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-stone-400">
              <p>
                The individual residual represents the signed discrepancy between ground truth and
                model output:
              </p>
              <div className="p-3 bg-stone-900/80 rounded border border-stone-800 font-mono text-xs text-stone-300">
                e_i = y_i - ŷ_i
              </div>
              <p>
                <span className="font-medium text-stone-200">Mean Absolute Error (MAE)</span>{' '}
                computes the unweighted average magnitude:
              </p>
              <div className="p-3 bg-stone-900/80 rounded border border-stone-800 font-mono text-xs text-emerald-400">
                MAE = (1 / n) * Σ |y_i - ŷ_i|
              </div>
              <p className="text-xs text-stone-400">
                MAE scales linearly with error size and is exceptionally robust against rogue
                measurement anomalies.
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-800 bg-stone-950/60">
            <CardHeader className="pb-2">
              <h3 className="font-display text-base font-semibold text-stone-200">
                Quadratic & Root Metrics
              </h3>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-stone-400">
              <p>
                <span className="font-medium text-stone-200">Mean Squared Error (MSE)</span>{' '}
                punishes large deviations quadratically:
              </p>
              <div className="p-3 bg-stone-900/80 rounded border border-stone-800 font-mono text-xs text-amber-400">
                MSE = (1 / n) * Σ (y_i - ŷ_i)²
              </div>
              <p>Taking the square root restores the metric to the physical target unit scale:</p>
              <div className="p-3 bg-stone-900/80 rounded border border-stone-800 font-mono text-xs text-amber-300">
                RMSE = √MSE = √((1 / n) * Σ (y_i - ŷ_i)²)
              </div>
              <p className="text-xs text-stone-400">
                Always strictly greater than or equal to MAE; RMSE equals MAE only when all errors
                have identical magnitude.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-stone-800 bg-stone-950/60">
          <CardHeader className="pb-2">
            <h3 className="font-display text-base font-semibold text-stone-200">
              Coefficient of Determination: R² and Adjusted R²
            </h3>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-stone-400">
            <p>
              The coefficient of determination quantifies the proportion of target variance
              explained by the model relative to a trivial mean baseline:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 bg-stone-900/80 rounded border border-stone-800 text-stone-300">
                R² = 1 - (SS_res / SS_tot) = 1 - (Σ(y_i - ŷ_i)² / Σ(y_i - ȳ)²)
              </div>
              <div className="p-3 bg-stone-900/80 rounded border border-stone-800 text-stone-300">
                R²_adj = 1 - [ ((1 - R²)(n - 1)) / (n - p - 1) ]
              </div>
            </div>
            <p className="leading-relaxed">
              When features are added, standard R² never decreases because additional degrees of
              freedom can always fit training variance.
              <span className="font-medium text-stone-200">
                Adjusted R² penalizes model dimensionality p
              </span>
              , decreasing whenever a newly added feature fails to reduce unexplained sum of squares
              beyond chance expectation.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 3. Theoretical Derivations & Properties */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Variance Decomposition & Boundary Conditions
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Understanding why total sum of squares splits cleanly and under what conditions R²
            becomes negative
          </p>
        </div>
        <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-3 text-sm text-stone-300">
          <h4 className="font-medium text-stone-100">Total Sum of Squares Decomposition</h4>
          <p className="leading-relaxed">
            For linear models fitted via Ordinary Least Squares that contain an intercept term, the
            orthogonality of residuals to fitted values guarantees that the cross-product term
            vanishes:
          </p>
          <div className="p-3 bg-stone-950 rounded font-mono text-xs text-amber-300">
            SS_tot = SS_reg + SS_res ⟹ Σ (y_i - ȳ)² = Σ (ŷ_i - ȳ)² + Σ (y_i - ŷ_i)²
          </div>
          <p className="leading-relaxed">
            In this canonical OLS setting, R² is bounded on the interval [0, 1] and exactly equals
            the squared Pearson correlation coefficient r² between predicted and actual values.
          </p>
          <div className="p-3 rounded bg-red-950/20 border border-red-900/30 text-xs text-red-300 space-y-1">
            <span className="font-semibold text-red-200">Can R² be negative?</span>
            <p>
              Yes. If an evaluated model is tested on unseen test data or was fitted without an
              intercept, its predictions can be arbitrarily worse than the baseline mean predictor
              ȳ. Whenever SS_res exceeds SS_tot,{' '}
              <span className="font-medium text-stone-200">R² yields a negative value</span>,
              signaling that predicting the simple historical mean would have yielded lower error.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Interactive Simulation Studio */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Interactive Diagnostics Studio
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Simulate outlier shifts, evaluate heteroscedasticity, and inspect Q-Q normality
            departures
          </p>
        </div>
        <RegressionMetricsLab />
      </section>

      {/* 5. Step-by-Step Worked Example */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Manual Calculation Example
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Step-by-step arithmetic verification with a 5-observation dataset
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border border-stone-800 rounded">
            <thead className="bg-stone-900 text-stone-300">
              <tr>
                <th className="p-2.5 border-b border-stone-800">i</th>
                <th className="p-2.5 border-b border-stone-800">x_i</th>
                <th className="p-2.5 border-b border-stone-800">Actual y_i</th>
                <th className="p-2.5 border-b border-stone-800">Predicted ŷ_i</th>
                <th className="p-2.5 border-b border-stone-800">Residual e_i</th>
                <th className="p-2.5 border-b border-stone-800">|e_i|</th>
                <th className="p-2.5 border-b border-stone-800">e_i²</th>
                <th className="p-2.5 border-b border-stone-800">(y_i - ȳ)²</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              <tr>
                <td className="p-2">1</td>
                <td className="p-2">1</td>
                <td className="p-2">3.0</td>
                <td className="p-2">2.8</td>
                <td className="p-2 text-emerald-400">+0.2</td>
                <td className="p-2">0.2</td>
                <td className="p-2">0.04</td>
                <td className="p-2">9.0</td>
              </tr>
              <tr>
                <td className="p-2">2</td>
                <td className="p-2">2</td>
                <td className="p-2">5.0</td>
                <td className="p-2">5.2</td>
                <td className="p-2 text-emerald-400">-0.2</td>
                <td className="p-2">0.2</td>
                <td className="p-2">0.04</td>
                <td className="p-2">1.0</td>
              </tr>
              <tr>
                <td className="p-2">3</td>
                <td className="p-2">3</td>
                <td className="p-2">6.0</td>
                <td className="p-2">6.4</td>
                <td className="p-2 text-amber-400">-0.4</td>
                <td className="p-2">0.4</td>
                <td className="p-2">0.16</td>
                <td className="p-2">0.0</td>
              </tr>
              <tr>
                <td className="p-2">4</td>
                <td className="p-2">4</td>
                <td className="p-2">7.0</td>
                <td className="p-2">7.6</td>
                <td className="p-2 text-red-400">-0.6</td>
                <td className="p-2">0.6</td>
                <td className="p-2">0.36</td>
                <td className="p-2">1.0</td>
              </tr>
              <tr>
                <td className="p-2">5</td>
                <td className="p-2">5</td>
                <td className="p-2">9.0</td>
                <td className="p-2">8.8</td>
                <td className="p-2 text-emerald-400">+0.2</td>
                <td className="p-2">0.2</td>
                <td className="p-2">0.04</td>
                <td className="p-2">9.0</td>
              </tr>
              <tr className="bg-stone-900/80 font-bold text-amber-400">
                <td className="p-2.5" colSpan={4}>
                  Sum Σ (ȳ = 6.0)
                </td>
                <td className="p-2.5">-0.8</td>
                <td className="p-2.5">1.6</td>
                <td className="p-2.5">0.64 (SS_res)</td>
                <td className="p-2.5">20.0 (SS_tot)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-stone-900/60 rounded border border-stone-800">
            <div className="text-stone-400">MAE = 1.6 / 5</div>
            <div className="text-emerald-400 font-bold text-sm">0.320</div>
          </div>
          <div className="p-3 bg-stone-900/60 rounded border border-stone-800">
            <div className="text-stone-400">MSE = 0.64 / 5</div>
            <div className="text-amber-400 font-bold text-sm">0.128</div>
          </div>
          <div className="p-3 bg-stone-900/60 rounded border border-stone-800">
            <div className="text-stone-400">RMSE = √0.128</div>
            <div className="text-amber-400 font-bold text-sm">0.358</div>
          </div>
          <div className="p-3 bg-stone-900/60 rounded border border-stone-800">
            <div className="text-stone-400">R² = 1 - 0.64/20.0</div>
            <div className="text-blue-400 font-bold text-sm">0.968</div>
          </div>
        </div>
      </section>

      {/* 6. Residual Diagnostic Analysis */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Residual Diagnostic Analysis & Gauss-Markov Assumptions
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            The four fundamental residual plots used in professional statistical validation
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-medium text-stone-100 flex items-center gap-2">
              <span className="size-2 rounded-full bg-amber-400" />
              1. Residuals vs Fitted (Linearity & Homoscedasticity)
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Plotting e_i on the vertical axis against ŷ_i tests constant variance. A healthy plot
              shows an unpatterned cloud centered at zero.
              <span className="font-medium text-stone-200">
                Funnel shapes signal heteroscedasticity
              </span>
              , while parabolic arcs indicate missing polynomial features.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-medium text-stone-100 flex items-center gap-2">
              <span className="size-2 rounded-full bg-blue-400" />
              2. Normal Q-Q Plot (Normality of Errors)
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Compares ordered standardized residuals against theoretical quantiles of the standard
              normal distribution. If the errors are Gaussian, points strictly trace the 45°
              diagonal line. S-shaped curves expose heavy tails or skewness.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-medium text-stone-100 flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400" />
              3. Scale-Location Plot (Homoscedasticity Check)
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Plots √|standardized residuals| versus fitted values. By taking square roots of
              absolute residuals, it removes sign asymmetry. A horizontal trend line proves constant
              residual spread across all prediction ranges.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-medium text-stone-100 flex items-center gap-2">
              <span className="size-2 rounded-full bg-red-400" />
              4. Residuals vs Leverage (Cook's Distance)
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Detects high-leverage observations that possess the leverage to tilt the entire
              regression hyperplane. Points lying outside the Cook's distance boundary (D &gt; 0.5
              or 1.0) exert disproportionate influence on parameter estimates.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Metric Selection Decision Matrix */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Metric Selection Decision Matrix
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Matching evaluation criteria to business penalties and data distributions
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-stone-800 rounded font-mono">
            <thead className="bg-stone-900 text-stone-300">
              <tr>
                <th className="p-3 border-b border-stone-800">Metric</th>
                <th className="p-3 border-b border-stone-800">Mathematical Nature</th>
                <th className="p-3 border-b border-stone-800">Outlier Sensitivity</th>
                <th className="p-3 border-b border-stone-800">Optimal Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              <tr>
                <td className="p-3 font-bold text-amber-400">MSE</td>
                <td className="p-3">Quadratic penalty, squared units</td>
                <td className="p-3 text-red-400">Very High (squared)</td>
                <td className="p-3">
                  Optimization loss functions; convex and differentiable everywhere.
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-amber-300">RMSE</td>
                <td className="p-3">Root quadratic, original target units</td>
                <td className="p-3 text-red-400">High</td>
                <td className="p-3">
                  Situations where occasional catastrophic errors carry disproportionate real-world
                  risk.
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-400">MAE</td>
                <td className="p-3">Linear penalty, original target units</td>
                <td className="p-3 text-emerald-400">Low (robust)</td>
                <td className="p-3">
                  Sensor logs or noisy markets with natural anomalies where median loss is desired.
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-blue-400">MAPE</td>
                <td className="p-3">Relative percentage error</td>
                <td className="p-3 text-amber-400">Moderate (fails at y ≈ 0)</td>
                <td className="p-3">
                  Executive dashboards and retail sales where relative percentage accuracy matters.
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-purple-400">R²</td>
                <td className="p-3">Normalized variance explained [0, 1]</td>
                <td className="p-3 text-amber-400">Moderate</td>
                <td className="p-3">Cross-dataset comparison; scale-independent benchmark.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. Production Python & Scikit-Learn Implementation */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Production Python & Scikit-Learn Implementation
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            NumPy vectorization and standard scikit-learn metrics pipeline
          </p>
        </div>
        <div className="p-4 rounded-lg border border-stone-800 bg-stone-950 font-mono text-xs text-stone-300 overflow-x-auto">
          <pre>{`import numpy as np
from sklearn.metrics import (
    mean_squared_error,
    mean_absolute_error,
    mean_absolute_percentage_error,
    r2_score
)

def evaluate_regression(y_true: np.ndarray, y_pred: np.ndarray, p_features: int = 1) -> dict:
    """
    Computes a comprehensive regression scorecard including adjusted R^2.
    """
    n = len(y_true)
    residuals = y_true - y_pred
    
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_true, y_pred)
    mape = mean_absolute_percentage_error(y_true, y_pred) * 100
    r2 = r2_score(y_true, y_pred)
    
    # Adjusted R-squared accounting for predictor count p
    adj_r2 = 1.0 - ((1.0 - r2) * (n - 1)) / (n - p_features - 1)
    
    return {
        "mse": float(mse),
        "rmse": float(rmse),
        "mae": float(mae),
        "mape_pct": float(mape),
        "r2": float(r2),
        "adj_r2": float(adj_r2),
        "max_residual": float(np.max(np.abs(residuals)))
    }

# Example validation
y_actual = np.array([3.0, 5.0, 6.0, 7.0, 9.0])
y_fitted = np.array([2.8, 5.2, 6.4, 7.6, 8.8])
metrics = evaluate_regression(y_actual, y_fitted, p_features=1)
print("Evaluation Scorecard:", metrics)`}</pre>
        </div>
      </section>

      {/* 9. Common Pitfalls & Edge Cases */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Common Pitfalls & Edge Cases
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Failure modes encountered when interpreting regression statistics blindly
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-lg border border-red-900/30 bg-red-950/10 space-y-2">
            <h4 className="font-medium text-red-200">The High R² Non-Linear Trap</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              A linear regression model fitted to quadratic or sinusoidal data can still achieve R²
              &gt; 0.85 if the general trend slopes upward. Inspecting the{' '}
              <span className="font-medium text-stone-200">
                residuals vs fitted plot reveals clear curvature
              </span>
              , proving the linear model is fundamentally misspecified despite high R².
            </p>
          </div>

          <div className="p-4 rounded-lg border border-amber-900/30 bg-amber-950/10 space-y-2">
            <h4 className="font-medium text-amber-200">Division by Zero in MAPE</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              When target actuals y_i equal or hover near zero, MAPE explodes to infinity. In
              financial portfolios or renewable generation where zero output is common, use
              symmetric MAPE (sMAPE) or standard RMSE instead.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/40 space-y-2">
            <h4 className="font-medium text-stone-200">Misinterpreting RMSE Units</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Unlike R² which is dimensionless, RMSE is expressed in the identical units of the
              target variable. Comparing the RMSE of a house price model (thousands of dollars)
              directly against a temperature model (degrees Celsius) is mathematically meaningless.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/40 space-y-2">
            <h4 className="font-medium text-stone-200">Conflating Correlation with Fit</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Pearson correlation r evaluates linear association between two variables. If a model
              predicts ŷ = 100 * y, r remains exactly 1.0, yet the predictions are off by two orders
              of magnitude and R² is deeply negative.
            </p>
          </div>
        </div>
      </section>

      {/* 10. Industrial Applications */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Industrial Applications & Real-World Impact
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Where metric selection and diagnostic auditing dictate mission-critical outcomes
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <Card className="border-stone-800 bg-stone-950/50">
            <CardHeader className="pb-1">
              <h4 className="font-semibold text-stone-200">Electrical Grid Load Dispatch</h4>
            </CardHeader>
            <CardContent className="space-y-2 text-stone-400">
              <p>
                Power grid operators optimize for{' '}
                <span className="font-medium text-stone-200">asymmetric RMSE penalties</span>{' '}
                because underestimating peak load risks rolling blackouts, while overestimating
                merely incurs minor reserve spinning fuel costs.
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-800 bg-stone-950/50">
            <CardHeader className="pb-1">
              <h4 className="font-semibold text-stone-200">Semiconductor Wafer Yield</h4>
            </CardHeader>
            <CardContent className="space-y-2 text-stone-400">
              <p>
                Fabrication equipment telemetry uses residual Q-Q diagnostics to detect tool drift
                before defective microchips are produced, isolating sensor drift from standard white
                noise.
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-800 bg-stone-950/50">
            <CardHeader className="pb-1">
              <h4 className="font-semibold text-stone-200">Automated Valuation Models (AVM)</h4>
            </CardHeader>
            <CardContent className="space-y-2 text-stone-400">
              <p>
                Mortgage underwriters evaluate real-estate valuation models using Median Absolute
                Percentage Error (MdAPE) and strict residual bounds to prevent systemic subprime
                risk.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 11. Viva Voce & Interview Defense */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Viva Voce & Interview Defense (MIT AOE Exam Focus)
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Essential oral examination questions on regression assessment and error assumptions
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q1: Why does RMSE penalize outliers more severely than MAE?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Because RMSE squares each error term before averaging. A residual of 10 adds 100 to
              the squared sum, whereas a residual of 2 adds only 4 (a 25-fold penalty for a 5-fold
              error increase). In contrast, MAE treats error magnitude linearly without exponential
              amplification.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q2: Under what circumstances can R² evaluate to a negative value?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              R² is computed as 1 - (SS_res / SS_tot). If the predictive model performs worse than a
              simple horizontal line predicting the sample mean ȳ, the residual sum of squares
              SS_res exceeds the total sum of squares SS_tot, making the ratio greater than 1 and R²
              strictly negative.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q3: What specific statistical violation does a funnel shape in a Residuals vs Fitted
              plot indicate?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              A funnel shape indicates{' '}
              <span className="font-medium text-stone-200">heteroscedasticity</span>, meaning the
              variance of the error terms is not constant across different levels of the predictor.
              This violates the Gauss-Markov theorem, causing standard errors of regression
              coefficients to be biased and rendering hypothesis tests invalid.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q4: Why must we look at Adjusted R² rather than raw R² when comparing models with
              different numbers of predictors?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Adding any predictor to an OLS model (even random noise) cannot decrease raw R²
              because the optimization algorithm will find coefficients that capture noise by
              chance. Adjusted R² introduces a degree-of-freedom penalty (n - 1) / (n - p - 1) that
              decreases if the added feature does not reduce unexplained variance enough to offset
              the loss of a degree of freedom.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q5: What is the primary purpose of a Normal Q-Q plot of residuals?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              To verify whether regression residuals follow a Gaussian distribution. By plotting
              standardized sample residuals against theoretical standard normal quantiles, any
              systematic deviation from the 45° reference line visually flags skewness, kurtosis, or
              heavy tails.
            </p>
          </div>
        </div>
      </section>

      {/* 12. Key Takeaways & Summary Table */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Key Takeaways & Summary Table
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Quick reference guide for regression validation in academic and industrial contexts
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800">
            <div className="font-semibold text-stone-200">Scalar Metrics vs Diagnostics</div>
            <p className="text-stone-400 mt-1">
              Never rely on R² alone. Always inspect residual plots to verify homoscedasticity,
              linearity, and normality before deploying any regression pipeline.
            </p>
          </div>
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800">
            <div className="font-semibold text-stone-200">Quadratic vs Linear Penalty</div>
            <p className="text-stone-400 mt-1">
              MSE and RMSE penalize large errors quadratically and are sensitive to anomalies; MAE
              scales linearly and offers robust protection in noisy datasets.
            </p>
          </div>
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800">
            <div className="font-semibold text-stone-200">Model Complexity Control</div>
            <p className="text-stone-400 mt-1">
              Use Adjusted R² when performing feature selection to avoid being fooled by artificial
              R² inflation driven by irrelevant predictors.
            </p>
          </div>
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800">
            <div className="font-semibold text-stone-200">Target Range Compatibility</div>
            <p className="text-stone-400 mt-1">
              Avoid MAPE when target values can approach zero. Use RMSE or MAE normalized by the
              interquartile range for robust scale-independent benchmarking.
            </p>
          </div>
        </div>
      </section>

      {/* 13. Knowledge Check Micro-Quiz */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Knowledge Check Quiz
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Test your understanding of regression metrics and residual assumptions
          </p>
        </div>
        <Quiz conceptId="u3-regression-metrics" items={quizItems} unitAccent={3} />
      </section>

      {/* 14. Next Step Navigation */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-800">
        <div>
          <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
            Previous Concept
          </span>
          <div className="mt-1">
            <Link
              to="/learn/unit-3/feature-engineering"
              className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              ← Feature Engineering Studio
            </Link>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
            Next: Real-World Case Study
          </span>
          <div className="mt-1">
            <Link
              to="/case-studies/real-estate-pricing"
              className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              Case Study: Real-Estate Price Prediction →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
