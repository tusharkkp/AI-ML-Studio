import { Link, useLocation } from 'react-router-dom';
import { Compass, Moon, Sun } from 'lucide-react';
import { useProgressStore } from '@/features/progress/useProgressStore';

export function Navbar() {
  const location = useLocation();
  const theme = useProgressStore((state) => state.theme);
  const toggleTheme = useProgressStore((state) => state.toggleTheme);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Unit 1: AI Basics', href: '/learn/unit-1' },
    { name: 'Unit 2: BFS', href: '/learn/unit-2/bfs' },
    { name: 'Lab Sandbox', href: '/lab/warehouse-bfs' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-studio-200 bg-white/90 backdrop-blur-md dark:border-studio-800 dark:bg-studio-950/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-unit-2 text-white shadow-subtle group-hover:scale-105 transition-transform">
            <Compass className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-base tracking-tight text-studio-900 dark:text-studio-50">
              AIML Studio
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-unit-2">
              MIT AOE · 2304322T
            </span>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-studio-100 text-unit-2 dark:bg-studio-800 dark:text-unit-2 font-semibold'
                    : 'text-studio-600 hover:text-studio-900 hover:bg-studio-50 dark:text-studio-400 dark:hover:text-studio-100 dark:hover:bg-studio-900'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Theme toggle & Mobile menu button */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-studio-200 text-studio-600 hover:bg-studio-100 dark:border-studio-800 dark:text-studio-300 dark:hover:bg-studio-800 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
