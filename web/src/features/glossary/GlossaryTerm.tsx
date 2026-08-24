import { useState } from 'react';
import { GLOSSARY } from './glossaryData';

export interface GlossaryTermProps {
  term: string;
  displayText?: string;
}

export function GlossaryTerm({ term, displayText }: GlossaryTermProps) {
  const [isOpen, setIsOpen] = useState(false);
  const key = term.toLowerCase().trim();
  const entry = GLOSSARY[key];

  if (!entry) {
    return <span>{displayText ?? term}</span>;
  }

  return (
    <span
      className="relative inline-block cursor-help"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
      tabIndex={0}
      role="button"
      aria-expanded={isOpen}
      aria-haspopup="dialog"
    >
      <span className="border-b border-dotted border-unit-2 font-medium text-studio-900 dark:text-studio-100 hover:text-unit-2 transition-colors">
        {displayText ?? term}
      </span>

      {isOpen && (
        <span
          role="dialog"
          className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-xl border border-card-edge bg-card-fill backdrop-blur-md p-3 text-left text-xs pointer-events-none animate-in fade-in zoom-in-95 duration-150"
        >
          <span className="block font-montserrat font-semibold text-foreground mb-1">
            {entry.term}
          </span>
          <span className="block text-studio-600 dark:text-studio-300 leading-relaxed font-normal">
            {entry.definition}
          </span>
          {entry.relatedTerms && entry.relatedTerms.length > 0 && (
            <span className="mt-2 block border-t border-studio-100 pt-1.5 text-[10px] text-studio-400 dark:border-studio-800">
              Related: {entry.relatedTerms.join(', ')}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
