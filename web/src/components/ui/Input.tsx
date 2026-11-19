import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, icon, id, disabled, ...props }, ref) => {
    const inputId = id ?? (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="flex flex-col space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-foreground/80 uppercase tracking-wider font-mono select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {icon && (
            <div className="absolute left-3 text-muted-foreground pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={twMerge(
              clsx(
                'w-full h-9 rounded-lg border border-border bg-background/80 px-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors duration-150',
                'focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                icon && 'pl-9',
                error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
                className
              )
            )}
            {...props}
          />
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

Input.displayName = 'Input';
