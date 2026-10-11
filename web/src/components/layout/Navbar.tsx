import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Moon,
  Sun,
  ChevronDown,
  Menu,
  X,
  BookOpen,
  FlaskConical,
  FileText,
  GitCompare,
  GraduationCap,
} from 'lucide-react';
import { useProgressStore } from '@/features/progress/useProgressStore';

interface UnitNavItem {
  id: string;
  num: string;
  badge: string;
  name: string;
  href: string;
  desc: string;
}

const UNITS: UnitNavItem[] = [
  {
    id: 'u1',
    num: 'Unit 1',
    badge: 'U1',
    name: 'Basics of AI',
    href: '/learn/unit-1',
    desc: 'Intelligent agents, PEAS framework & logic reasoning',
  },
  {
    id: 'u2',
    num: 'Unit 2',
    badge: 'U2',
    name: 'AI Search Strategies',
    href: '/learn/unit-2',
    desc: 'Uninformed, A*, local search, CSP & adversarial minimax',
  },
  {
    id: 'u3',
    num: 'Unit 3',
    badge: 'U3',
    name: 'ML Fundamentals',
    href: '/learn/unit-3',
    desc: 'Linear regression, cost surfaces & gradient descent',
  },
  {
    id: 'u4',
    num: 'Unit 4',
    badge: 'U4',
    name: 'Instances & Probabilistic Models',
    href: '/learn/unit-4',
    desc: 'Bayes theorem, logistic regression, ROC-AUC & k-NN',
  },
  {
    id: 'u5',
    num: 'Unit 5',
    badge: 'U5',
    name: 'Linear & Decision Models',
    href: '/learn/unit-5',
    desc: 'Decision trees, SVM hyperplanes, kernels & ensembles',
  },
];

interface CheatsheetNavItem {
  id: string;
  badge: string;
  unit: string;
  title: string;
  href: string;
}

const CHEATSHEET_ITEMS: CheatsheetNavItem[] = [
  {
    id: 'cs-all',
    badge: 'HUB',
    unit: 'All Units',
    title: 'Quick Revision Directory',
    href: '/cheatsheets',
  },
  {
    id: 'cs-u1',
    badge: 'U1',
    unit: 'Unit 1',
    title: 'Basics of AI Cheat Sheet',
    href: '/cheatsheets/unit-1',
  },
  {
    id: 'cs-u2',
    badge: 'U2',
    unit: 'Unit 2',
    title: 'AI Search Strategies Cheat Sheet',
    href: '/cheatsheets/unit-2',
  },
  {
    id: 'cs-u3',
    badge: 'U3',
    unit: 'Unit 3',
    title: 'ML Fundamentals Cheat Sheet',
    href: '/cheatsheets/unit-3',
  },
  {
    id: 'cs-u4',
    badge: 'U4',
    unit: 'Unit 4',
    title: 'Probabilistic Models Cheat Sheet',
    href: '/cheatsheets/unit-4',
  },
  {
    id: 'cs-u5',
    badge: 'U5',
    unit: 'Unit 5',
    title: 'Linear & Decision Models Cheat Sheet',
    href: '/cheatsheets/unit-5',
  },
];

interface LabNavItem {
  id: string;
  badge: string;
  title: string;
  desc: string;
  href: string;
}

const FLAGSHIP_LABS: LabNavItem[] = [
  {
    id: 'lab-all',
    badge: 'HUB',
    title: 'Browse All 15+ Labs Hub',
    desc: 'Search & filter interactive laboratories across all units',
    href: '/lab',
  },
  {
    id: 'lab-bfs',
    badge: 'U2',
    title: 'Warehouse Robot BFS',
    desc: '2D grid world pathfinding & FIFO queue frontier step playback',
    href: '/lab/warehouse-bfs',
  },
  {
    id: 'lab-grad',
    badge: 'U3',
    title: 'Gradient Descent Dynamics',
    desc: '2D/3D loss contours, learning rate η tuning & divergence',
    href: '/learn/unit-3/gradient-descent',
  },
  {
    id: 'lab-logistic',
    badge: 'U4',
    title: 'Logistic Decision Boundary',
    desc: '2D decision boundary studio with XOR failure modes',
    href: '/learn/unit-4/logistic-regression',
  },
  {
    id: 'lab-roc',
    badge: 'U4',
    title: 'ROC Curve & AUC Sweeper',
    desc: 'Dual Gaussian densities & sweeping threshold τ',
    href: '/learn/unit-4/roc-auc',
  },
  {
    id: 'lab-dt',
    badge: 'U5',
    title: 'Decision Tree Split Builder',
    desc: 'Orthogonal axis splits, entropy & Gini reduction',
    href: '/learn/unit-5/decision-trees',
  },
  {
    id: 'lab-svm',
    badge: 'U5',
    title: 'SVM Maximum Margin Studio',
    desc: 'Separating hyperplane, margin gutters & support vector halos',
    href: '/learn/unit-5/svm-fundamentals',
  },
  {
    id: 'lab-kernel',
    badge: 'U5',
    title: 'SVM Kernel Trick 3D Lift',
    desc: '2D non-linear rings lifted to 3D parabolic space',
    href: '/learn/unit-5/svm-kernels',
  },
  {
    id: 'lab-rf',
    badge: 'U5',
    title: 'Random Forest & OOB Error',
    desc: 'Bootstrap aggregation, subspace sampling & boundary smoothing',
    href: '/learn/unit-5/bagging-random-forests',
  },
];

export function Navbar() {
  const location = useLocation();
  const theme = useProgressStore((state) => state.theme);
  const toggleTheme = useProgressStore((state) => state.toggleTheme);
  const [scrolled, setScrolled] = useState(false);
  const [unitsOpen, setUnitsOpen] = useState(false);
  const [labsOpen, setLabsOpen] = useState(false);
  const [cheatsheetsOpen, setCheatsheetsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unitsRef = useRef<HTMLDivElement>(null);
  const labsRef = useRef<HTMLDivElement>(null);
  const cheatsheetsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click or escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (unitsRef.current && !unitsRef.current.contains(target)) {
        setUnitsOpen(false);
      }
      if (labsRef.current && !labsRef.current.contains(target)) {
        setLabsOpen(false);
      }
      if (cheatsheetsRef.current && !cheatsheetsRef.current.contains(target)) {
        setCheatsheetsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setUnitsOpen(false);
        setLabsOpen(false);
        setCheatsheetsOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setUnitsOpen(false);
    setLabsOpen(false);
    setCheatsheetsOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isUnitsActive = location.pathname.startsWith('/learn/unit-');
  const isLabsActive = location.pathname.startsWith('/lab');
  const isCheatsheetsActive = location.pathname.startsWith('/cheatsheets');

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-[backdrop-filter,background-color,border-color] duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-12">
        {/* Brand: Onest wordmark with signature orange dot */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex flex-col">
            <span className="font-brand text-xl font-medium tracking-tight text-foreground flex items-center">
              AIML Studio
              <span className="inline-block size-1.5 rounded-full bg-brand ml-1 animate-pulse" />
            </span>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-sans">
              MIT AOE · Rev. 2023 NEP
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-1 font-sans">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:text-brand ${
              location.pathname === '/'
                ? 'text-foreground font-semibold dark:text-white'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Home
          </Link>

          {/* Units Dropdown */}
          <div className="relative" ref={unitsRef}>
            <button
              type="button"
              onClick={() => {
                setUnitsOpen(!unitsOpen);
                setLabsOpen(false);
                setCheatsheetsOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:text-brand ${
                isUnitsActive || unitsOpen
                  ? 'text-foreground font-semibold dark:text-white'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
              aria-expanded={unitsOpen}
              aria-haspopup="true"
            >
              <BookOpen className="size-4" />
              <span>Units</span>
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ${unitsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {unitsOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-80 rounded-xl border border-orange-50/15 dark:border-orange-50/15 border-amber-900/15 bg-[#0c0a09]/95 dark:bg-[#0c0a09]/95 bg-white/95 backdrop-blur-md p-2 shadow-none z-50"
                role="menu"
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Curriculum Units (NEP 2023)
                </div>
                <div className="space-y-1">
                  {UNITS.map((unit) => {
                    const isCurrent = location.pathname.startsWith(unit.href);
                    return (
                      <Link
                        key={unit.id}
                        to={unit.href}
                        onClick={() => setUnitsOpen(false)}
                        className={`flex items-start gap-3 rounded-lg p-2.5 transition-colors ${
                          isCurrent
                            ? 'bg-neutral-100 dark:bg-white/10 text-foreground dark:text-white'
                            : 'hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300'
                        }`}
                        role="menuitem"
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center rounded border border-orange-50/20 bg-neutral-200 dark:bg-black/40 text-[10px] font-mono font-bold text-neutral-800 dark:text-neutral-200">
                          {unit.badge}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold font-manrope">
                            {unit.num}: {unit.name}
                          </span>
                          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                            {unit.desc}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Lab Sandbox Dropdown */}
          <div className="relative" ref={labsRef}>
            <button
              type="button"
              onClick={() => {
                setLabsOpen(!labsOpen);
                setUnitsOpen(false);
                setCheatsheetsOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:text-brand ${
                isLabsActive || labsOpen
                  ? 'text-foreground font-semibold dark:text-white'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
              aria-expanded={labsOpen}
              aria-haspopup="true"
            >
              <FlaskConical className="size-4" />
              <span>Lab Sandbox</span>
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ${labsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {labsOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-84 rounded-xl border border-orange-50/15 dark:border-orange-50/15 border-amber-900/15 bg-[#0c0a09]/95 dark:bg-[#0c0a09]/95 bg-white/95 backdrop-blur-md p-2 shadow-none z-50 max-h-[80vh] overflow-y-auto"
                role="menu"
              >
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-orange-50/10 mb-1">
                  <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Interactive Laboratories
                  </span>
                  <Link
                    to="/lab"
                    onClick={() => setLabsOpen(false)}
                    className="text-[10px] font-mono text-brand hover:underline"
                  >
                    View All &rarr;
                  </Link>
                </div>
                <div className="space-y-1">
                  {FLAGSHIP_LABS.map((lab) => {
                    const isCurrent = location.pathname === lab.href;
                    return (
                      <Link
                        key={lab.id}
                        to={lab.href}
                        onClick={() => setLabsOpen(false)}
                        className={`flex items-start gap-3 rounded-lg p-2.5 transition-colors ${
                          isCurrent
                            ? 'bg-neutral-100 dark:bg-white/10 text-foreground dark:text-white'
                            : 'hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300'
                        }`}
                        role="menuitem"
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center rounded border border-orange-50/20 bg-neutral-200 dark:bg-black/40 text-[10px] font-mono font-bold text-neutral-800 dark:text-neutral-200">
                          {lab.badge}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold font-manrope">{lab.title}</span>
                          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                            {lab.desc}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Cheat Sheets Dropdown */}
          <div className="relative" ref={cheatsheetsRef}>
            <button
              type="button"
              onClick={() => {
                setCheatsheetsOpen(!cheatsheetsOpen);
                setUnitsOpen(false);
                setLabsOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:text-brand ${
                isCheatsheetsActive || cheatsheetsOpen
                  ? 'text-foreground font-semibold dark:text-white'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
              aria-expanded={cheatsheetsOpen}
              aria-haspopup="true"
            >
              <FileText className="size-4" />
              <span>Cheat Sheets</span>
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ${cheatsheetsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {cheatsheetsOpen && (
              <div
                className="absolute top-full right-0 mt-2 w-72 rounded-xl border border-orange-50/15 dark:border-orange-50/15 border-amber-900/15 bg-[#0c0a09]/95 dark:bg-[#0c0a09]/95 bg-white/95 backdrop-blur-md p-2 shadow-none z-50"
                role="menu"
              >
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-orange-50/10 mb-1">
                  <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Exam Revision Sheets
                  </span>
                  <Link
                    to="/cheatsheets"
                    onClick={() => setCheatsheetsOpen(false)}
                    className="text-[10px] font-mono text-brand hover:underline"
                  >
                    All Hub &rarr;
                  </Link>
                </div>
                <div className="space-y-1">
                  {CHEATSHEET_ITEMS.map((item) => {
                    const isCurrent = location.pathname === item.href;
                    return (
                      <Link
                        key={item.id}
                        to={item.href}
                        onClick={() => setCheatsheetsOpen(false)}
                        className={`flex items-center gap-3 rounded-lg p-2.5 transition-colors ${
                          isCurrent
                            ? 'bg-neutral-100 dark:bg-white/10 text-foreground dark:text-white'
                            : 'hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300'
                        }`}
                        role="menuitem"
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center rounded border border-orange-50/20 bg-neutral-200 dark:bg-black/40 text-[10px] font-mono font-bold text-neutral-800 dark:text-neutral-200">
                          {item.badge}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold font-manrope">{item.title}</span>
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                            {item.unit}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Algorithm Chooser / Compare */}
          <Link
            to="/compare"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:text-brand ${
              location.pathname === '/compare'
                ? 'text-foreground font-semibold dark:text-white'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <GitCompare className="size-4" />
            <span>Compare</span>
          </Link>

          {/* Practice & Exams */}
          <Link
            to="/practice"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:text-brand ${
              location.pathname === '/practice'
                ? 'text-foreground font-semibold dark:text-white'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <GraduationCap className="size-4" />
            <span>Practice</span>
          </Link>
        </div>

        {/* Right side: Theme toggle + Mobile Menu Button */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/60 text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? (
              <Moon className="h-3.5 w-3.5 text-neutral-700" />
            ) : (
              <Sun className="h-3.5 w-3.5 text-orange-200" />
            )}
          </button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/60 text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-md px-6 py-4 space-y-4 max-h-[85vh] overflow-y-auto">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-foreground hover:text-brand"
          >
            Home
          </Link>

          <div>
            <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
              Units
            </div>
            <div className="space-y-1.5 pl-2 border-l border-border">
              {UNITS.map((u) => (
                <Link
                  key={u.id}
                  to={u.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs py-1 text-neutral-700 dark:text-neutral-300 hover:text-brand"
                >
                  <span className="font-semibold text-foreground dark:text-white mr-1.5">
                    {u.badge}:
                  </span>
                  {u.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
              <span>Interactive Labs</span>
              <Link
                to="/lab"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[10px] font-mono text-brand"
              >
                All &rarr;
              </Link>
            </div>
            <div className="space-y-1.5 pl-2 border-l border-border">
              <Link
                to="/lab"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs py-1 font-semibold text-brand"
              >
                Browse All 15+ Labs Hub
              </Link>
              <Link
                to="/lab/warehouse-bfs"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs py-1 text-neutral-700 dark:text-neutral-300 hover:text-brand"
              >
                Warehouse Robot BFS
              </Link>
              <Link
                to="/learn/unit-3/gradient-descent"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs py-1 text-neutral-700 dark:text-neutral-300 hover:text-brand"
              >
                Gradient Descent Dynamics
              </Link>
              <Link
                to="/learn/unit-5/svm-fundamentals"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs py-1 text-neutral-700 dark:text-neutral-300 hover:text-brand"
              >
                SVM Maximum Margin Studio
              </Link>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
              <span>Revision Cheat Sheets</span>
              <Link
                to="/cheatsheets"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[10px] font-mono text-brand"
              >
                All &rarr;
              </Link>
            </div>
            <div className="space-y-1.5 pl-2 border-l border-border">
              {CHEATSHEET_ITEMS.map((c) => (
                <Link
                  key={c.id}
                  to={c.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs py-1 text-neutral-700 dark:text-neutral-300 hover:text-brand"
                >
                  <span className="font-semibold text-foreground dark:text-white mr-1.5">
                    {c.badge}:
                  </span>
                  {c.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 space-y-1">
            <Link
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-1 text-xs font-semibold text-foreground dark:text-white hover:text-brand"
            >
              <GitCompare className="size-3.5 text-brand" />
              <span>Algorithm Chooser &amp; Comparison</span>
            </Link>
            <Link
              to="/practice"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-1 text-xs font-semibold text-foreground dark:text-white hover:text-brand"
            >
              <GraduationCap className="size-3.5 text-brand" />
              <span>Practice &amp; Mock Exams</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
