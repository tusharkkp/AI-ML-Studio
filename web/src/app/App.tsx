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
import { ExpertSystemsPage } from '@/pages/ExpertSystemsPage';
import { MedicalDiagnosisCaseStudy } from '@/pages/MedicalDiagnosisCaseStudy';
import { SelfDrivingCaseStudy } from '@/pages/SelfDrivingCaseStudy';
import { EthicsImpactPage } from '@/pages/EthicsImpactPage';
import { ChatbotPromptEngPage } from '@/pages/ChatbotPromptEngPage';
import { AgiFrontiersPage } from '@/pages/AgiFrontiersPage';
import { Unit1ExamPage } from '@/pages/Unit1ExamPage';
import { Unit1CheatSheetPage } from '@/pages/Unit1CheatSheetPage';
import { BfsConceptPage } from '@/pages/BfsConceptPage';
import { WarehouseLabPage } from '@/pages/WarehouseLabPage';
import { Backdrop } from '@/components/layout/Backdrop';

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
            <Route path="/learn/unit-1/expert-systems" element={<ExpertSystemsPage />} />
            <Route path="/case-studies/medical-diagnosis" element={<MedicalDiagnosisCaseStudy />} />
            <Route path="/case-studies/self-driving-vehicle" element={<SelfDrivingCaseStudy />} />
            <Route path="/learn/unit-1/ethics-impact" element={<EthicsImpactPage />} />
            <Route
              path="/learn/unit-1/chatbot-prompt-engineering"
              element={<ChatbotPromptEngPage />}
            />
            <Route path="/learn/unit-1/agi" element={<AgiFrontiersPage />} />
            <Route path="/learn/unit-1/exam" element={<Unit1ExamPage />} />
            <Route path="/cheatsheets/unit-1" element={<Unit1CheatSheetPage />} />
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
