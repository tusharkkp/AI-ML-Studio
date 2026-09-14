import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Quiz } from '@/features/quiz/Quiz';
import { RealEstateLab } from '@/labs/case-study-real-estate/RealEstateLab';

export const RealEstateCaseStudyPage: React.FC = () => {
  const quizItems = [
    {
      id: 're-q1',
      question:
        'Why does a simple linear regression using only Square Footage fail to accurately predict property prices across an entire metropolitan area?',
      options: [
        {
          id: 'A',
          text: 'Because real-estate prices exhibit extreme geographic non-linearity; a 1,000 sq ft flat in a prime downtown district commands 3x to 5x higher price per square foot than an identical flat on the city outskirts.',
          isCorrect: true,
          explanation:
            'Area alone fails because location interacts multiplicatively with space. In prime core districts, each square foot carries massive land-value premiums that single-slope linear models cannot accommodate without categorical neighborhood features or interaction terms.',
        },
        {
          id: 'B',
          text: 'Because square footage cannot be converted into numbers.',
          isCorrect: false,
          explanation: 'Square footage is already a standard continuous numerical variable.',
        },
        {
          id: 'C',
          text: 'Because OLS regression forbids having more than 50 data points.',
          isCorrect: false,
          explanation: 'OLS scales to millions of data points efficiently.',
        },
      ],
    },
    {
      id: 're-q2',
      question:
        'In automated valuation models, why is a random K-Fold cross-validation split considered dangerous compared to a Spatial or Temporal split?',
      options: [
        {
          id: 'A',
          text: 'Random splitting creates spatial autocorrelation leakage: flats from the exact same residential tower or street end up in both training and testing sets, producing artificially inflated accuracy.',
          isCorrect: true,
          explanation:
            'Properties located within the same housing complex share identical builder quality, amenities, and transit access. Random splitting leaks this neighbor information into the test set. Grouping splits by postal code or neighborhood block verifies true generalization.',
        },
        {
          id: 'B',
          text: 'Because K-Fold cross validation deletes 20% of the training data permanently.',
          isCorrect: false,
          explanation: 'Cross-validation rotates folds and evaluates across all observations.',
        },
        {
          id: 'C',
          text: 'Because Scikit-Learn crashes when running cross-validation on housing data.',
          isCorrect: false,
          explanation: 'Cross-validation executes normally in Scikit-Learn.',
        },
      ],
    },
    {
      id: 're-q3',
      question:
        'Why do production Automated Valuation Models frequently train on log(Price) rather than raw Price?',
      options: [
        {
          id: 'A',
          text: 'Real-estate transaction values are heavily right-skewed with long positive tails; log transformation stabilizes heteroscedastic variance and converts multiplicative percentage effects into additive linear relationships.',
          isCorrect: true,
          explanation:
            'A $10,000 error on a $100,000 starter flat represents a critical 10% discrepancy, whereas on a $5,000,000 mansion it is rounding error. Log transformations equalize proportional percentage errors across diverse price tiers.',
        },
        {
          id: 'B',
          text: 'Because computers cannot calculate square roots on numbers larger than one million.',
          isCorrect: false,
          explanation: 'Hardware handles double precision floating points up to 10^308.',
        },
        {
          id: 'C',
          text: 'To ensure that model weights are always integers.',
          isCorrect: false,
          explanation: 'Weights remain real-valued continuous floating points.',
        },
      ],
    },
    {
      id: 're-q4',
      question: 'What is algorithmic redlining in automated mortgage valuation algorithms?',
      options: [
        {
          id: 'A',
          text: 'When algorithms systematically undervalue properties in historically marginalized or minority neighborhoods through proxy variables like ZIP code or school rating scores.',
          isCorrect: true,
          explanation:
            'Even when demographic attributes like race or ethnicity are excluded from model training, geographic identifiers and historical sale prices can encode legacy discriminatory lending patterns, causing algorithmic models to systematically depress property valuations.',
        },
        {
          id: 'B',
          text: 'When a regression line is drawn in red color on an SVG chart.',
          isCorrect: false,
          explanation: 'This is UI styling, not algorithmic discrimination.',
        },
        {
          id: 'C',
          text: 'When a bank runs out of server memory during gradient descent.',
          isCorrect: false,
          explanation: 'Memory exhaustion is a system infrastructure issue.',
        },
      ],
    },
    {
      id: 're-q5',
      question:
        'Why is Median Absolute Percentage Error (MdAPE) preferred over Mean Squared Error (MSE) by real-estate underwriters?',
      options: [
        {
          id: 'A',
          text: 'Because ultra-luxury penthouse transactions produce multi-crore residual outliers that disproportionately blow up MSE, while MdAPE measures the true typical percentage error across everyday homes.',
          isCorrect: true,
          explanation:
            'A single luxury transaction off by ₹2 Crore produces a squared error of 4,000,000, severely skewing the average MSE scorecard. The median percentage error reflects whether the valuation engine is reliably within +/- 5% for typical buyers.',
        },
        {
          id: 'B',
          text: 'Because MSE can only be calculated on linear models.',
          isCorrect: false,
          explanation: 'MSE is applicable to any regression model regardless of architecture.',
        },
        {
          id: 'C',
          text: 'Because MdAPE is required by the Python language specification.',
          isCorrect: false,
          explanation: 'Language specifications do not mandate statistical metrics.',
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
            Unit 3: Case Study 1
          </Badge>
          <Badge variant="outline" className="border-stone-800 text-stone-400">
            0.5 Hours • CO2, CO4
          </Badge>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
          Case Study: Real-Estate Price Prediction & Automated Valuation
        </h1>
        <p className="text-base text-stone-400 max-w-3xl leading-relaxed">
          Automated Valuation Models (AVMs) power modern mortgage underwriting, property tax
          assessments, and digital real-estate marketplaces. Deploying regression in physical
          real-estate markets requires handling{' '}
          <span className="font-medium text-stone-200">
            extreme geographic non-linearity and spatial autocorrelation
          </span>{' '}
          that standard tabular models fail to capture.
        </p>
      </section>

      {/* 2. Problem Statement & Industrial Context */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Problem Statement & Industrial Workflow
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            How institutional lenders replace 5-day human appraisals with sub-second algorithmic
            pricing
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-medium text-amber-400">1. Legacy Bottleneck</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Traditional home loan approvals require physical inspection by certified appraisers,
              taking 5 to 10 business days and costing ₹5,000 to ₹15,000 per property file.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-medium text-amber-400">2. Algorithmic Solution</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              An Automated Valuation Model synthesizes historical registry sales, municipal tax
              records, satellite imagery, and transit infrastructure to generate instant price
              estimates.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-2">
            <h4 className="font-medium text-amber-400">3. Underwriting Impact</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Pre-approved mortgages can be issued in under 15 minutes, cutting administrative loan
              processing costs by over 70% while capping default exposure.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Feature Architecture & Preprocessing */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Feature Architecture & Preprocessing Pipeline
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Transforming heterogeneous physical assets into clean numerical vectors
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <Card className="border-stone-800 bg-stone-950/60">
            <CardHeader className="pb-2">
              <h3 className="font-display text-sm font-semibold text-stone-200">
                Continuous & Discrete Attributes
              </h3>
            </CardHeader>
            <CardContent className="space-y-2 text-stone-300">
              <div className="flex justify-between border-b border-stone-800/60 pb-1.5">
                <span>Super Built-up Area:</span>
                <span className="text-amber-400">600 to 4500 sq.ft (StandardScaler)</span>
              </div>
              <div className="flex justify-between border-b border-stone-800/60 pb-1.5">
                <span>Bedroom Count (BHK):</span>
                <span className="text-amber-400">1, 2, 3, 4, 5 (Integer encoded)</span>
              </div>
              <div className="flex justify-between border-b border-stone-800/60 pb-1.5">
                <span>Property Age:</span>
                <span className="text-amber-400">0 to 40 Years (Linear depreciation)</span>
              </div>
              <div className="flex justify-between">
                <span>Distance to Transit:</span>
                <span className="text-amber-400">0.2 to 15.0 km (Square root damping)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-800 bg-stone-950/60">
            <CardHeader className="pb-2">
              <h3 className="font-display text-sm font-semibold text-stone-200">
                Categorical & Geographic Features
              </h3>
            </CardHeader>
            <CardContent className="space-y-2 text-stone-300">
              <div className="flex justify-between border-b border-stone-800/60 pb-1.5">
                <span>Neighborhood Locality:</span>
                <span className="text-emerald-400">One-Hot Encoded (K - 1 dummies)</span>
              </div>
              <div className="flex justify-between border-b border-stone-800/60 pb-1.5">
                <span>Builder Reputation Tier:</span>
                <span className="text-emerald-400">Ordinal Encoded (Grade A / B / C)</span>
              </div>
              <div className="flex justify-between border-b border-stone-800/60 pb-1.5">
                <span>Floor Level Premium:</span>
                <span className="text-emerald-400">Non-linear floor rise penalty</span>
              </div>
              <div className="flex justify-between">
                <span>Target Price y:</span>
                <span className="text-emerald-400">log(Price) to normalize skewness</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. Interactive Valuation Studio */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Interactive Valuation Engine & Underwriting Studio
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Test loan properties against the 20-transaction market registry and inspect feature
            waterfall decomposition
          </p>
        </div>
        <RealEstateLab />
      </section>

      {/* 5. Mathematical Formulation */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Mathematical Formulation: Why Linear Terms are Not Enough
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Formulating spatial interactions and land-rate elasticity
          </p>
        </div>
        <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-3 text-sm text-stone-300">
          <p className="leading-relaxed">
            In standard multiple linear regression, each feature exerts an additive independent
            effect on price:
          </p>
          <div className="p-3 bg-stone-950 rounded font-mono text-xs text-amber-300">
            Price = θ₀ + θ₁·Area + θ₂·BHK + θ₃·Age + θ₄·Transit + θ₅·Locality_Prime
          </div>
          <p className="leading-relaxed">
            However, this formulation asserts that an additional 500 sq ft adds the exact same
            monetary value in a remote suburb as in the city center. In reality, location alters the{' '}
            <span className="font-medium text-stone-200">
              unit price per square foot multiplicatively
            </span>
            . To capture this reality, we introduce interaction terms:
          </p>
          <div className="p-3 bg-stone-950 rounded font-mono text-xs text-emerald-400">
            Price = θ₀ + θ₁·Area + θ₂·(Area × Locality_Prime) + θ₃·(Area × Locality_MidTown) -
            θ₄·Age - θ₅·√Transit
          </div>
          <p className="leading-relaxed text-xs text-stone-400">
            The interaction parameter θ₂ represents the incremental premium per square foot
            commanded by prime urban core zoning.
          </p>
        </div>
      </section>

      {/* 6. Data Leakage & Validation Protocol */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Data Leakage & Spatial Cross-Validation Protocol
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Why standard random train-test splitting causes catastrophic failure in physical
            geospatial datasets
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg border border-red-900/30 bg-red-950/10 space-y-2">
            <h4 className="font-semibold text-red-200">Spatial Autocorrelation Leakage</h4>
            <p className="text-stone-400 leading-relaxed">
              According to Tobler First Law of Geography, everything is related to everything else,
              but near things are more related than distant things. If flats from the same apartment
              society are randomly split across train and test folds, the test fold is contaminated
              with{' '}
              <span className="font-medium text-stone-200">identical localized price data</span>.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-emerald-900/30 bg-emerald-950/10 space-y-2">
            <h4 className="font-semibold text-emerald-200">Spatial Block Cross-Validation</h4>
            <p className="text-stone-400 leading-relaxed">
              In production, cross-validation must hold out entire geographic postal sectors or PIN
              codes. This guarantees that the model is tested on its ability to generalize to an
              entirely new neighborhood rather than memorizing neighbor sales.
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
            Complete automated pipeline using ColumnTransformer and Ridge regression
          </p>
        </div>
        <div className="p-4 rounded-lg border border-stone-800 bg-stone-950 font-mono text-xs text-stone-300 overflow-x-auto">
          <pre>{`import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, r2_score

# 1. Define feature schema
num_features = ['area_sqft', 'bedrooms', 'age_years', 'transit_dist_km']
cat_features = ['locality_tier']

# 2. Build preprocessing transformer
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), num_features),
        ('cat', OneHotEncoder(drop='first', sparse_output=False), cat_features)
    ]
)

# 3. Create end-to-end model pipeline with Ridge regularization
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', Ridge(alpha=10.0))
])

# 4. Training on historical registry data (using log price)
# df_train = pd.read_csv('pune_housing_transactions.csv')
# X = df_train[num_features + cat_features]
# y_log = np.log(df_train['price_lakhs'])
# pipeline.fit(X, y_log)

def predict_property(features_dict: dict) -> dict:
    df_sample = pd.DataFrame([features_dict])
    log_pred = pipeline.predict(df_sample)[0]
    estimated_price = np.exp(log_pred)
    return {
        "estimated_price_lakhs": round(float(estimated_price), 2),
        "lower_bound_95": round(float(estimated_price * 0.92), 2),
        "upper_bound_95": round(float(estimated_price * 1.08), 2)
    }`}</pre>
        </div>
      </section>

      {/* 8. Model Comparison Audit */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Model Comparison & Metric Audit
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Benchmarking statistical models across holdout test neighborhoods
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-stone-800 rounded font-mono">
            <thead className="bg-stone-900 text-stone-300">
              <tr>
                <th className="p-3 border-b border-stone-800">Model Architecture</th>
                <th className="p-3 border-b border-stone-800">Features Included</th>
                <th className="p-3 border-b border-stone-800">Test R²</th>
                <th className="p-3 border-b border-stone-800">Test MAE</th>
                <th className="p-3 border-b border-stone-800">Median % Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              <tr>
                <td className="p-3 font-semibold text-stone-300">1D Simple OLS</td>
                <td className="p-3">Area Only</td>
                <td className="p-3 text-red-400">0.624</td>
                <td className="p-3 text-stone-400">₹ 24.2 L</td>
                <td className="p-3 text-red-400">18.6%</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-300">Multivariate Linear</td>
                <td className="p-3">Area, BHK, Age, Transit, Locality</td>
                <td className="p-3 text-amber-400">0.912</td>
                <td className="p-3 text-stone-400">₹ 8.5 L</td>
                <td className="p-3 text-amber-400">6.8%</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-emerald-400">Interaction Ridge</td>
                <td className="p-3">Area × Locality, √Transit, Regularization</td>
                <td className="p-3 text-emerald-400">0.972</td>
                <td className="p-3 text-emerald-400">₹ 4.1 L</td>
                <td className="p-3 text-emerald-400">3.2%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 9. Ethical & Regulatory Appraisal Considerations */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Ethical, Legal & Fair Lending Governance
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Preventing systemic discrimination in automated mortgage underwriting
          </p>
        </div>
        <div className="p-4 rounded-lg border border-amber-900/30 bg-amber-950/10 space-y-3 text-sm text-stone-300">
          <h4 className="font-medium text-amber-200">Algorithmic Redlining & Disparate Impact</h4>
          <p className="text-xs text-stone-400 leading-relaxed">
            In many countries, historical housing discrimination resulted in systemic undervaluation
            of minority neighborhoods. If an ML model trains on unadjusted historical appraisal
            data, it codifies legacy prejudice into mathematical weights. Under fair housing
            regulations (such as the US ECOA and Indian fair underwriting norms), lenders must
            perform <span className="font-medium text-stone-200">disparate impact audits</span> to
            verify that model predictions do not correlate with protected demographic classes.
          </p>
        </div>
      </section>

      {/* 10. Cost-Benefit & Business ROI */}
      <section className="space-y-4">
        <div className="border-b border-stone-800 pb-2">
          <h2 className="font-display text-xl font-semibold text-stone-100">
            Cost-Benefit & Business ROI
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Quantifying business efficiency gains for mortgage banks and housing finance companies
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800 space-y-1">
            <div className="text-[10px] text-stone-500 font-mono">Turnaround Time</div>
            <div className="text-lg font-bold text-emerald-400">5 Days → 2 Sec</div>
            <div className="text-stone-400">
              Instant eligibility screening on retail loan applications.
            </div>
          </div>
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800 space-y-1">
            <div className="text-[10px] text-stone-500 font-mono">Appraisal Cost</div>
            <div className="text-lg font-bold text-emerald-400">₹10,000 → ₹150</div>
            <div className="text-stone-400">Automated desktop valuation cuts overhead by 98%.</div>
          </div>
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800 space-y-1">
            <div className="text-[10px] text-stone-500 font-mono">Default Risk Exposure</div>
            <div className="text-lg font-bold text-amber-400">-34% Default Rate</div>
            <div className="text-stone-400">
              Detects overvalued loan-to-value (LTV) submissions automatically.
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
            Targeted oral examination questions on applying regression in real estate
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q1: Why must the locality feature be one-hot encoded rather than integer label encoded
              (e.g., 1, 2, 3)?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Integer encoding assigns an artificial numerical ordering (e.g. Locality 3 is greater
              than Locality 2 by 1 unit). A linear regression model would assume a constant slope
              difference between localities, which has no mathematical justification. One-hot
              encoding gives each neighborhood its own independent intercept weight.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q2: What is spatial autocorrelation and how does it compromise model evaluation?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Spatial autocorrelation refers to the fact that neighboring properties have closely
              correlated values. If train and test sets are sampled randomly across the same street,
              the test set is already effectively known to the model, creating{' '}
              <span className="font-medium text-stone-200">severe data leakage</span> and falsely
              optimistic test metrics.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q3: Why do we introduce interaction terms between Area and Locality?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Because the price elasticity of square footage depends heavily on the geographic
              district. An extra 100 square feet in a prime city center commands a far higher
              marginal price than 100 square feet in a rural outskirt. An interaction term allows
              the slope of Area to vary by neighborhood.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q4: Why does taking the log of the house price improve linear regression fit?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              House prices follow a right-skewed log-normal distribution with long upper tails.
              Taking the natural logarithm compresses extreme luxury outliers, produces
              Gaussian-like residuals, and enforces constant percentage error behavior across all
              property tiers.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-stone-800 bg-stone-900/30 space-y-1.5">
            <h4 className="font-medium text-amber-400">
              Q5: How does an automated valuation model detect whether a mortgage loan application
              has an inflated property valuation?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              By comparing the borrower stated property value against the AVM predicted value and
              its 95% confidence interval. If the stated value exceeds the upper confidence bound by
              more than a risk threshold (e.g., &gt; 15%), the file is flagged for manual senior
              appraisal review to prevent loan fraud.
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
            Summary blueprint for real-estate machine learning pipelines
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800">
            <div className="font-semibold text-stone-200">Geographic Non-Linearity</div>
            <p className="text-stone-400 mt-1">
              Never use simple 1D linear regression on property square footage. Location is a
              multiplicative interaction term, not an additive constant.
            </p>
          </div>
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800">
            <div className="font-semibold text-stone-200">Spatial Validation</div>
            <p className="text-stone-400 mt-1">
              Use Spatial Block Cross-Validation rather than random K-Fold to prevent adjacent
              apartment leakage between train and test sets.
            </p>
          </div>
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800">
            <div className="font-semibold text-stone-200">Log-Normal Transformation</div>
            <p className="text-stone-400 mt-1">
              Train on log(Price) to equalize relative percentage penalties across both modest
              starter flats and luxury penthouses.
            </p>
          </div>
          <div className="p-3 bg-stone-900/40 rounded border border-stone-800">
            <div className="font-semibold text-stone-200">Ethical Governance</div>
            <p className="text-stone-400 mt-1">
              Perform disparate impact and fair lending audits to guarantee that historical
              appraisal biases are not reproduced algorithmically.
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
            Test your mastery of real-estate regression modeling and spatial validation
          </p>
        </div>
        <Quiz conceptId="u3-case-real-estate" items={quizItems} unitAccent={3} />
      </section>

      {/* 14. Next Step Navigation */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-800">
        <div>
          <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
            Previous Concept
          </span>
          <div className="mt-1">
            <Link
              to="/learn/unit-3/regression-metrics"
              className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              ← Regression Evaluation Metrics
            </Link>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
            Next: Healthcare Case Study
          </span>
          <div className="mt-1">
            <Link
              to="/case-studies/healthcare-regression"
              className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              Case Study: Healthcare Medical Cost Regression →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
