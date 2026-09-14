import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Quiz } from '@/features/quiz/Quiz';
import { HealthcareRegressionLab } from '@/labs/case-study-healthcare/HealthcareRegressionLab';

export const HealthcareCaseStudyPage: React.FC = () => {
  const quizItems = [
    {
      id: 'hc-q1',
      question:
        'In medical insurance underwriting datasets, why does an additive linear regression model fail to accurately predict charges for obese smokers?',
      options: [
        {
          id: 'A',
          text: 'Because smoking and high BMI exhibit a powerful multiplicative clinical interaction: obesity compounds cardiovascular and pulmonary damage in smokers, producing an exponential cost surge that purely additive terms cannot fit.',
          isCorrect: true,
          explanation:
            'When two risk factors interact synergistically, the combined clinical consequence is far greater than the sum of their isolated risks. An interaction term (BMI * Smoker) is required to allow the slope of BMI to increase dramatically for smokers.',
        },
        {
          id: 'B',
          text: 'Because medical expenses can only be modeled using deep neural networks with at least 50 layers.',
          isCorrect: false,
          explanation: 'Linear models with interaction terms model medical charges effectively.',
        },
        {
          id: 'C',
          text: 'Because BMI is a qualitative ordinal feature that cannot be multiplied.',
          isCorrect: false,
          explanation: 'BMI is a continuous real-valued metric (kg/m²).',
        },
      ],
    },
    {
      id: 'hc-q2',
      question:
        'Why do healthcare regression models commonly apply a log transform log(1 + y) to medical expenditure targets?',
      options: [
        {
          id: 'A',
          text: 'Healthcare expenditure is heavily right-skewed with long tails: 80% of healthy patients incur minimal costs while 5% of chronic patients incur catastrophic hospital bills, violating normality and homoscedasticity assumptions.',
          isCorrect: true,
          explanation:
            'Medical spending follows a heavy-tailed Pareto-like distribution. Log transformation compresses the extreme high-cost outliers, stabilizes error variance across expenditure tiers, and prevents high-cost patients from dominating ordinary least squares loss.',
        },
        {
          id: 'B',
          text: 'Because health insurance regulations forbid floating point numbers.',
          isCorrect: false,
          explanation: 'Financial actuaries work extensively with floating point percentages.',
        },
        {
          id: 'C',
          text: 'To convert annual insurance premiums from dollars into euros.',
          isCorrect: false,
          explanation: 'Currency conversion is a scalar multiplication, not a log transform.',
        },
      ],
    },
    {
      id: 'hc-q3',
      question:
        'Under privacy laws such as HIPAA and India DPDP Act 2023, what is a primary legal requirement when handling patient health records for machine learning training?',
      options: [
        {
          id: 'A',
          text: 'Strict de-identification removing 18 direct personal identifiers (names, exact birthdates, phone numbers, Aadhaar/SSN), purpose limitation, and cryptographically secure differential privacy or access controls.',
          isCorrect: true,
          explanation:
            'Both HIPAA Safe Harbor and the Indian DPDP Act mandate that protected health information (PHI) cannot be used for algorithmic development without explicit purpose limitation, encryption in transit and at rest, and de-identification.',
        },
        {
          id: 'B',
          text: 'Publishing the entire patient database on a public GitHub repository.',
          isCorrect: false,
          explanation: 'This is a catastrophic criminal privacy violation.',
        },
        {
          id: 'C',
          text: 'Deleting all training labels so that models only run unsupervised clustering.',
          isCorrect: false,
          explanation: 'Supervised learning on sanitized records is standard legal practice.',
        },
      ],
    },
    {
      id: 'hc-q4',
      question:
        'What is the ethical distinction between Actuarial Fairness and Healthcare Social Equity?',
      options: [
        {
          id: 'A',
          text: 'Actuarial fairness charges each individual according to their exact predicted statistical risk, whereas social equity pools collective risk so that sick or genetically predisposed individuals are not priced out of vital healthcare.',
          isCorrect: true,
          explanation:
            'Pure actuarial pricing would charge individuals with cancer genes or unchosen chronic conditions exorbitant premiums, rendering care unaffordable. Regulations like the ACA and national health mandates enforce risk pooling to protect vulnerable populations.',
        },
        {
          id: 'B',
          text: 'Actuarial fairness applies to private hospitals, while social equity applies to dentist clinics.',
          isCorrect: false,
          explanation: 'These are philosophical principles of health policy, not clinic divisions.',
        },
        {
          id: 'C',
          text: 'Actuarial fairness requires using Ridge regression, while social equity uses Lasso.',
          isCorrect: false,
          explanation: 'Regression penalties do not determine policy ethics.',
        },
      ],
    },
    {
      id: 'hc-q5',
      question:
        'In Scikit-Learn, how can you generate only interaction terms between pairs of features without creating squared polynomial terms?',
      options: [
        {
          id: 'A',
          text: 'PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)',
          isCorrect: true,
          explanation:
            'Setting interaction_only=True generates product terms like x1 * x2 while suppressing self-squared terms like x1^2, precisely capturing cross-variable interactions without runaway polynomial degree inflation.',
        },
        {
          id: 'B',
          text: 'LinearRegression(interaction=True)',
          isCorrect: false,
          explanation: 'LinearRegression does not contain an interaction parameter.',
        },
        {
          id: 'C',
          text: 'StandardScaler(with_mean=False)',
          isCorrect: false,
          explanation:
            'StandardScaler scales distributions; it does not produce interaction terms.',
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
            Unit 3: Case Study 2
          </Badge>
          <Badge variant="outline" className="border-stone-800 text-stone-400">
            0.5 Hours • CO2, CO4
          </Badge>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
          Case Study: Healthcare Medical Cost Regression & Actuarial Risk
        </h1>
        <p className="text-base text-stone-400 max-w-3xl leading-relaxed">
          Accurate health insurance premium underwriting requires forecasting individual annual
          claims expenditure. Standard linear models fail because clinical risk factors interact
          multiplicatively:{' '}
          <span className="font-medium text-stone-200">
            the synergistic compound effect of tobacco smoking combined with clinical obesity
          </span>{' '}
          triggers an exponential non-linear surge in hospitalization costs.
        </p>
      </section>

      {/* 2. Clinical Actuarial Formulation */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Problem Formulation & Actuarial Underwriting Context
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Balancing insurance risk pool solvency against patient accessibility and ethical risk
            pooling
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-medium text-amber-400">1. Actuarial Pool Solvency</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              If an insurer systematically underprices high-risk chronic patient claims, medical
              loss ratios exceed 100%, driving the health insurer toward insolvency.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-medium text-amber-400">2. Adverse Selection</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Conversely, if healthy individuals are overcharged, they opt out of voluntary
              coverage, leaving a progressively sicker insurance pool that drives premiums higher.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-medium text-amber-400">3. Predictive Precision</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Modern insurers deploy regression pipelines to segment actuarial cohorts into
              Standard, Preferred, and Sub-Standard tiers based on empirical clinical telemetry.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Feature Architecture & Preprocessing */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Feature Architecture & Epidemiological Interactions
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Clinical metrics, behavioral risk factors, and categorical household structures
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <Card className="border-stone-800 bg-stone-950/60">
            <CardHeader className="pb-2">
              <h3 className="font-display text-sm font-semibold text-stone-200">
                Core Clinical Features
              </h3>
            </CardHeader>
            <CardContent className="space-y-2 text-stone-300">
              <div className="flex justify-between border-b border-stone-800/60 pb-1.5">
                <span>Patient Age:</span>
                <span className="text-amber-400">18 to 65 Years (Gradual biological baseline)</span>
              </div>
              <div className="flex justify-between border-b border-stone-800/60 pb-1.5">
                <span>Body Mass Index (BMI):</span>
                <span className="text-amber-400">
                  15.0 to 45.0 kg/m² (WHO clinical obesity ≥ 30)
                </span>
              </div>
              <div className="flex justify-between border-b border-stone-800/60 pb-1.5">
                <span>Smoking Status:</span>
                <span className="text-red-400">Binary indicator (0 = Non-Smoker, 1 = Smoker)</span>
              </div>
              <div className="flex justify-between">
                <span>Number of Dependents:</span>
                <span className="text-amber-400">0 to 5 Children/Dependents</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-800 bg-stone-950/60">
            <CardHeader className="pb-2">
              <h3 className="font-display text-sm font-semibold text-stone-200">
                Synergistic Interaction Terms
              </h3>
            </CardHeader>
            <CardContent className="space-y-2 text-stone-300">
              <div className="flex justify-between border-b border-stone-800/60 pb-1.5">
                <span>BMI × Smoker Interaction:</span>
                <span className="text-emerald-400">Multiplicative risk multiplier</span>
              </div>
              <div className="flex justify-between border-b border-stone-800/60 pb-1.5">
                <span>Obesity Binary Gate:</span>
                <span className="text-emerald-400">I(BMI ≥ 30) piecewise threshold step</span>
              </div>
              <div className="flex justify-between border-b border-stone-800/60 pb-1.5">
                <span>Target Charges y:</span>
                <span className="text-emerald-400">
                  log(1 + Charges) to handle extreme outliers
                </span>
              </div>
              <div className="flex justify-between">
                <span>Loss Metric:</span>
                <span className="text-emerald-400">MAE for median risk + RMSE for tail events</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. Interactive Clinical Studio */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Interactive Healthcare Cost & Risk Studio
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Simulate patient risk profiles and observe the non-linear inflection in medical cost
            response surfaces
          </p>
        </div>
        <HealthcareRegressionLab />
      </section>

      {/* 5. Mathematical Formulation */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Mathematical Formulation: Additive vs Synergistic Models
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            How interaction terms model compound cardiovascular and pulmonary morbidity
          </p>
        </div>
        <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-3 text-sm text-stone-300">
          <p className="leading-relaxed">
            In an additive linear model, the effect of BMI on expenditure is constant regardless of
            smoking status:
          </p>
          <div className="p-3 bg-stone-950 rounded font-mono text-xs text-amber-300">
            Charges = θ₀ + θ₁·Age + θ₂·BMI + θ₃·Smoker + θ₄·Dependents
          </div>
          <p className="leading-relaxed">
            Taking the partial derivative with respect to BMI yields ∂Charges/∂BMI = θ₂, asserting
            that gaining 1 unit of BMI costs the exact same dollar amount for an athlete as for a
            chronic smoker. Introducing the{' '}
            <span className="font-medium text-stone-200">interaction term BMI × Smoker</span> alters
            the partial derivative:
          </p>
          <div className="p-3 bg-stone-950 rounded font-mono text-xs text-emerald-400">
            Charges = θ₀ + θ₁·Age + θ₂·BMI + θ₃·Smoker + θ₄·(BMI × Smoker) + θ₅·Dependents
            <br />⟹ ∂Charges/∂BMI = θ₂ + θ₄·Smoker
          </div>
          <p className="leading-relaxed text-xs text-stone-400">
            For non-smokers (Smoker = 0), the marginal cost per BMI unit is θ₂ ($140/yr). For
            smokers (Smoker = 1), the marginal cost surges to θ₂ + θ₄ ($540/yr), accurately fitting
            the empirical medical data.
          </p>
        </div>
      </section>

      {/* 6. Data Preprocessing & Skewness Treatment */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Skewness Treatment & Zero-Inflated Distributions
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Overcoming right-skewed Pareto distributions in hospital billing records
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-semibold text-stone-200">Log-Transformed Regression Target</h4>
            <p className="text-stone-400 leading-relaxed">
              Over 70% of healthy insured individuals generate annual claims under $3,000, while a
              tiny fraction undergoing intensive ICU care generate claims exceeding $60,000. Fitting
              raw OLS directly to unadjusted claims produces{' '}
              <span className="font-medium text-stone-200">massive heteroscedasticity</span> and
              negative price predictions for young healthy adults.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-semibold text-stone-200">Two-Part Hurdle Models</h4>
            <p className="text-stone-400 leading-relaxed">
              In advanced health economics, actuaries use a two-part model: Part 1 uses logistic
              regression to predict probability of incurring any medical claim P(y &gt; 0); Part 2
              uses linear regression on log(y) conditional on y &gt; 0.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Production Python & Scikit-Learn Pipeline */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Production Python & Scikit-Learn Pipeline
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Constructing interaction features using PolynomialFeatures with interaction_only=True
          </p>
        </div>
        <div className="p-4 rounded-lg border border-stone-800 bg-stone-950 font-mono text-xs text-stone-300 overflow-x-auto">
          <pre>{`import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.pipeline import Pipeline
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error, r2_score

# 1. Feature matrix: ['age', 'bmi', 'smoker', 'dependents']
def build_healthcare_model():
    pipeline = Pipeline([
        # Generate pairwise interaction terms: BMI * smoker, age * smoker
        ('interactions', PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)),
        ('scaler', StandardScaler()),
        ('regressor', Ridge(alpha=5.0))
    ])
    return pipeline

# 2. Simulated inference function
# X_train, y_train = load_medical_charges_data()
# model = build_healthcare_model()
# model.fit(X_train, np.log(y_train))

def predict_patient_charges(age: int, bmi: float, is_smoker: bool, dependents: int) -> dict:
    sample = np.array([[age, bmi, 1 if is_smoker else 0, dependents]])
    # Example manual closed-form inference
    base_charge = 2500 + 250 * age + 140 * max(0, bmi - 18.5) + (12000 if is_smoker else 0) + 450 * dependents
    if is_smoker and bmi >= 30:
        base_charge += 18500 + 400 * (bmi - 30)
    
    return {
        "estimated_annual_charges": round(base_charge, 2),
        "risk_tier": "High Risk" if is_smoker and bmi >= 30 else "Moderate" if is_smoker else "Standard"
    }`}</pre>
        </div>
      </section>

      {/* 8. Model Benchmark Audit */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Model Benchmark & Residual Audit
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Demonstrating why interaction terms are essential for clinical risk modeling
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-stone-800 rounded font-mono">
            <thead className="bg-stone-900 text-stone-300">
              <tr>
                <th className="p-3 border-b border-stone-800">Model Architecture</th>
                <th className="p-3 border-b border-stone-800">Interaction Terms</th>
                <th className="p-3 border-b border-stone-800">Test R²</th>
                <th className="p-3 border-b border-stone-800">Test MAE</th>
                <th className="p-3 border-b border-stone-800">Obese Smoker Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              <tr>
                <td className="p-3 font-semibold text-stone-300">Standard Additive OLS</td>
                <td className="p-3">None (Linear Only)</td>
                <td className="p-3 text-amber-400">0.748</td>
                <td className="p-3 text-stone-400">$4,180</td>
                <td className="p-3 text-red-400">-$11,200 (Underestimate)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-emerald-400">Interaction Ridge</td>
                <td className="p-3">BMI × Smoker</td>
                <td className="p-3 text-emerald-400">0.884</td>
                <td className="p-3 text-emerald-400">$2,450</td>
                <td className="p-3 text-emerald-400">-$850 (Well Calibrated)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 9. Ethical, Legal & Regulatory Governance */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Ethical, Legal & Regulatory Governance (HIPAA & DPDP Act 2023)
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Data privacy compliance, pre-existing condition exclusions, and health equity safeguards
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg border border-amber-900/30 bg-amber-950/10 space-y-2">
            <h4 className="font-semibold text-amber-200">India DPDP Act 2023 Compliance</h4>
            <p className="text-stone-400 leading-relaxed">
              Health telemetry constitutes Sensitive Personal Data under the Digital Personal Data
              Protection Act 2023. Insurers cannot train models on clinical data without{' '}
              <span className="font-medium text-stone-200">
                explicit, informed, revocable consent
              </span>
              , and must ensure purpose limitation so insurance claim data is not cross-sold to
              third-party advertisers.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-red-900/30 bg-red-950/10 space-y-2">
            <h4 className="font-semibold text-red-200">Pre-Existing Condition Protection</h4>
            <p className="text-stone-400 leading-relaxed">
              Ethical health underwriting draws a strict distinction between voluntary behavioral
              risks (e.g. tobacco use) and non-voluntary biological factors (e.g. congenital heart
              conditions, cancer mutations). Modern health regulations prohibit algorithms from
              pricing vulnerable patients out of basic life-saving medical coverage.
            </p>
          </div>
        </div>
      </section>

      {/* 10. Industrial Health Economics & Business ROI */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Industrial Health Economics & Business ROI
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Proactive clinical interventions that save insurer capital while preserving patient life
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800 space-y-1">
            <div className="text-[10px] text-stone-500 font-mono">Loss Ratio Stability</div>
            <div className="text-lg font-bold text-emerald-400">82% Target</div>
            <div className="text-stone-400">
              Maintains actuarial reserves without sudden premium hikes.
            </div>
          </div>
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800 space-y-1">
            <div className="text-[10px] text-stone-500 font-mono">Preventive Outreach</div>
            <div className="text-lg font-bold text-emerald-400">4.2x ROI</div>
            <div className="text-stone-400">
              Free smoking cessation programs prevent $30,000 ICU stays.
            </div>
          </div>
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800 space-y-1">
            <div className="text-[10px] text-stone-500 font-mono">Underwriting Automation</div>
            <div className="text-lg font-bold text-amber-400">88% Auto-Issued</div>
            <div className="text-stone-400">
              Instant policy issuance for low-risk standard tier applicants.
            </div>
          </div>
        </div>
      </section>

      {/* 11. Viva Voce & Interview Defense */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Viva Voce & Interview Defense (MIT AOE Exam Focus)
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Key oral examination questions on health economics and interaction modeling
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q1: How do you identify whether an interaction term between two features is necessary?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              By plotting the target variable against Feature A grouped or stratified by Feature B.
              If the lines or slopes are parallel, the relationship is purely additive. If the
              slopes diverge significantly or cross, an interaction term (A × B) is mathematically
              necessary to capture the non-parallel slope.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q2: Why is Mean Absolute Error (MAE) more informative than MSE for healthcare premium
              pricing?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Because insurance actuaries must set annual policyholder premiums in real currency
              units (dollars or rupees) that reflect typical expected claims. MAE reports the
              unweighted average error in actual dollars without the extreme distortion caused by a
              few rare million-dollar catastrophic cancer claims.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q3: What happens to a linear regression model if you don't scale continuous features
              like Age (18-65) and Income (50,000-500,000) when using Ridge regularization?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Ridge adds a penalty λ Σ θⱼ² to the loss. If features are unscaled, the feature with
              larger raw values (Income) will naturally have tiny coefficients, while the feature
              with small values (Age) will have large coefficients. Ridge will disproportionately
              penalize Age while barely constraining Income, distorting the regularized solution.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q4: What is the risk of using PolynomialFeatures(degree=3) on a healthcare dataset
              with 20 features?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              The number of features explodes combinatorially as O(d^p). With 20 features at degree
              3, the model generates over 1,770 polynomial features. This causes extreme
              multicollinearity, overfits the training dataset, and dramatically increases model
              variance.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q5: How does Differential Privacy protect patient health records during model
              training?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Differential privacy injects mathematically calibrated Laplacian or Gaussian noise
              into the gradient descent updates. This guarantees that the presence or absence of any
              single patient individual record in the training dataset does not noticeably alter the
              trained model weights, preventing membership inference attacks.
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
            Summary blueprint for healthcare regression systems
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800">
            <div className="font-semibold text-stone-200">Clinical Synergy</div>
            <p className="text-stone-400 mt-1">
              Biological risk factors are rarely additive. Always explore interaction terms (BMI ×
              Smoker) when modeling clinical expenditure.
            </p>
          </div>
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800">
            <div className="font-semibold text-stone-200">Extreme Tail Outliers</div>
            <p className="text-stone-400 mt-1">
              Medical expenditures follow heavy right-skewed distributions. Use log transformations
              and robust metrics like MAE.
            </p>
          </div>
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800">
            <div className="font-semibold text-stone-200">Regulatory Compliance</div>
            <p className="text-stone-400 mt-1">
              Ensure strict de-identification and purpose limitation under HIPAA and the Indian DPDP
              Act 2023.
            </p>
          </div>
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800">
            <div className="font-semibold text-stone-200">Health Equity</div>
            <p className="text-stone-400 mt-1">
              Differentiate behavioral factors (smoking) from unchosen genetics to prevent unfair
              actuarial exclusion of vulnerable patients.
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
            Test your comprehension of healthcare cost modeling and clinical interactions
          </p>
        </div>
        <Quiz conceptId="u3-case-healthcare" items={quizItems} unitAccent={3} />
      </section>

      {/* 14. Next Step Navigation */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-800">
        <div>
          <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
            Previous Case Study
          </span>
          <div className="mt-1">
            <Link
              to="/case-studies/real-estate-pricing"
              className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              ← Case Study: Real-Estate Price Prediction
            </Link>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
            Next: Unit 3 Self-Study
          </span>
          <div className="mt-1">
            <Link
              to="/learn/unit-3/regularization"
              className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              Ridge, Lasso & Elastic Net Regularization →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
