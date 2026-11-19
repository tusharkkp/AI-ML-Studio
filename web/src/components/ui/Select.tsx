import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, id, children, disabled, ...props }, ref) => {
    const selectId =
      id ?? (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="flex flex-col space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-foreground/80 uppercase tracking-wider font-mono select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={twMerge(
              clsx(
                'w-full h-9 appearance-none rounded-lg border border-border bg-background/80 pl-3 pr-8 text-xs sm:text-sm text-foreground transition-colors duration-150 cursor-pointer',
                'focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
                className
              )
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-2.5 size-4 text-muted-foreground pointer-events-none" />
        </div>

        {error ? (
          <p className="text-[11px] text-rose-500 font-medium font-sans">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-muted-foreground font-sans">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
