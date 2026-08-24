import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'danger'
    | 'accent'
    | 'solid'
    | 'soft'
    | 'asym'
    | 'asym-mirror';
  size?: 'sm' | 'md' | 'lg';
  unitAccent?: 1 | 2 | 3 | 4 | 5 | 6;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      unitAccent,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] duration-150';

    const sizeStyles = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-4 py-2 gap-2 min-h-[38px]',
      lg: 'text-base px-5 py-2.5 gap-2.5 min-h-[46px]',
    };

    const variantStyles = {
      // Solid ChaiUI action (white on dark)
      primary:
        'btn-asym bg-neutral-900 text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200 focus-visible:ring-neutral-400',
      solid:
        'btn-asym bg-neutral-900 text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200 focus-visible:ring-neutral-400',
      asym: 'btn-asym bg-neutral-900 text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200 focus-visible:ring-neutral-400',
      // Soft ChaiUI default on cards
      secondary:
        'rounded-md bg-neutral-200 text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 focus-visible:ring-neutral-400 font-semibold',
      soft: 'rounded-md bg-neutral-200 text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 focus-visible:ring-neutral-400 font-semibold',
      // Mirrored outline
      outline:
        'btn-asym-mirror border border-border bg-transparent text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900 focus-visible:ring-neutral-400',
      'asym-mirror':
        'btn-asym-mirror border border-border bg-transparent text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900 focus-visible:ring-neutral-400',
      ghost:
        'rounded-md bg-transparent text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900 focus-visible:ring-neutral-400',
      danger: 'rounded-md bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500',
      accent: unitAccent
        ? `rounded-md bg-unit-${unitAccent} text-white hover:opacity-90 focus-visible:ring-unit-${unitAccent}`
        : 'rounded-md bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
