import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Quiz } from '@/features/quiz/Quiz';
import { useProgressStore } from '@/features/progress/useProgressStore';
import { DiabetesPredictionLab } from '@/labs/diabetes-prediction/DiabetesPredictionLab';
import {
  HeartPulse,
  Activity,
  AlertTriangle,
  HelpCircle,
  Award,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';

export const DiabetesPredictionCaseStudyPage: React.FC = () => {
  const [copiedPython, setCopiedPython] = useState(false);
  const getConceptProgress = useProgressStore((state) => state.getConceptProgress);
  const progress = getConceptProgress('u5-case-diabetes');
  const isCompleted = Boolean(progress?.labCompleted || progress?.read);

  const pythonSnippet = `import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

# 1. Load Pima Indians Diabetes Dataset
# Features: Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DPF, Age
url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv"
columns = ['pregnancies', 'glucose', 'bp', 'skin', 'insulin', 'bmi', 'dpf', 'age', 'outcome']
df = pd.read_csv(url, names=columns)

# 2. Critical Clinical Preprocessing: Handle Biologically Impossible Zeros
zero_fields = ['glucose', 'bp', 'skin', 'insulin', 'bmi']
for field in zero_fields:
    # Replace zero with NaN so imputation can isolate genuine observations
    df[field] = df[field].replace(0, np.nan)
    # Class-aware median imputation preserves diagnostic cluster boundaries
    df[field] = df.groupby('outcome')[field].transform(lambda x: x.fillna(x.median()))

# 3. Train-Test Split with Stratification
X = df.drop('outcome', axis=1)
y = df['outcome']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

# 4. Compare Decision Tree vs Random Forest vs Support Vector Machine
models = {
    "Pruned Decision Tree (depth=3)": DecisionTreeClassifier(max_depth=3, random_state=42),
    "Random Forest (n=100)": RandomForestClassifier(n_estimators=100, max_features='sqrt', random_state=42),
    "RBF Support Vector Machine": SVC(kernel='rbf', probability=True, C=1.0, random_state=42)
}

print("=== PIMA CLINICAL BENCHMARK ===")
for name, clf in models.items():
    clf.fit(X_train, y_train)
    probs = clf.predict_proba(X_test)[:, 1]
    
    # Cost-sensitive screening threshold: tau* = 0.35 (prioritize recall)
    preds = (probs >= 0.35).astype(int)
    
    cm = confusion_matrix(y_test, preds)
    sens = cm[1, 1] / (cm[1, 1] + cm[1, 0])  # Recall / Sensitivity
    spec = cm[0, 0] / (cm[0, 0] + cm[0, 1])  # Specificity
    auc = roc_auc_score(y_test, probs)
    print(f"{name:32s} | AUC: {auc:.3f} | Sensitivity: {sens*100:.1f}% | Specificity: {spec*100:.1f}%")
`;

  const copyCode = () => {
    void navigator.clipboard.writeText(pythonSnippet);
    setCopiedPython(true);
    setTimeout(() => setCopiedPython(false), 2000);
  };

  const quizItems = [
    {
      id: 'pima-q1',
      question:
        'In the Pima Indians Diabetes dataset, why is treating zero values in Glucose, Insulin, and Blood Pressure as numeric zero a severe modeling error?',
      options: [
        {
          id: 'A',
          text: 'Because zero values represent missing clinical tests rather than physiological reality: a living patient cannot possess zero fasting blood glucose or blood pressure.',
          isCorrect: true,
          explanation:
            'A blood glucose or diastolic blood pressure of zero is physiologically incompatible with life. These zeros represent missing laboratory assays that must be imputed rather than ingested literally.',
        },
        {
          id: 'B',
          text: 'Because Python sklearn estimators throw an immediate exception when encountering zero in tabular data.',
          isCorrect: false,
          explanation:
            'Scikit-learn algorithms handle numeric zeros without throwing syntax or execution exceptions, but the mathematical models produce invalid predictions.',
        },
        {
          id: 'C',
          text: 'Because decision trees only accept strictly positive floating point values.',
          isCorrect: false,
          explanation:
            'Decision trees can split on any real number, including negative values and zeros.',
        },
      ],
    },
    {
      id: 'pima-q2',
      question:
        'When deploying a diabetes risk screening model in a public health clinic, why should the decision threshold τ be shifted from 0.50 down to approximately 0.30?',
      options: [
        {
          id: 'A',
          text: 'Because the clinical cost of a False Negative (undiagnosed diabetes leading to neuropathy or renal failure) is far higher than a False Positive (a confirmatory blood test costing $50).',
          isCorrect: true,
          explanation:
            'Under Bayes decision theory, asymmetric error costs shift the threshold down to c_FP / (c_FP + c_FN). Setting tau = 0.30 dramatically elevates sensitivity, catching nearly all sick patients early.',
        },
        {
          id: 'B',
          text: 'Because the dataset has exactly 30% diabetes prevalence.',
          isCorrect: false,
          explanation:
            'Prevalence influences class balance, but the threshold decision is governed by asymmetric utility and risk costs.',
        },
        {
          id: 'C',
          text: 'Because lowering the threshold guarantees 100% specificity.',
          isCorrect: false,
          explanation:
            'Lowering the threshold increases sensitivity at the expense of lowering specificity and causing more false alarms.',
        },
      ],
    },
    {
      id: 'pima-q3',
      question:
        'Why does a Random Forest typically outperform a single deep Decision Tree on the Pima Indians clinical dataset?',
      options: [
        {
          id: 'A',
          text: 'Because deep single decision trees overfit to noisy clinical outliers and non-linear interactions, whereas Random Forests average many decorrelated trees, substantially decreasing variance.',
          isCorrect: true,
          explanation:
            'Clinical tabular datasets feature measurement noise and high individual variance. Random Forests use bootstrap aggregation and random subspace sampling to reduce variance without inflating bias.',
        },
        {
          id: 'B',
          text: 'Because Random Forests do not require data splitting or feature normalization.',
          isCorrect: false,
          explanation:
            'Random Forests still split data into training and validation sets; their superiority stems from ensemble variance reduction.',
        },
        {
          id: 'C',
          text: 'Because single decision trees cannot handle binary classification labels.',
          isCorrect: false,
          explanation:
            'Single decision trees handle binary classification natively using Gini or Entropy.',
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:px-12 space-y-12">
      {/* 1. Hero Header & Syllabus Mapping */}
      <div className="border-b border-orange-50/15 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-mono text-neutral-400"
          >
            <Link to="/learn/unit-5" className="hover:text-brand transition-colors">
              Unit 5: Linear & Decision Models
            </Link>
            <span>/</span>
            <span className="text-foreground dark:text-neutral-200">
              Case Study: Diabetes Prediction
            </span>
          </nav>
          {isCompleted && (
            <Badge variant="success" size="sm">
              Completed
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="unit">Unit 5 Case Study</Badge>
          <Badge variant="outline">0.5 Hour Lab</Badge>
          <Badge variant="outline">Course Outcome: CO3, CO4</Badge>
          <Badge variant="outline">Clinical Tabular Pipeline</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground font-manrope">
          Case study: Pima Indians diabetes prediction
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-montserrat leading-relaxed max-w-3xl">
          Construct an end-to-end clinical machine learning diagnostic pipeline on the historical
          Pima Indians Diabetes dataset, addressing{' '}
          <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
            biological zero-imputation anomalies and asymmetric cost screening
          </span>
          .
        </p>
      </div>

      {/* 2. Intuition */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-red-400" />
          1. Clinical intuition: The anatomy of medical classification
        </h2>
        <div className="text-sm text-neutral-600 dark:text-neutral-300 font-montserrat leading-relaxed space-y-3">
          <p>
            The Pima Indians of Arizona have experienced disproportionately high rates of type 2
            diabetes, prompting the National Institute of Diabetes and Digestive and Kidney Diseases
            (NIDDK) to compile the landmark Pima dataset. Unlike toy synthetic benchmarks, clinical
            datasets present two fundamental challenges: biological missingness disguised as zeroes,
            and asymmetric error consequences.
          </p>
          <p>
            When a hospital laboratory fails to record fasting serum insulin or skin-fold thickness,
            field nurses frequently input a numeric zero. In a machine learning pipeline, treating a
            fasting blood glucose or blood pressure of zero as literal biology distorts decision
            hyperplanes because{' '}
            <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
              a living human cannot survive with zero circulatory glucose
            </span>
            . Effective clinical modeling demands class-aware imputation followed by cost-sensitive
            threshold selection that strongly penalizes missed diagnoses.
          </p>
        </div>
      </section>

      {/* 3. Interactive Lab */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand" />
            2. Interactive lab: Clinical diagnostic workbench
          </h2>
          <Badge variant="outline" size="sm">
            Live Simulation
          </Badge>
        </div>
        <p className="text-xs text-neutral-400 font-montserrat">
          Experiment with imputation techniques, test Decision Trees vs Random Forests vs SVMs, and
          adjust the clinical cutoff threshold to minimize patient mortality expense.
        </p>
        <DiabetesPredictionLab />
      </section>

      {/* 4. Step-by-Step on Paper */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
          3. Step-by-step on paper: Imputation & screening math
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-montserrat">
          <Card className="p-4 border-orange-50/15 bg-neutral-900/40 space-y-2">
            <div className="font-bold font-manrope text-sm text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand/20 text-brand flex items-center justify-center font-mono">
                1
              </span>
              Detect Biologically Impossible 0
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Scan clinical columns: Glucose, Diastolic BP, Triceps SkinThickness, Serum Insulin,
              and BMI. Convert all values where <code className="text-cream font-mono">x == 0</code>{' '}
              into <code className="text-cream font-mono">NaN</code>.
            </p>
          </Card>

          <Card className="p-4 border-orange-50/15 bg-neutral-900/40 space-y-2">
            <div className="font-bold font-manrope text-sm text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand/20 text-brand flex items-center justify-center font-mono">
                2
              </span>
              Stratified Median Imputation
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Group by diagnosis label <code className="text-cream font-mono">y ∈ {'{0, 1}'}</code>.
              For diabetic cohort, impute missing insulin with median diabetic insulin (≈ 140 μU/mL)
              rather than global cohort average.
            </p>
          </Card>

          <Card className="p-4 border-orange-50/15 bg-neutral-900/40 space-y-2">
            <div className="font-bold font-manrope text-sm text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand/20 text-brand flex items-center justify-center font-mono">
                3
              </span>
              Cost-Sensitive Cutoff (τ*)
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Calculate expected loss:{' '}
              <code className="text-cream font-mono">L = c_FN · FN + c_FP · FP</code>. Set threshold
              <code className="text-cream font-mono">
                τ* = c_FP / (c_FP + c_FN) = 50 / (50 + 500) ≈ 0.091
              </code>{' '}
              to maximize sensitivity.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. Formal Mathematical Foundations */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
          4. Formal mathematical foundations
        </h2>
        <div className="p-5 rounded-xl border border-orange-50/15 bg-neutral-900/50 space-y-4 text-xs font-montserrat leading-relaxed">
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-1">
              1. Bayes Decision Rule with Asymmetric Clinical Losses
            </h4>
            <p className="text-neutral-300">
              Let {'\\(\\lambda_{10}\\)'} denote the penalty of a False Negative (missing diabetes),
              and {'\\(\\lambda_{01}\\)'} denote the penalty of a False Positive (false alarm). An
              observation {'\\(\\mathbf{x}\\)'} is assigned to the diabetic class ({'\\(y=1\\)'}) if
              and only if:
            </p>
            <div className="p-2.5 rounded-lg bg-black/40 font-mono text-center text-cream my-2">
              {
                '$$P(y=1 \\mid \\mathbf{x}) \\cdot \\lambda_{10} > P(y=0 \\mid \\mathbf{x}) \\cdot \\lambda_{01}$$'
              }
            </div>
            <p className="text-neutral-300">
              Since {'\\(P(y=0 \\mid \\mathbf{x}) = 1 - P(y=1 \\mid \\mathbf{x})\\)'}, rearranging
              terms yields the optimal Bayes decision boundary:
            </p>
            <div className="p-2.5 rounded-lg bg-black/40 font-mono text-center text-cream my-2">
              {'$$\\tau^* = \\frac{\\lambda_{01}}{\\lambda_{01} + \\lambda_{10}}$$'}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground mb-1">
              2. Random Forest Variance Reduction on Clinical Variance
            </h4>
            <p className="text-neutral-300">
              A single deep decision tree has low bias but very high variance {'\\(\\sigma^2\\)'}.
              Averaging {'\\(B\\)'} bootstrap trees, each with pairwise correlation {'\\(\\rho\\)'},
              yields ensemble variance:
            </p>
            <div className="p-2.5 rounded-lg bg-black/40 font-mono text-center text-cream my-2">
              {'$$\\text{Var}(\\bar{f}) = \\rho \\sigma^2 + \\frac{1 - \\rho}{B} \\sigma^2$$'}
            </div>
            <p className="text-neutral-300">
              Random feature subsampling ({'\\(m = \\lfloor\\sqrt{d}\\rfloor\\)'}) forces individual
              trees to split on different biomarkers, substantially depressing {'\\(\\rho\\)'} and
              producing stable, generalized risk boundaries.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Algorithm Pseudocode */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
          5. Algorithm pseudocode: Clinical diagnostic pipeline
        </h2>
        <Card className="p-5 border-orange-50/15 bg-black/30 font-mono text-xs leading-relaxed overflow-x-auto text-neutral-300">
          <pre>{`ALGORITHM PimaClinicalPipeline(Dataset D, TargetLabel y, Costs c_FN, c_FP):
  1. For each clinical biomarker feature f in ['glucose', 'bp', 'skin', 'insulin', 'bmi']:
       For each patient i in D:
         If D[i, f] == 0:
           D[i, f] <- NaN
           
  2. For each class c in {0, 1}:
       cohort_c <- subset of D where y == c
       For each feature f:
         median_val <- Median(cohort_c[f] without NaN)
         Replace NaN in cohort_c[f] with median_val

  3. Split D into Train (80%) and Test (20%) using StratifiedKFold
  
  4. Standardize numerical features using StandardScaler on Train:
       mu <- Mean(Train), sigma <- StdDev(Train)
       X_train_norm <- (Train - mu) / sigma
       X_test_norm  <- (Test - mu) / sigma

  5. Train Random Forest Ensemble with B=100 trees, m=sqrt(8)=2 features per split
  
  6. Compute clinical decision threshold:
       tau_star <- c_FP / (c_FP + c_FN)
       
  7. For each test sample x_test:
       p_diabetic <- Forest.PredictProbability(x_test)
       prediction <- 1 IF p_diabetic >= tau_star ELSE 0
       
  8. Return ConfusionMatrix, Sensitivity (Recall), Specificity, and TotalCost`}</pre>
        </Card>
      </section>

      {/* 7. Code It in Python */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
            6. Code it in Python: Production scikit-learn pipeline
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={copyCode}
            className="flex items-center gap-1.5 text-xs"
          >
            {copiedPython ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Code
              </>
            )}
          </Button>
        </div>
        <Card className="p-5 border-orange-50/15 bg-black/40 font-mono text-xs leading-relaxed overflow-x-auto text-neutral-300">
          <pre>{pythonSnippet}</pre>
        </Card>
      </section>

      {/* 8. Make It Fail */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          7. Make it fail: Clinical pathological traps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-montserrat">
          <Card className="p-4 border-yellow-500/20 bg-yellow-950/10 space-y-2">
            <h4 className="font-bold text-yellow-400 font-manrope text-sm">
              Trap 1: Literal Zero Ingestion
            </h4>
            <p className="text-neutral-300 leading-relaxed">
              Passing raw zeros into an SVM or Linear Classifier causes the algorithm to treat
              low-glucose zeros as strong indicators of severe hypoglycemia or health, creating
              completely inverted hyperplanes that misclassify insulin-deficient diabetics.
            </p>
          </Card>

          <Card className="p-4 border-yellow-500/20 bg-yellow-950/10 space-y-2">
            <h4 className="font-bold text-yellow-400 font-manrope text-sm">
              Trap 2: Symmetric Threshold (τ = 0.50) Blindness
            </h4>
            <p className="text-neutral-300 leading-relaxed">
              Evaluating at standard 0.50 probability cutoff produces high accuracy (78%) but misses
              over 35% of diabetic patients. In clinical deployment, an undetected diabetic
              experiences organ damage costing orders of magnitude more than a confirmatory glucose
              test.
            </p>
          </Card>
        </div>
      </section>

      {/* 9. Strengths, Limitations & When NOT to Use */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
          8. Strengths, limitations & when NOT to use
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-montserrat">
          <Card className="p-4 border-emerald-500/20 bg-emerald-950/10 space-y-2">
            <h4 className="font-bold text-emerald-400 font-manrope text-sm">
              Key Strengths of Random Forest on Pima
            </h4>
            <ul className="list-disc list-inside space-y-1 text-neutral-300">
              <li>Handles non-linear biological interactions (e.g. Glucose × Age) naturally.</li>
              <li>Robust to outliers and invariant to monotonic feature scaling.</li>
              <li>Out-of-Bag (OOB) error provides free cross-validation estimate.</li>
              <li>
                Delivers feature importances identifying Glucose and BMI as primary risk factors.
              </li>
            </ul>
          </Card>

          <Card className="p-4 border-red-500/20 bg-red-950/10 space-y-2">
            <h4 className="font-bold text-red-400 font-manrope text-sm">
              Clinical Limitations & When NOT to Use
            </h4>
            <ul className="list-disc list-inside space-y-1 text-neutral-300">
              <li>Lacks strict interpretability compared to single shallow decision rules.</li>
              <li>Cannot extrapolate beyond the empirical boundary of training bio-markers.</li>
              <li>
                Do not use for primary diagnosis without secondary laboratory HbA1c validation.
              </li>
              <li>
                Pima-trained weights do not generalize cleanly to non-Pima ethnic demographic
                groups.
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 10. Common Misconceptions */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
          9. Common misconceptions
        </h2>
        <div className="space-y-3 text-xs font-montserrat">
          {[
            {
              myth: 'Dropping all rows containing zero is the cleanest way to clean the Pima dataset.',
              fact: 'Insulin has 374 missing values (nearly 50% of the entire 768 dataset). Dropping zero rows discards half the sample size, drastically reducing statistical power and introducing severe survivor bias.',
            },
            {
              myth: 'A high ROC-AUC score guarantees that the model is ready for bedside clinical triage.',
              fact: 'ROC-AUC evaluates all possible thresholds simultaneously. A model can have an AUC of 0.84 but still be disastrous if deployed at tau = 0.5 where clinical sensitivity is unacceptable.',
            },
            {
              myth: 'StandardScaler must be applied to Decision Trees and Random Forests.',
              fact: 'Tree splits rely solely on feature order rank, not distance magnitude. Scaling features by mean and variance produces mathematically identical tree structures.',
            },
          ].map((item, idx) => (
            <Card key={idx} className="p-4 border-orange-50/10 bg-neutral-900/40 space-y-1">
              <div className="font-bold text-red-400 font-manrope text-sm">Myth: "{item.myth}"</div>
              <div className="text-neutral-300 leading-relaxed">
                <span className="text-emerald-400 font-semibold">Reality:</span> {item.fact}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 11. Check Yourself (Micro-Quiz) */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand" />
          10. Check yourself: Clinical engineering micro-quiz
        </h2>
        <Quiz items={quizItems} conceptId="u5-case-diabetes" />
      </section>

      {/* 12. Exam & Viva Corner */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          11. Exam & viva corner
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-montserrat">
          <Card className="p-4 border-orange-50/15 bg-neutral-900/40 space-y-2">
            <h4 className="font-bold text-foreground font-manrope text-sm">
              Viva Question 1: How do you justify class-aware imputation?
            </h4>
            <p className="text-neutral-400 leading-relaxed">
              "Imputing missing insulin with the global cohort median shifts diabetic patients
              downward toward healthy levels and healthy patients upward. Computing separate medians
              conditioned on the outcome label preserves the empirical biological gap between the
              two physiological states."
            </p>
          </Card>

          <Card className="p-4 border-orange-50/15 bg-neutral-900/40 space-y-2">
            <h4 className="font-bold text-foreground font-manrope text-sm">
              Viva Question 2: Why choose Sensitivity over Specificity here?
            </h4>
            <p className="text-neutral-400 leading-relaxed">
              "In clinical screening, Type II error (False Negative) results in untreated chronic
              disease progression and organ damage. Type I error (False Positive) only triggers a
              cheap secondary blood test. Hence, medical protocols maximize sensitivity (recall) at
              the expense of specificity."
            </p>
          </Card>
        </div>
      </section>

      {/* 13. Summary & Key Takeaways */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground font-manrope">
          12. Summary & key takeaways
        </h2>
        <Card className="p-5 border-orange-50/15 bg-black/20 space-y-2 text-xs font-montserrat text-neutral-300 leading-relaxed">
          <p>
            1. <strong className="text-foreground">Biological Data Cleaning:</strong> Zeroes in
            physiological variables (Insulin, Glucose, BMI) indicate missing clinical assays;
            discarding them cuts data in half, while median imputation preserves sample volume.
          </p>
          <p>
            2. <strong className="text-foreground">Ensemble Robustness:</strong> Random Forest
            achieves higher test stability than individual Decision Trees because bootstrap feature
            sampling decorrelates trees and dramatically cuts variance on noisy clinical data.
          </p>
          <p>
            3. <strong className="text-foreground">Cost-Sensitive Decision Boundaries:</strong>{' '}
            Clinical models must tune decision threshold {'\\(\\tau\\)'} using Bayes cost risk
            rather than arbitrary 0.50 cutoff, prioritizing Sensitivity to save patient lives.
          </p>
        </Card>
      </section>

      {/* 14. What's Next */}
      <section className="border-t border-orange-50/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs text-neutral-400 font-mono">Next Self-Study Concept</div>
          <div className="text-base font-semibold text-foreground font-manrope">
            Self-Study: AdaBoost Algorithm Mechanics
          </div>
        </div>
        <Link to="/learn/unit-5/adaboost">
          <Button variant="primary" className="flex items-center gap-2 text-xs">
            Continue to AdaBoost Mechanics
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
};
