import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, ChevronDown, Menu, X, BookOpen, FlaskConical, FileText } from 'lucide-react';
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

export function Navbar() {
  const location = useLocation();
  const theme = useProgressStore((state) => state.theme);
  const toggleTheme = useProgressStore((state) => state.toggleTheme);
  const [scrolled, setScrolled] = useState(false);
  const [unitsOpen, setUnitsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click or escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUnitsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setUnitsOpen(false);
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
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isUnitsActive = location.pathname.startsWith('/learn/unit-');

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
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setUnitsOpen(!unitsOpen)}
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

          <Link
            to="/lab/warehouse-bfs"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:text-brand ${
              location.pathname.startsWith('/lab')
                ? 'text-foreground font-semibold dark:text-white'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <FlaskConical className="size-4" />
            <span>Lab Sandbox</span>
          </Link>

          <Link
            to="/cheatsheets/unit-1"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:text-brand ${
              location.pathname.startsWith('/cheatsheets')
                ? 'text-foreground font-semibold dark:text-white'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <FileText className="size-4" />
            <span>Cheat Sheets</span>
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
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-md px-6 py-4 space-y-4">
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

          <div className="pt-2 border-t border-border/50 flex flex-col gap-2">
            <Link
              to="/lab/warehouse-bfs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-brand"
            >
              <FlaskConical className="size-3.5" />
              <span>Lab Sandbox</span>
            </Link>
            <Link
              to="/cheatsheets/unit-1"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-brand"
            >
              <FileText className="size-3.5" />
              <span>Cheat Sheets</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
