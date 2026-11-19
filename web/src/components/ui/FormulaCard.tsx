import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Copy, Check } from 'lucide-react';
import { Card } from './Card';

export interface FormulaCardProps {
  title?: string;
  formula: React.ReactNode;
  latexCode?: string;
  description?: string;
  variables?: { name: string; desc: string }[];
  className?: string;
}

export function FormulaCard({
  title,
  formula,
  latexCode,
  description,
  variables,
  className,
}: FormulaCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!latexCode) return;
    navigator.clipboard.writeText(latexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={twMerge(clsx('p-4 space-y-3 bg-card/80 backdrop-blur-sm', className))}>
      {title && (
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
          {latexCode && (
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
              title="Copy LaTeX formula"
              aria-label="Copy LaTeX formula"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>LaTeX</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Formula Display Area with Horizontal Scrolling */}
      <div className="w-full overflow-x-auto py-2 text-center text-foreground font-mono">
        <div className="inline-block min-w-full text-center">{formula}</div>
      </div>

      {description && (
        <p className="text-xs text-muted-foreground font-sans leading-relaxed pt-1 border-t border-border/40">
          {description}
        </p>
      )}

      {variables && variables.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border/40 text-xs font-sans">
          {variables.map((v, idx) => (
            <div key={idx} className="flex items-start gap-1.5">
              <span className="font-mono font-bold text-foreground text-[11px] shrink-0">
                {v.name}:
              </span>
              <span className="text-muted-foreground text-[11px] leading-snug">{v.desc}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
