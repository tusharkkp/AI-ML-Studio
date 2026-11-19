import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { Badge } from './Badge';

export interface PageHeaderProps {
  backHref?: string;
  backLabel?: string;
  unit?: 1 | 2 | 3 | 4 | 5 | 6;
  unitBadge?: string;
  topicBadge?: string;
  readTime?: string;
  title: string;
  description?: string;
  courseOutcomes?: string;
  prerequisites?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  backHref,
  backLabel,
  unit,
  unitBadge,
  topicBadge,
  readTime,
  title,
  description,
  courseOutcomes,
  prerequisites,
  children,
  className = '',
}: PageHeaderProps) {
  return (
    <header className={`mb-8 border-b border-border pb-8 ${className}`}>
      {backHref && (
        <Link
          to={backHref}
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-brand mb-4 transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
          <span>{backLabel ?? 'Back'}</span>
        </Link>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {unitBadge && (
          <Badge variant={unit ? 'unit' : 'outline'} unit={unit}>
            {unitBadge}
          </Badge>
        )}
        {topicBadge && <Badge variant="outline">{topicBadge}</Badge>}
        {readTime && (
          <span className="flex items-center text-xs text-muted-foreground ml-auto font-mono">
            <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            {readTime}
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {children && <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">{children}</div>}
      </div>

      {(courseOutcomes || prerequisites) && (
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border/60 font-sans">
          {courseOutcomes && (
            <span>
              <strong className="text-foreground">Course Outcomes:</strong> {courseOutcomes}
            </span>
          )}
          {prerequisites && (
            <span>
              <strong className="text-foreground">Prerequisites:</strong> {prerequisites}
            </span>
          )}
        </div>
      )}
    </header>
  );
}
