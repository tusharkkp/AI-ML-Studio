import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
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
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] duration-150';

    const sizeStyles = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2 min-h-[40px]',
      lg: 'text-base px-5 py-2.5 gap-2.5 min-h-[48px]',
    };

    const variantStyles = {
      primary:
        'bg-studio-900 text-white hover:bg-studio-800 dark:bg-studio-100 dark:text-studio-950 dark:hover:bg-white focus-visible:ring-studio-400',
      secondary:
        'bg-studio-100 text-studio-900 hover:bg-studio-200 dark:bg-studio-800 dark:text-studio-100 dark:hover:bg-studio-700 focus-visible:ring-studio-400',
      outline:
        'border border-studio-300 bg-transparent text-studio-700 hover:bg-studio-100 dark:border-studio-700 dark:text-studio-300 dark:hover:bg-studio-800 focus-visible:ring-studio-400',
      ghost:
        'bg-transparent text-studio-700 hover:bg-studio-100 dark:text-studio-300 dark:hover:bg-studio-800 focus-visible:ring-studio-400',
      danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500',
      accent: unitAccent
        ? `bg-unit-${unitAccent} text-white hover:opacity-90 focus-visible:ring-unit-${unitAccent}`
        : 'bg-unit-2 text-white hover:opacity-90 focus-visible:ring-unit-2',
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
