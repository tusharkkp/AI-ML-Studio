import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export function Toggle({
  label,
  checked,
  onChange,
  description,
  className,
  disabled = false,
}: ToggleProps) {
  const toggleId = `toggle-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={twMerge(clsx('flex items-center justify-between gap-3', className))}>
      <div className="flex flex-col">
        <label
          htmlFor={toggleId}
          className="text-sm font-medium text-studio-900 dark:text-studio-100 cursor-pointer select-none"
        >
          {label}
        </label>
        {description && (
          <span className="text-xs text-studio-500 dark:text-studio-400">{description}</span>
        )}
      </div>

      <button
        type="button"
        id={toggleId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={twMerge(
          clsx(
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-unit-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            checked ? 'bg-unit-2' : 'bg-studio-300 dark:bg-studio-700'
          )
        )}
      >
        <span
          aria-hidden="true"
          className={twMerge(
            clsx(
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              checked ? 'translate-x-5' : 'translate-x-0'
            )
          )}
        />
      </button>
    </div>
  );
}
