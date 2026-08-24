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
    // ChaiUI status: text and thin outline, never heavy fills
    default:
      'bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-800',
    outline:
      'bg-transparent border border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300',
    success:
      'bg-transparent text-emerald-600 border-emerald-500/30 dark:text-emerald-400 dark:border-emerald-500/30',
    warning:
      'bg-transparent text-amber-600 border-amber-500/30 dark:text-amber-400 dark:border-amber-500/30',
    danger:
      'bg-transparent text-rose-600 border-rose-500/30 dark:text-rose-400 dark:border-rose-500/30',
    unit: unit
      ? `bg-transparent text-unit-${unit} border-unit-${unit}/30`
      : 'bg-transparent text-neutral-400 border-neutral-700',
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

/**
 * Signature ChaiUI AnimatedBadge: 1px rotating glint along border
 */
export function AnimatedBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={twMerge('relative inline-flex w-fit overflow-hidden rounded-full p-px', className)}
    >
      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 h-5 w-[320px] rounded-full bg-gradient-to-r from-transparent via-transparent to-orange-500 motion-safe:animate-[chai-spin_4s_linear_infinite]"
        style={{ transform: 'translate(-50%,-50%)' }}
      />
      <span className="relative z-10 rounded-full bg-neutral-50 px-4 py-1.5 text-xs sm:text-sm font-medium text-neutral-800 dark:bg-[#121212] dark:text-neutral-100">
        {children}
      </span>
    </span>
  );
}
