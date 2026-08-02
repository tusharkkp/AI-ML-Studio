import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  unitAccent?: 1 | 2 | 3 | 4 | 5 | 6;
  interactive?: boolean;
}

export function Card({
  className,
  unitAccent,
  interactive = false,
  children,
  ...props
}: CardProps) {
  const accentBorder = unitAccent ? `hover:border-unit-${unitAccent}` : '';

  return (
    <div
      className={twMerge(
        clsx(
          'rounded-xl border border-studio-200 bg-white p-6 shadow-subtle dark:border-studio-800 dark:bg-studio-900 transition-all duration-200',
          interactive &&
            'cursor-pointer hover:shadow-studio hover:-translate-y-0.5 active:translate-y-0',
          accentBorder,
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge(clsx('flex flex-col space-y-1.5 pb-4', className))} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={twMerge(
        clsx(
          'font-display text-lg font-bold tracking-tight text-studio-900 dark:text-studio-50',
          className
        )
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={twMerge(
        clsx('text-sm text-studio-500 dark:text-studio-400 leading-relaxed', className)
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge(clsx('pt-0', className))} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        clsx('flex items-center pt-4 border-t border-studio-100 dark:border-studio-800', className)
      )}
      {...props}
    >
      {children}
    </div>
  );
}
