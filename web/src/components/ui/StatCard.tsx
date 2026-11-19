import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Card } from './Card';

export interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon?: React.ReactNode;
  unitAccent?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function StatCard({
  label,
  value,
  description,
  trend,
  icon,
  unitAccent,
  className,
}: StatCardProps) {
  return (
    <Card unitAccent={unitAccent} className={twMerge(clsx('p-4 space-y-2', className))}>
      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span className="uppercase tracking-wider font-semibold truncate">{label}</span>
        {icon && <div className="text-muted-foreground size-4 shrink-0">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold font-manrope text-foreground tracking-tight">
          {value}
        </div>
        {trend && (
          <span
            className={clsx(
              'text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded',
              trend.isPositive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            )}
          >
            {trend.value}
          </span>
        )}
      </div>

      {description && (
        <p className="text-[11px] text-muted-foreground leading-relaxed pt-0.5">{description}</p>
      )}
    </Card>
  );
}
