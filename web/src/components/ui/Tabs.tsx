import React, { createContext, useContext } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div className={twMerge(clsx('w-full space-y-4', className))}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={twMerge(
        clsx(
          'flex items-center gap-1.5 p-1 rounded-xl border border-border bg-muted/40 overflow-x-auto text-xs font-medium',
          className
        )
      )}
    >
      {children}
    </div>
  );
}

export interface TabTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export function TabTrigger({ value, children, className, icon, disabled }: TabTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabTrigger must be used within Tabs');

  const isActive = context.value === value;

  return (
    <button
      role="tab"
      type="button"
      disabled={disabled}
      aria-selected={isActive}
      onClick={() => context.onChange(value)}
      className={twMerge(
        clsx(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150',
          isActive
            ? 'bg-background text-foreground shadow-subtle border border-border font-bold'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
          disabled && 'opacity-40 cursor-not-allowed',
          className
        )
      )}
    >
      {icon && <span className="size-3.5 shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

export interface TabContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabContent({ value, children, className }: TabContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabContent must be used within Tabs');

  if (context.value !== value) return null;

  return (
    <div
      role="tabpanel"
      tabIndex={0}
      className={twMerge(clsx('outline-none animate-in fade-in duration-200', className))}
    >
      {children}
    </div>
  );
}
