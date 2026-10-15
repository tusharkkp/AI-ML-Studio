import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSearchItems } from './searchIndex';
import { Badge } from '@/components/ui/Badge';
import {
  Search,
  X,
  ArrowRight,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const allItems = useMemo(() => getAllSearchItems(), []);

  // Filter items
  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    return allItems
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'Concept' && item.category !== 'Concept') return false;
          if (selectedCategory === 'Case Study' && item.category !== 'Case Study') return false;
          if (
            selectedCategory === 'Exam' &&
            item.category !== 'Exam' &&
            item.category !== 'Cheat Sheet'
          )
            return false;
          if (selectedCategory === 'Glossary' && item.category !== 'Glossary') return false;
          if (selectedCategory === 'Hub' && item.category !== 'Hub') return false;
        }

        if (!q) return true;

        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.desc.toLowerCase().includes(q);
        const matchesKeywords = item.keywords.some((k) => k.includes(q));
        const matchesUnit = item.unitBadge ? item.unitBadge.toLowerCase().includes(q) : false;

        return matchesTitle || matchesDesc || matchesKeywords || matchesUnit;
      })
      .slice(0, 40); // Cap to 40 for optimal rendering performance
  }, [allItems, query, selectedCategory]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === 'Enter') {
        if (filteredItems[selectedIndex]) {
          e.preventDefault();
          const target = filteredItems[selectedIndex];
          navigate(target.href);
          onClose();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, navigate, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-orange-50/20 bg-neutral-950/95 backdrop-blur-xl shadow-none overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Global Syllabus Search"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-orange-50/15">
          <Search className="size-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search syllabus concepts, algorithms, labs, formulas (e.g. A*, Gini, OLS)..."
            className="flex-1 bg-transparent text-sm sm:text-base text-foreground placeholder:text-neutral-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-neutral-500 hover:text-neutral-300 transition-colors"
              aria-label="Clear query"
            >
              <X className="size-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded border border-orange-50/15 bg-neutral-900 text-[10px] font-mono text-neutral-400">
            Esc
          </kbd>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-orange-50/10 bg-neutral-900/40 overflow-x-auto text-xs font-mono">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'Concept', label: 'Concepts' },
            { id: 'Case Study', label: 'Case Studies' },
            { id: 'Exam', label: 'Exams & Sheets' },
            { id: 'Glossary', label: 'Definitions' },
            { id: 'Hub', label: 'Portals' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-brand text-white font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-orange-50/5"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400 space-y-2">
              <p>No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-[11px] text-neutral-500 font-mono">
                Try searching by topic name, formula keyword, or unit number.
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    navigate(item.href);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-start justify-between gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-neutral-800/80 text-foreground border border-orange-50/20'
                      : 'hover:bg-neutral-900/60 text-neutral-300'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`size-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${
                        item.category === 'Concept'
                          ? 'border-brand/20 bg-brand/10 text-brand'
                          : item.category === 'Case Study'
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                            : item.category === 'Exam'
                              ? 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                              : item.category === 'Glossary'
                                ? 'border-blue-500/20 bg-blue-500/10 text-blue-400'
                                : 'border-purple-500/20 bg-purple-500/10 text-purple-400'
                      }`}
                    >
                      {item.category === 'Concept' && <BookOpen className="size-4" />}
                      {item.category === 'Case Study' && <FlaskConical className="size-4" />}
                      {item.category === 'Exam' && <GraduationCap className="size-4" />}
                      {item.category === 'Cheat Sheet' && <FileText className="size-4" />}
                      {item.category === 'Glossary' && <Sparkles className="size-4" />}
                      {item.category === 'Hub' && <Layers className="size-4" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-manrope text-xs sm:text-sm font-semibold truncate text-foreground">
                          {item.title}
                        </span>
                        {item.unitBadge && (
                          <Badge variant="outline" size="sm">
                            {item.unitBadge}
                          </Badge>
                        )}
                        <span className="text-[10px] font-mono text-neutral-500 uppercase">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-montserrat truncate mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`size-4 shrink-0 transition-transform ${
                      isSelected ? 'text-brand translate-x-0.5' : 'text-neutral-600'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="p-3 border-t border-orange-50/15 bg-neutral-950 flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-orange-50/10 bg-neutral-900 text-neutral-400">
                &uarr;&darr;
              </kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-orange-50/10 bg-neutral-900 text-neutral-400">
                &crarr;
              </kbd>
              <span>open</span>
            </span>
          </div>

          <div>
            Showing <span className="text-neutral-300 font-semibold">{filteredItems.length}</span>{' '}
            matches
          </div>
        </div>
      </div>
    </div>
  );
}
