import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GLOSSARY } from '@/features/glossary/glossaryData';
import { Search, BookOpen, ArrowUpRight, Filter, X, Layers, Sparkles } from 'lucide-react';

const UNIT_TABS = [
  { id: 'all', label: 'All Units' },
  { id: '1', label: 'U1: Basics' },
  { id: '2', label: 'U2: Search' },
  { id: '3', label: 'U3: ML Fundamentals' },
  { id: '4', label: 'U4: Probabilistic' },
  { id: '5', label: 'U5: Linear & Trees' },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('all');

  const entriesList = useMemo(() => {
    return Object.entries(GLOSSARY).map(([key, entry]) => ({
      key,
      ...entry,
    }));
  }, []);

  // Compute available letters across all entries
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    entriesList.forEach((e) => {
      const first = e.term.charAt(0).toUpperCase();
      if (first >= 'A' && first <= 'Z') {
        letters.add(first);
      }
    });
    return letters;
  }, [entriesList]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entriesList
      .filter((entry) => {
        // Unit filter
        if (selectedUnit !== 'all' && entry.unit.toString() !== selectedUnit) {
          return false;
        }

        // Letter filter
        if (selectedLetter !== 'all') {
          const firstLetter = entry.term.charAt(0).toUpperCase();
          if (firstLetter !== selectedLetter) return false;
        }

        // Search query filter
        if (searchQuery.trim() !== '') {
          const query = searchQuery.toLowerCase().trim();
          const matchesTerm = entry.term.toLowerCase().includes(query);
          const matchesDef = entry.definition.toLowerCase().includes(query);
          const matchesCategory = entry.category?.toLowerCase().includes(query) ?? false;
          const matchesRelated =
            entry.relatedTerms?.some((r) => r.toLowerCase().includes(query)) ?? false;
          return matchesTerm || matchesDef || matchesCategory || matchesRelated;
        }

        return true;
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [entriesList, selectedUnit, selectedLetter, searchQuery]);

  const handleRelatedClick = (relatedTermKey: string) => {
    setSearchQuery(relatedTermKey);
    setSelectedUnit('all');
    setSelectedLetter('all');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedUnit('all');
    setSelectedLetter('all');
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-12 space-y-10">
      {/* 1. Header Banner */}
      <div className="border-b border-orange-50/15 pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="unit">Syllabus Glossary</Badge>
          <Badge variant="outline">MIT AOE Course 2304322T</Badge>
          <Badge variant="outline">Units 1 to 5</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground font-manrope">
          Technical glossary &amp; terminology
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-montserrat leading-relaxed max-w-3xl">
          Quickly search, clarify, and master formal AI and machine learning definitions with{' '}
          <span className="font-montserrat font-medium text-yellow-800 dark:text-orange-100">
            cross-unit mathematical notations, related terminology networks, and direct concept
            links
          </span>
          .
        </p>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by term, formula, category, or keyword (e.g. Heuristic, OLS, Entropy)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-orange-50/15 bg-neutral-900/60 text-sm text-foreground placeholder:text-neutral-500 focus:outline-none focus:border-brand transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {(searchQuery || selectedUnit !== 'all' || selectedLetter !== 'all') && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="text-xs self-start sm:self-auto flex items-center gap-1.5"
            >
              <X className="size-3.5" />
              <span>Reset filters</span>
            </Button>
          )}
        </div>

        {/* Unit Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-mono text-neutral-500 mr-2 flex items-center gap-1">
            <Filter className="size-3" />
            <span>Unit:</span>
          </span>
          {UNIT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedUnit(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-manrope font-semibold transition-all border ${
                selectedUnit === tab.id
                  ? 'border-brand bg-brand text-white shadow-none'
                  : 'border-orange-50/10 bg-black/20 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Alphabet Jump Strip */}
        <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-orange-50/10">
          <span className="text-xs font-mono text-neutral-500 mr-2">Jump:</span>
          <button
            onClick={() => setSelectedLetter('all')}
            className={`size-7 rounded text-[11px] font-mono font-semibold transition-all ${
              selectedLetter === 'all'
                ? 'bg-brand text-white'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
            }`}
          >
            All
          </button>
          {ALPHABET.map((char) => {
            const hasEntries = availableLetters.has(char);
            return (
              <button
                key={char}
                disabled={!hasEntries}
                onClick={() => setSelectedLetter(char)}
                className={`size-7 rounded text-[11px] font-mono font-semibold transition-all ${
                  selectedLetter === char
                    ? 'bg-brand text-white'
                    : hasEntries
                      ? 'text-neutral-300 hover:text-white hover:bg-white/5'
                      : 'text-neutral-700 cursor-not-allowed opacity-40'
                }`}
              >
                {char}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Results Header */}
      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pt-2 border-b border-orange-50/10 pb-3">
        <div>
          Showing <span className="text-foreground font-semibold">{filteredEntries.length}</span> of{' '}
          <span className="text-foreground font-semibold">{entriesList.length}</span> defined terms
        </div>
        {selectedUnit !== 'all' && (
          <div className="flex items-center gap-1 text-brand">
            <Layers className="size-3.5" />
            <span>Filtered to Unit {selectedUnit}</span>
          </div>
        )}
      </div>

      {/* 4. Glossary Cards Grid */}
      {filteredEntries.length === 0 ? (
        <Card className="p-10 text-center border-orange-50/15 bg-neutral-900/30 rounded-xl space-y-4">
          <div className="size-12 rounded-full bg-neutral-800 mx-auto flex items-center justify-center text-neutral-400">
            <BookOpen className="size-6" />
          </div>
          <h3 className="font-manrope text-base font-semibold text-foreground">
            No terms match your search
          </h3>
          <p className="text-xs text-neutral-400 font-montserrat max-w-md mx-auto">
            Try adjusting your search query, selecting another unit, or resetting the active
            filters.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs mx-auto">
            Reset all filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEntries.map((entry) => {
            return (
              <Card
                key={entry.key}
                className="p-5 border-orange-50/15 bg-neutral-900/40 rounded-xl flex flex-col justify-between space-y-4 hover:border-orange-50/30 transition-all backdrop-blur-sm"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-manrope text-base font-bold text-foreground">
                        {entry.term}
                      </h3>
                      {entry.category && (
                        <span className="text-[11px] font-mono text-brand font-medium">
                          {entry.category}
                        </span>
                      )}
                    </div>
                    <Badge variant="outline" size="sm">
                      U{entry.unit}
                    </Badge>
                  </div>

                  {/* Definition */}
                  <p className="text-xs text-neutral-300 font-montserrat leading-relaxed">
                    {entry.definition}
                  </p>

                  {/* Formula / Formal Notation Box if present */}
                  {entry.formula && (
                    <div className="p-2.5 rounded-lg bg-neutral-950/80 border border-orange-50/10 font-mono text-[11px] text-yellow-800 dark:text-orange-100/90 overflow-x-auto">
                      <span className="text-[10px] text-neutral-500 uppercase block font-sans tracking-wider mb-0.5">
                        Mathematical expression:
                      </span>
                      <code>{entry.formula}</code>
                    </div>
                  )}

                  {/* Related Terms Network */}
                  {entry.relatedTerms && entry.relatedTerms.length > 0 && (
                    <div className="pt-2 border-t border-orange-50/10">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1">
                        <Sparkles className="size-3 text-brand" />
                        <span>Connected concepts:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {entry.relatedTerms.map((relKey) => {
                          const relEntry = GLOSSARY[relKey.toLowerCase().trim()];
                          const displayLabel = relEntry ? relEntry.term : relKey;
                          return (
                            <button
                              key={relKey}
                              onClick={() => handleRelatedClick(relKey)}
                              className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-brand/20 hover:text-brand border border-orange-50/10 transition-colors text-neutral-400"
                            >
                              {displayLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Jump Button */}
                {entry.conceptHref && (
                  <div className="pt-3 border-t border-orange-50/10 flex justify-end">
                    <Link to={entry.conceptHref}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-brand hover:text-brand flex items-center gap-1.5 py-1 px-2.5 h-auto"
                      >
                        <span>Study syllabus topic</span>
                        <ArrowUpRight className="size-3.5" />
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
