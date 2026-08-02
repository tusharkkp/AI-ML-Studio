import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger' | 'unit';
  unit?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  unit,
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  const variantStyles = {
    default:
      'bg-studio-100 text-studio-800 dark:bg-studio-800 dark:text-studio-200 border-transparent',
    outline:
      'bg-transparent border border-studio-300 text-studio-700 dark:border-studio-700 dark:text-studio-300',
    success:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    warning:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    danger:
      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    unit: unit
      ? `bg-unit-${unit}/10 text-unit-${unit} border-unit-${unit}/30 dark:bg-unit-${unit}/20`
      : 'bg-unit-2/10 text-unit-2 border-unit-2/30',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-full border tracking-wide uppercase',
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}
