import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useProgressStore } from '@/features/progress/useProgressStore';

export function Navbar() {
  const location = useLocation();
  const theme = useProgressStore((state) => state.theme);
  const toggleTheme = useProgressStore((state) => state.toggleTheme);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Unit 1: AI Basics', href: '/learn/unit-1' },
    { name: 'Unit 2: Search', href: '/learn/unit-2' },
    { name: 'Lab Sandbox', href: '/lab/warehouse-bfs' },
    { name: 'Cheat Sheet', href: '/cheatsheets/unit-1' },
  ];

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

        {/* Links */}
        <div className="hidden md:flex items-center space-x-1 font-sans">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:text-brand ${
                  isActive
                    ? 'text-foreground font-semibold dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Theme toggle (ChaiUI style half-circle pill) */}
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
        </div>
      </nav>
    </header>
  );
}
