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
const WarehouseLabPage = lazy(() =>
  import('@/pages/WarehouseLabPage').then((m) => ({ default: m.WarehouseLabPage }))
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
              <Route path="/learn/unit-2/bfs" element={<BfsConceptPage />} />
              <Route path="/lab/warehouse-bfs" element={<WarehouseLabPage />} />
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
