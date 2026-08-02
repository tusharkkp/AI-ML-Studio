import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  unitAccent?: 1 | 2 | 3 | 4 | 5 | 6;
  onChange: (value: number) => void;
  helperText?: string;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  unitAccent = 2,
  onChange,
  helperText,
  className,
  disabled,
  id,
  ...props
}: SliderProps) {
  const inputId = id ?? `slider-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={twMerge(clsx('flex flex-col space-y-2', className))}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-studio-600 dark:text-studio-400"
        >
          {label}
        </label>
        <span className="font-mono text-xs font-bold text-studio-900 dark:text-studio-100 bg-studio-100 dark:bg-studio-800 px-2 py-0.5 rounded">
          {value}
          {unit && <span className="ml-0.5 text-studio-500 font-normal">{unit}</span>}
        </span>
      </div>

      <input
        type="range"
        id={inputId}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={twMerge(
          clsx(
            'w-full h-2 bg-studio-200 dark:bg-studio-700 rounded-lg appearance-none cursor-pointer accent-unit-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-studio-400 disabled:opacity-50 disabled:cursor-not-allowed',
            unitAccent && `accent-unit-${unitAccent}`
          )
        )}
        {...props}
      />

      {helperText && (
        <p className="text-[11px] text-studio-500 dark:text-studio-400">{helperText}</p>
      )}
    </div>
  );
}
