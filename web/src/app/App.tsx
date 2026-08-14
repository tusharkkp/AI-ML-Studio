import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LandingPage } from '@/pages/LandingPage';
import { Unit1LandingPage } from '@/pages/Unit1LandingPage';
import { AiHistoryPage } from '@/pages/AiHistoryPage';
import { AiTypesPage } from '@/pages/AiTypesPage';
import { IntelligentAgentsPage } from '@/pages/IntelligentAgentsPage';
import { KnowledgeRepresentationPage } from '@/pages/KnowledgeRepresentationPage';
import { FirstOrderLogicPage } from '@/pages/FirstOrderLogicPage';
import { RuleBasedReasoningPage } from '@/pages/RuleBasedReasoningPage';
import { BfsConceptPage } from '@/pages/BfsConceptPage';
import { WarehouseLabPage } from '@/pages/WarehouseLabPage';

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl font-extrabold text-studio-900 dark:text-studio-50">
        404 — Topic Not Found
      </h1>
      <p className="mt-3 text-studio-600 dark:text-studio-400">
        The concept you are looking for has not been explored yet or the path has changed.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-unit-2 text-white font-medium text-sm hover:opacity-90"
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
      <div className="flex min-h-screen flex-col bg-studio-50 text-studio-900 dark:bg-studio-950 dark:text-studio-50">
        <Navbar />
        <main className="flex-1">
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
            <Route path="/learn/unit-1/rule-based-reasoning" element={<RuleBasedReasoningPage />} />
            <Route path="/learn/unit-2/bfs" element={<BfsConceptPage />} />
            <Route path="/lab/warehouse-bfs" element={<WarehouseLabPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
