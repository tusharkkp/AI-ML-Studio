import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { FeatureEngineeringLab } from '@/labs/feature-engineering/FeatureEngineeringLab';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Wrench,
  ShieldAlert,
  Code2,
  HelpCircle,
} from 'lucide-react';

export function FeatureEngineeringPage() {
  const quizItems = [
    {
      id: 'fe-q1',
      question:
        'Why is Min-Max Normalization extremely sensitive to the presence of extreme outliers compared to Robust Scaling or Z-score Standardization?',
      options: [
        {
          id: 'A',
          text: 'Because Min-Max scaling calculates the denominator using the single maximum and minimum points in the dataset (max - min). A single gigantic outlier compresses all legitimate valid data into a microscopic fraction near zero.',
          isCorrect: true,
          explanation:
            'If values range from 1 to 10 and one outlier is 1,000,000, then (10 - 1)/(1,000,000 - 1) approx 0.000009. The entire non-outlier distribution is squashed into an indistinguishable clump near 0. Robust scaling uses the Interquartile Range (middle 50%), rendering it immune to boundary outliers.',
        },
        {
          id: 'B',
          text: 'Because Min-Max normalization requires inverting an O(d^3) matrix.',
          isCorrect: false,
          explanation:
            'Min-Max normalization is an element-wise O(m) linear scaling transformation.',
        },
        {
          id: 'C',
          text: 'Because it can only be performed on negative numbers.',
          isCorrect: false,
          explanation: 'Min-Max normalization works on all real numbers.',
        },
      ],
    },
    {
      id: 'fe-q2',
      question: 'What is Data Leakage in the context of feature preprocessing and scaling?',
      options: [
        {
          id: 'A',
          text: 'Fitting transformers (such as computing mean and standard deviation) on the combined dataset including the test or validation partition, allowing future evaluation information to contaminate training parameter estimates.',
          isCorrect: true,
          explanation:
            'Data leakage occurs when information from outside the training dataset is used to create the model. If scaler.fit() touches test data, test distribution information leaks into the model, generating deceptively low test error estimates that fail in true production.',
        },
        {
          id: 'B',
          text: 'A hacker stealing CSV files from the database server.',
          isCorrect: false,
          explanation: 'This is a cybersecurity breach, not statistical data leakage.',
        },
        {
          id: 'C',
          text: 'When a CSV file contains more than 10,000 rows.',
          isCorrect: false,
          explanation: 'Large datasets do not constitute data leakage.',
        },
      ],
    },
    {
      id: 'fe-q3',
      question:
        'When should you prefer Median Imputation over Mean Imputation for missing numerical values?',
      options: [
        {
          id: 'A',
          text: 'When the feature distribution is heavily skewed or contains extreme outliers, because the median is a robust non-parametric central tendency measure unaffected by extreme values.',
          isCorrect: true,
          explanation:
            'The sample mean is heavily pulled by extreme values (e.g., billionaire income pulling average salary upwards). When data exhibits heavy right-skew, the median reflects the true representative central value far more accurately.',
        },
        {
          id: 'B',
          text: 'Only when all values in the dataset are integers.',
          isCorrect: false,
          explanation: 'Median imputation works equally well on floating-point continuous values.',
        },
        {
          id: 'C',
          text: 'Never, because mean imputation is mathematically required by scikit-learn.',
          isCorrect: false,
          explanation:
            'Scikit-learn SimpleImputer supports mean, median, most_frequent, and constant.',
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
        <span className="text-xs font-mono text-stone-300">Feature Engineering Studio</span>
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
            CO2, CO3
          </Badge>
        </div>
        <h1 className="font-montserrat text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
          Feature Engineering Studio: Cleaning, Scaling &amp; Encoding
        </h1>
        <p className="text-base text-stone-300 leading-relaxed max-w-3xl font-sans">
          &quot;Coming up with features is difficult, time-consuming, and requires expert knowledge.
          Applied machine learning is basically feature engineering.&quot; Before any algorithm can
          converge, raw noisy data must be transformed into{' '}
          <span className="text-amber-100 font-medium">
            well-conditioned numerical representations
          </span>
          .
        </p>
      </div>

      {/* Section 1: Intuition */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          1. Intuition: Garbage In, Garbage Out
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm text-stone-300">
          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-stone-100 flex items-center gap-2">
              <Wrench className="size-4 text-amber-400" />
              The Scale Disparity Trap
            </h3>
            <p>
              Imagine predicting housing prices with two features: Square Footage (ranging from
              1,000 to 5,000) and Number of Bedrooms (ranging from 1 to 5).
            </p>
            <p>
              In Euclidean distance calculations or gradient steps, a change of 10% in square
              footage (300 sq ft) will completely overwhelm and obliterate the signal from bedrooms
              (3 units), simply because its raw numerical magnitude is 1,000 times larger.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/40 space-y-3">
            <h3 className="font-montserrat text-base font-semibold text-stone-100">
              Transforming Reality for the Algorithm
            </h3>
            <p>
              Feature engineering levels the playing field: it scales numbers to common ranges,
              converts human text strings (&quot;Pune&quot;, &quot;Mumbai&quot;) into orthogonal
              binary vectors, and repairs missing observations without distorting variance.
            </p>
            <p>
              A simple linear model trained on superb engineered features routinely outperforms
              complex deep neural networks fed dirty raw data.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Lab */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          2. Interactive Lab: The Data Cleaning &amp; Transformation Studio
        </h2>
        <p className="text-sm text-stone-300 leading-relaxed font-sans">
          Experiment with the dirty student dataset below. Toggle imputation rules, scale modes,
          one-hot encoding, and Tukey IQR outlier capping.
        </p>
        <FeatureEngineeringLab />
      </section>

      {/* Section 3: Mathematical Formalism */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          3. Mathematical Formulations of Scaling Strategies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-2">
            <Badge variant="outline" className="border-blue-400 text-blue-300 font-mono text-xs">
              Z-Score Standardization
            </Badge>
            <div className="p-2.5 rounded bg-stone-950 font-mono text-xs text-stone-200 text-center">
              z = (x - &mu;) / &sigma;
            </div>
            <p className="text-xs text-stone-400 font-sans leading-relaxed">
              Centers data at mean 0 with unit variance 1. Essential for Gradient Descent, PCA, and
              Ridge/Lasso regression. Unbounded range.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-2">
            <Badge
              variant="outline"
              className="border-emerald-400 text-emerald-300 font-mono text-xs"
            >
              Min-Max Normalization
            </Badge>
            <div className="p-2.5 rounded bg-stone-950 font-mono text-xs text-stone-200 text-center">
              x&apos; = (x - x<sub>min</sub>) / (x<sub>max</sub> - x<sub>min</sub>)
            </div>
            <p className="text-xs text-stone-400 font-sans leading-relaxed">
              Compresses data into strict bounded interval [0, 1]. Best when bounded intervals are
              required (e.g., image pixels or neural activation inputs). Vulnerable to outliers.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-2">
            <Badge variant="outline" className="border-amber-400 text-amber-300 font-mono text-xs">
              Robust Scaling (Median &amp; IQR)
            </Badge>
            <div className="p-2.5 rounded bg-stone-950 font-mono text-xs text-stone-200 text-center">
              x&apos; = (x - Q<sub>2</sub>) / (Q<sub>3</sub> - Q<sub>1</sub>)
            </div>
            <p className="text-xs text-stone-400 font-sans leading-relaxed">
              Uses median and Interquartile Range (middle 50% spread). Completely robust against
              extreme outliers and heavy-tailed distributions.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Data Leakage Prevention */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <ShieldAlert className="size-5 text-rose-400" />
          4. Preventing Data Leakage in Preprocessing Pipelines
        </h2>
        <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-3 text-sm text-stone-300 leading-relaxed font-sans">
          <p>
            The most common mistake among engineering students is applying{' '}
            <span className="font-mono text-rose-200">scaler.fit_transform(X)</span> on the entire
            dataset before calling{' '}
            <span className="font-mono text-rose-200">train_test_split()</span>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg border border-rose-800/60 bg-stone-950 text-rose-300 space-y-1">
              <span className="text-rose-400 font-bold block">WRONG (Data Leakage):</span>
              <p>scaler = StandardScaler()</p>
              <p>X_scaled = scaler.fit_transform(X) # Contaminates!</p>
              <p>X_tr, X_te, y_tr, y_te = train_test_split(X_scaled, y)</p>
            </div>
            <div className="p-3 rounded-lg border border-emerald-800/60 bg-stone-950 text-emerald-300 space-y-1">
              <span className="text-emerald-400 font-bold block">CORRECT (Strict Isolation):</span>
              <p>X_tr, X_te, y_tr, y_te = train_test_split(X, y)</p>
              <p>scaler = StandardScaler()</p>
              <p>X_tr_sc = scaler.fit_transform(X_tr) # Fit on Train</p>
              <p>X_te_sc = scaler.transform(X_te) # Transform Test</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Python Reference Implementation */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <Code2 className="size-5 text-amber-400" />
          5. Python Reference: Production Scikit-Learn ColumnTransformer
        </h2>
        <div className="p-4 rounded-xl border border-stone-800 bg-stone-950 font-mono text-xs text-stone-300 overflow-x-auto leading-relaxed">
          <pre>{`from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import Ridge

# Define numerical and categorical feature subsets
numerical_features = ['study_hours', 'attendance_pct', 'income_lakhs']
categorical_features = ['city_tier']

# Numerical Pipeline: Impute median + Standardize
num_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# Categorical Pipeline: Impute mode + One-Hot Encode (drop first to prevent dummy trap)
cat_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(drop='first', sparse_output=False))
])

# Unified Preprocessor
preprocessor = ColumnTransformer(transformers=[
    ('num', num_pipeline, numerical_features),
    ('cat', cat_pipeline, categorical_features)
])

# Full End-to-End Leakage-Proof Model Pipeline
full_model = Pipeline([
    ('prep', preprocessor),
    ('regressor', Ridge(alpha=1.0))
])`}</pre>
        </div>
      </section>

      {/* Section 6: Viva Voce Corner */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <HelpCircle className="size-5 text-amber-400" />
          6. Viva Voce Q&amp;A Corner
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q1: What is the Dummy Variable Trap in One-Hot Encoding?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              <strong>Answer:</strong> When converting a categorical feature with K categories into
              K binary dummy columns, the sum of all dummy columns across any row equals exactly 1.0
              (the bias term). This introduces perfect multicollinearity and causes the Gram matrix
              X<sup>T</sup>X to become singular. To prevent this, always drop one dummy column (use
              K - 1 dummies).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/40 space-y-1.5">
            <h4 className="font-montserrat text-sm font-semibold text-stone-200">
              Q2: What is the difference between Trimming and Winsorizing outliers?
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              <strong>Answer:</strong> Trimming deletes the outlier rows entirely from the dataset,
              which reduces sample size. Winsorizing caps the outlier values at a specified
              statistical fence (e.g., setting any value above Q<sub>3</sub> + 1.5&times;IQR equal
              to the upper fence value), preserving the sample size while neutralizing leverage.
            </p>
          </div>
        </div>
      </section>

      {/* Section 7: Knowledge Check */}
      <section className="space-y-4">
        <h2 className="font-montserrat text-2xl font-semibold text-stone-100">
          7. Knowledge Check
        </h2>
        <Quiz conceptId="u3-feature-engineering" items={quizItems} unitAccent={3} />
      </section>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between border-t border-stone-800 pt-6">
        <Link
          to="/learn/unit-3/locally-weighted-regression"
          className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-200 font-mono transition-colors"
        >
          <ArrowLeft className="size-4" />
          Previous: Locally Weighted Regression
        </Link>
        <Link
          to="/learn/unit-3/regression-metrics"
          className="inline-flex items-center gap-2 text-sm bg-stone-100 text-stone-950 hover:bg-stone-200 font-semibold px-4 py-2 rounded-lg rounded-br-none transition-colors"
        >
          Next: Regression Evaluation Metrics &amp; Diagnostics
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
          1. Kuhn, Max, and Kjell Johnson.{' '}
          <em>Feature Engineering and Selection: A Practical Approach for Predictive Models</em>.
          CRC Press, 2019.
        </p>
        <p>
          2. Tukey, John W. <em>Exploratory Data Analysis</em>. Addison-Wesley, 1977.
        </p>
      </div>
    </div>
  );
}
