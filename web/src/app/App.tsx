import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Backdrop } from '@/components/layout/Backdrop';

// Lazy-loaded route pages for code-splitting and instant initial route payload
const LandingPage = lazy(() =>
  import('@/pages/LandingPage').then((m) => ({ default: m.LandingPage }))
);
const Unit1LandingPage = lazy(() =>
  import('@/pages/Unit1LandingPage').then((m) => ({ default: m.Unit1LandingPage }))
);
const AiHistoryPage = lazy(() =>
  import('@/pages/AiHistoryPage').then((m) => ({ default: m.AiHistoryPage }))
);
const AiTypesPage = lazy(() =>
  import('@/pages/AiTypesPage').then((m) => ({ default: m.AiTypesPage }))
);
const IntelligentAgentsPage = lazy(() =>
  import('@/pages/IntelligentAgentsPage').then((m) => ({ default: m.IntelligentAgentsPage }))
);
const KnowledgeRepresentationPage = lazy(() =>
  import('@/pages/KnowledgeRepresentationPage').then((m) => ({
    default: m.KnowledgeRepresentationPage,
  }))
);
const FirstOrderLogicPage = lazy(() =>
  import('@/pages/FirstOrderLogicPage').then((m) => ({ default: m.FirstOrderLogicPage }))
);
const RuleBasedReasoningPage = lazy(() =>
  import('@/pages/RuleBasedReasoningPage').then((m) => ({ default: m.RuleBasedReasoningPage }))
);
const ExpertSystemsPage = lazy(() =>
  import('@/pages/ExpertSystemsPage').then((m) => ({ default: m.ExpertSystemsPage }))
);
const MedicalDiagnosisCaseStudy = lazy(() =>
  import('@/pages/MedicalDiagnosisCaseStudy').then((m) => ({
    default: m.MedicalDiagnosisCaseStudy,
  }))
);
const SelfDrivingCaseStudy = lazy(() =>
  import('@/pages/SelfDrivingCaseStudy').then((m) => ({ default: m.SelfDrivingCaseStudy }))
);
const EthicsImpactPage = lazy(() =>
  import('@/pages/EthicsImpactPage').then((m) => ({ default: m.EthicsImpactPage }))
);
const ChatbotPromptEngPage = lazy(() =>
  import('@/pages/ChatbotPromptEngPage').then((m) => ({ default: m.ChatbotPromptEngPage }))
);
const AgiFrontiersPage = lazy(() =>
  import('@/pages/AgiFrontiersPage').then((m) => ({ default: m.AgiFrontiersPage }))
);
const Unit1ExamPage = lazy(() =>
  import('@/pages/Unit1ExamPage').then((m) => ({ default: m.Unit1ExamPage }))
);
const Unit1CheatSheetPage = lazy(() =>
  import('@/pages/Unit1CheatSheetPage').then((m) => ({ default: m.Unit1CheatSheetPage }))
);
const Unit2LandingPage = lazy(() =>
  import('@/pages/Unit2LandingPage').then((m) => ({ default: m.Unit2LandingPage }))
);
const StateSpaceSearchPage = lazy(() =>
  import('@/pages/StateSpaceSearchPage').then((m) => ({ default: m.StateSpaceSearchPage }))
);
const UninformedSearchPage = lazy(() =>
  import('@/pages/UninformedSearchPage').then((m) => ({ default: m.UninformedSearchPage }))
);
const BfsConceptPage = lazy(() =>
  import('@/pages/BfsConceptPage').then((m) => ({ default: m.BfsConceptPage }))
);
const HeuristicSearchPage = lazy(() =>
  import('@/pages/HeuristicSearchPage').then((m) => ({ default: m.HeuristicSearchPage }))
);
const LocalSearchPage = lazy(() =>
  import('@/pages/LocalSearchPage').then((m) => ({ default: m.LocalSearchPage }))
);
const GpsNavigationCaseStudyPage = lazy(() =>
  import('@/pages/GpsNavigationCaseStudyPage').then((m) => ({
    default: m.GpsNavigationCaseStudyPage,
  }))
);
const CspPage = lazy(() => import('@/pages/CspPage').then((m) => ({ default: m.CspPage })));
const AdversarialSearchPage = lazy(() =>
  import('@/pages/AdversarialSearchPage').then((m) => ({ default: m.AdversarialSearchPage }))
);
const ChessCaseStudyPage = lazy(() =>
  import('@/pages/ChessCaseStudyPage').then((m) => ({ default: m.ChessCaseStudyPage }))
);
const GeneticAlgorithmsPage = lazy(() =>
  import('@/pages/GeneticAlgorithmsPage').then((m) => ({ default: m.GeneticAlgorithmsPage }))
);
const GameTheoryPage = lazy(() =>
  import('@/pages/GameTheoryPage').then((m) => ({ default: m.GameTheoryPage }))
);
const Unit2ExamPage = lazy(() =>
  import('@/pages/Unit2ExamPage').then((m) => ({ default: m.Unit2ExamPage }))
);
const Unit2CheatSheetPage = lazy(() =>
  import('@/pages/Unit2CheatSheetPage').then((m) => ({ default: m.Unit2CheatSheetPage }))
);
const WarehouseLabPage = lazy(() =>
  import('@/pages/WarehouseLabPage').then((m) => ({ default: m.WarehouseLabPage }))
);
const Unit3LandingPage = lazy(() =>
  import('@/pages/Unit3LandingPage').then((m) => ({ default: m.Unit3LandingPage }))
);
const MlParadigmsPage = lazy(() =>
  import('@/pages/MlParadigmsPage').then((m) => ({ default: m.MlParadigmsPage }))
);
const SimpleLinearRegressionPage = lazy(() =>
  import('@/pages/SimpleLinearRegressionPage').then((m) => ({
    default: m.SimpleLinearRegressionPage,
  }))
);
const GradientDescentPage = lazy(() =>
  import('@/pages/GradientDescentPage').then((m) => ({ default: m.GradientDescentPage }))
);
const MultipleLinearRegressionPage = lazy(() =>
  import('@/pages/MultipleLinearRegressionPage').then((m) => ({
    default: m.MultipleLinearRegressionPage,
  }))
);
const PolynomialRegressionPage = lazy(() =>
  import('@/pages/PolynomialRegressionPage').then((m) => ({
    default: m.PolynomialRegressionPage,
  }))
);
const BiasVariancePage = lazy(() =>
  import('@/pages/BiasVariancePage').then((m) => ({ default: m.BiasVariancePage }))
);
const LocallyWeightedRegressionPage = lazy(() =>
  import('@/pages/LocallyWeightedRegressionPage').then((m) => ({
    default: m.LocallyWeightedRegressionPage,
  }))
);
const FeatureEngineeringPage = lazy(() =>
  import('@/pages/FeatureEngineeringPage').then((m) => ({
    default: m.FeatureEngineeringPage,
  }))
);
const RegressionMetricsPage = lazy(() =>
  import('@/pages/RegressionMetricsPage').then((m) => ({
    default: m.RegressionMetricsPage,
  }))
);
const RealEstateCaseStudyPage = lazy(() =>
  import('@/pages/RealEstateCaseStudyPage').then((m) => ({
    default: m.RealEstateCaseStudyPage,
  }))
);
const HealthcareCaseStudyPage = lazy(() =>
  import('@/pages/HealthcareCaseStudyPage').then((m) => ({
    default: m.HealthcareCaseStudyPage,
  }))
);
const RegularizationPage = lazy(() =>
  import('@/pages/RegularizationPage').then((m) => ({
    default: m.RegularizationPage,
  }))
);
const CrossValidationPage = lazy(() =>
  import('@/pages/CrossValidationPage').then((m) => ({
    default: m.CrossValidationPage,
  }))
);
const Unit3ExamPage = lazy(() =>
  import('@/pages/Unit3ExamPage').then((m) => ({
    default: m.Unit3ExamPage,
  }))
);
const Unit3CheatSheetPage = lazy(() =>
  import('@/pages/Unit3CheatSheetPage').then((m) => ({
    default: m.Unit3CheatSheetPage,
  }))
);
const Unit4LandingPage = lazy(() =>
  import('@/pages/Unit4LandingPage').then((m) => ({
    default: m.Unit4LandingPage,
  }))
);
const BayesTheoremPage = lazy(() =>
  import('@/pages/BayesTheoremPage').then((m) => ({
    default: m.BayesTheoremPage,
  }))
);
const NaiveBayesPage = lazy(() =>
  import('@/pages/NaiveBayesPage').then((m) => ({
    default: m.NaiveBayesPage,
  }))
);
const LaplaceSmoothingPage = lazy(() =>
  import('@/pages/LaplaceSmoothingPage').then((m) => ({
    default: m.LaplaceSmoothingPage,
  }))
);
const LogisticRegressionPage = lazy(() =>
  import('@/pages/LogisticRegressionPage').then((m) => ({
    default: m.LogisticRegressionPage,
  }))
);
const ClassificationMetricsPage = lazy(() =>
  import('@/pages/ClassificationMetricsPage').then((m) => ({
    default: m.ClassificationMetricsPage,
  }))
);
const RocAucPage = lazy(() =>
  import('@/pages/RocAucPage').then((m) => ({
    default: m.RocAucPage,
  }))
);
const KnnPage = lazy(() => import('@/pages/KnnPage').then((m) => ({ default: m.KnnPage })));
const CustomerChurnCaseStudyPage = lazy(() =>
  import('@/pages/CustomerChurnCaseStudyPage').then((m) => ({
    default: m.CustomerChurnCaseStudyPage,
  }))
);
const VariationalInferencePage = lazy(() =>
  import('@/pages/VariationalInferencePage').then((m) => ({
    default: m.VariationalInferencePage,
  }))
);
const Unit4ExamPage = lazy(() =>
  import('@/pages/Unit4ExamPage').then((m) => ({ default: m.Unit4ExamPage }))
);
const Unit4CheatSheetPage = lazy(() =>
  import('@/pages/Unit4CheatSheetPage').then((m) => ({ default: m.Unit4CheatSheetPage }))
);
const Unit5LandingPage = lazy(() =>
  import('@/pages/Unit5LandingPage').then((m) => ({ default: m.Unit5LandingPage }))
);
const DecisionTreesPage = lazy(() =>
  import('@/pages/DecisionTreesPage').then((m) => ({ default: m.DecisionTreesPage }))
);
const ImpurityCriteriaPage = lazy(() =>
  import('@/pages/ImpurityCriteriaPage').then((m) => ({ default: m.ImpurityCriteriaPage }))
);
const TreePruningPage = lazy(() =>
  import('@/pages/TreePruningPage').then((m) => ({ default: m.TreePruningPage }))
);
const SvmFundamentalsPage = lazy(() =>
  import('@/pages/SvmFundamentalsPage').then((m) => ({ default: m.SvmFundamentalsPage }))
);
const SvmKernelsPage = lazy(() =>
  import('@/pages/SvmKernelsPage').then((m) => ({ default: m.SvmKernelsPage }))
);
const EnsembleSignificancePage = lazy(() =>
  import('@/pages/EnsembleSignificancePage').then((m) => ({ default: m.EnsembleSignificancePage }))
);
const BaggingRandomForestsPage = lazy(() =>
  import('@/pages/BaggingRandomForestsPage').then((m) => ({ default: m.BaggingRandomForestsPage }))
);
const BoostingStackingPage = lazy(() =>
  import('@/pages/BoostingStackingPage').then((m) => ({ default: m.BoostingStackingPage }))
);
const PerformanceEvaluationPage = lazy(() =>
  import('@/pages/PerformanceEvaluationPage').then((m) => ({
    default: m.PerformanceEvaluationPage,
  }))
);
const DiabetesPredictionCaseStudyPage = lazy(() =>
  import('@/pages/DiabetesPredictionCaseStudyPage').then((m) => ({
    default: m.DiabetesPredictionCaseStudyPage,
  }))
);
const AdaBoostPage = lazy(() =>
  import('@/pages/AdaBoostPage').then((m) => ({ default: m.AdaBoostPage }))
);
const DecisionTreeRegressionPage = lazy(() =>
  import('@/pages/DecisionTreeRegressionPage').then((m) => ({
    default: m.DecisionTreeRegressionPage,
  }))
);
const Unit5ExamPage = lazy(() =>
  import('@/pages/Unit5ExamPage').then((m) => ({ default: m.Unit5ExamPage }))
);
const Unit5CheatSheetPage = lazy(() =>
  import('@/pages/Unit5CheatSheetPage').then((m) => ({ default: m.Unit5CheatSheetPage }))
);
const CheatsheetsDirectoryPage = lazy(() =>
  import('@/pages/CheatsheetsDirectoryPage').then((m) => ({ default: m.CheatsheetsDirectoryPage }))
);
const LabsDirectoryPage = lazy(() =>
  import('@/pages/LabsDirectoryPage').then((m) => ({ default: m.LabsDirectoryPage }))
);

function PageLoadingFallback() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
      <div className="relative size-10">
        <div className="absolute inset-0 rounded-full border-2 border-brand/20 animate-ping" />
        <div className="absolute inset-0 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>
      <p className="mt-4 font-mono text-xs text-neutral-400">Loading learning module...</p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground">
        404: Topic Not Found
      </h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-400">
        The concept you are looking for has not been explored yet or the path has changed.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="btn-asym inline-flex h-9 items-center gap-2 bg-neutral-900 px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          Return to Course Home
        </Link>
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <div className="relative isolate min-h-screen flex flex-col overflow-x-clip bg-background text-foreground">
        <Backdrop />
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/learn/unit-1" element={<Unit1LandingPage />} />
              <Route path="/learn/unit-1/history-foundations" element={<AiHistoryPage />} />
              <Route path="/learn/unit-1/types-applications" element={<AiTypesPage />} />
              <Route path="/learn/unit-1/intelligent-agents" element={<IntelligentAgentsPage />} />
              <Route
                path="/learn/unit-1/knowledge-representation"
                element={<KnowledgeRepresentationPage />}
              />
              <Route path="/learn/unit-1/first-order-logic" element={<FirstOrderLogicPage />} />
              <Route
                path="/learn/unit-1/rule-based-reasoning"
                element={<RuleBasedReasoningPage />}
              />
              <Route path="/learn/unit-1/expert-systems" element={<ExpertSystemsPage />} />
              <Route
                path="/case-studies/medical-diagnosis"
                element={<MedicalDiagnosisCaseStudy />}
              />
              <Route path="/case-studies/self-driving-vehicle" element={<SelfDrivingCaseStudy />} />
              <Route path="/learn/unit-1/ethics-impact" element={<EthicsImpactPage />} />
              <Route
                path="/learn/unit-1/chatbot-prompt-engineering"
                element={<ChatbotPromptEngPage />}
              />
              <Route path="/learn/unit-1/agi" element={<AgiFrontiersPage />} />
              <Route path="/learn/unit-1/exam" element={<Unit1ExamPage />} />
              <Route path="/cheatsheets/unit-1" element={<Unit1CheatSheetPage />} />
              <Route path="/learn/unit-2" element={<Unit2LandingPage />} />
              <Route path="/learn/unit-2/state-space-search" element={<StateSpaceSearchPage />} />
              <Route path="/learn/unit-2/uninformed-search" element={<UninformedSearchPage />} />
              <Route path="/learn/unit-2/informed-search" element={<HeuristicSearchPage />} />
              <Route path="/learn/unit-2/local-search" element={<LocalSearchPage />} />
              <Route path="/case-studies/gps-navigation" element={<GpsNavigationCaseStudyPage />} />
              <Route path="/learn/unit-2/csp" element={<CspPage />} />
              <Route path="/learn/unit-2/adversarial-search" element={<AdversarialSearchPage />} />
              <Route path="/case-studies/chess-game-engine" element={<ChessCaseStudyPage />} />
              <Route path="/learn/unit-2/genetic-algorithms" element={<GeneticAlgorithmsPage />} />
              <Route path="/learn/unit-2/game-theory" element={<GameTheoryPage />} />
              <Route path="/learn/unit-2/exam" element={<Unit2ExamPage />} />
              <Route path="/cheatsheets/unit-2" element={<Unit2CheatSheetPage />} />
              <Route path="/learn/unit-2/bfs" element={<BfsConceptPage />} />
              <Route path="/lab/warehouse-bfs" element={<WarehouseLabPage />} />
              <Route path="/learn/unit-3" element={<Unit3LandingPage />} />
              <Route path="/learn/unit-3/ml-paradigms" element={<MlParadigmsPage />} />
              <Route
                path="/learn/unit-3/simple-linear-regression"
                element={<SimpleLinearRegressionPage />}
              />
              <Route path="/learn/unit-3/gradient-descent" element={<GradientDescentPage />} />
              <Route
                path="/learn/unit-3/multiple-linear-regression"
                element={<MultipleLinearRegressionPage />}
              />
              <Route
                path="/learn/unit-3/polynomial-regression"
                element={<PolynomialRegressionPage />}
              />
              <Route path="/learn/unit-3/bias-variance-tradeoff" element={<BiasVariancePage />} />
              <Route
                path="/learn/unit-3/locally-weighted-regression"
                element={<LocallyWeightedRegressionPage />}
              />
              <Route
                path="/learn/unit-3/feature-engineering"
                element={<FeatureEngineeringPage />}
              />
              <Route path="/learn/unit-3/regression-metrics" element={<RegressionMetricsPage />} />
              <Route
                path="/case-studies/real-estate-pricing"
                element={<RealEstateCaseStudyPage />}
              />
              <Route
                path="/case-studies/healthcare-regression"
                element={<HealthcareCaseStudyPage />}
              />
              <Route path="/learn/unit-3/regularization" element={<RegularizationPage />} />
              <Route
                path="/learn/unit-3/kfold-cross-validation"
                element={<CrossValidationPage />}
              />
              <Route path="/learn/unit-3/exam" element={<Unit3ExamPage />} />
              <Route path="/cheatsheets/unit-3" element={<Unit3CheatSheetPage />} />
              <Route path="/learn/unit-4" element={<Unit4LandingPage />} />
              <Route path="/learn/unit-4/bayes-theorem" element={<BayesTheoremPage />} />
              <Route path="/learn/unit-4/naive-bayes" element={<NaiveBayesPage />} />
              <Route path="/learn/unit-4/laplace-smoothing" element={<LaplaceSmoothingPage />} />
              <Route
                path="/learn/unit-4/logistic-regression"
                element={<LogisticRegressionPage />}
              />
              <Route
                path="/learn/unit-4/classification-metrics"
                element={<ClassificationMetricsPage />}
              />
              <Route path="/learn/unit-4/roc-auc" element={<RocAucPage />} />
              <Route path="/learn/unit-4/knn" element={<KnnPage />} />
              <Route path="/case-studies/customer-churn" element={<CustomerChurnCaseStudyPage />} />
              <Route
                path="/learn/unit-4/variational-inference"
                element={<VariationalInferencePage />}
              />
              <Route path="/learn/unit-4/exam" element={<Unit4ExamPage />} />
              <Route path="/cheatsheets/unit-4" element={<Unit4CheatSheetPage />} />
              <Route path="/learn/unit-5" element={<Unit5LandingPage />} />
              <Route path="/learn/unit-5/decision-trees" element={<DecisionTreesPage />} />
              <Route
                path="/learn/unit-5/impurity-split-criteria"
                element={<ImpurityCriteriaPage />}
              />
              <Route path="/learn/unit-5/tree-pruning" element={<TreePruningPage />} />
              <Route path="/learn/unit-5/svm-fundamentals" element={<SvmFundamentalsPage />} />
              <Route path="/learn/unit-5/svm-kernels" element={<SvmKernelsPage />} />
              <Route
                path="/learn/unit-5/ensemble-significance"
                element={<EnsembleSignificancePage />}
              />
              <Route
                path="/learn/unit-5/bagging-random-forests"
                element={<BaggingRandomForestsPage />}
              />
              <Route path="/learn/unit-5/boosting-stacking" element={<BoostingStackingPage />} />
              <Route
                path="/learn/unit-5/performance-evaluation"
                element={<PerformanceEvaluationPage />}
              />
              <Route
                path="/case-studies/diabetes-prediction"
                element={<DiabetesPredictionCaseStudyPage />}
              />
              <Route path="/learn/unit-5/adaboost" element={<AdaBoostPage />} />
              <Route
                path="/learn/unit-5/decision-tree-regression"
                element={<DecisionTreeRegressionPage />}
              />
              <Route path="/learn/unit-5/exam" element={<Unit5ExamPage />} />
              <Route path="/cheatsheets/unit-5" element={<Unit5CheatSheetPage />} />
              <Route path="/cheatsheets" element={<CheatsheetsDirectoryPage />} />
              <Route path="/lab" element={<LabsDirectoryPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
