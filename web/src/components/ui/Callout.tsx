import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Lightbulb, AlertTriangle, HelpCircle, BookOpen } from 'lucide-react';

export type CalloutType = 'tip' | 'warning' | 'misconception' | 'note';

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: CalloutType;
  title?: string;
}

export function Callout({ type = 'note', title, className, children, ...props }: CalloutProps) {
  const configs = {
    tip: {
      border: 'border-emerald-300 dark:border-emerald-800',
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      titleColor: 'text-emerald-900 dark:text-emerald-200',
      Icon: Lightbulb,
      defaultTitle: 'Pro Tip',
    },
    warning: {
      border: 'border-amber-300 dark:border-amber-800',
      bg: 'bg-amber-50/70 dark:bg-amber-950/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      titleColor: 'text-amber-900 dark:text-amber-200',
      Icon: AlertTriangle,
      defaultTitle: 'Watch Out',
    },
    misconception: {
      border: 'border-rose-300 dark:border-rose-800',
      bg: 'bg-rose-50/70 dark:bg-rose-950/30',
      iconColor: 'text-rose-600 dark:text-rose-400',
      titleColor: 'text-rose-900 dark:text-rose-200',
      Icon: HelpCircle,
      defaultTitle: 'Common Misconception',
    },
    note: {
      border: 'border-studio-300 dark:border-studio-700',
      bg: 'bg-studio-100/70 dark:bg-studio-800/40',
      iconColor: 'text-studio-600 dark:text-studio-400',
      titleColor: 'text-studio-900 dark:text-studio-100',
      Icon: BookOpen,
      defaultTitle: 'Note',
    },
  };

  const config = configs[type];
  const IconComponent = config.Icon;

  return (
    <div
      className={twMerge(
        clsx('my-4 rounded-xl border p-4 transition-colors', config.border, config.bg, className)
      )}
      role="region"
      aria-label={title ?? config.defaultTitle}
      {...props}
    >
      <div className="flex items-start gap-3">
        <IconComponent
          className={clsx('h-5 w-5 mt-0.5 flex-shrink-0', config.iconColor)}
          aria-hidden="true"
        />
        <div className="flex-1 text-sm leading-relaxed text-studio-700 dark:text-studio-300">
          <p className={clsx('font-display font-bold mb-1', config.titleColor)}>
            {title ?? config.defaultTitle}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}
