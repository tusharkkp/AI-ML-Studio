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
  const accentBorder = unitAccent ? `hover:border-unit-${unitAccent}/40` : '';

  return (
    <div
      className={twMerge(
        clsx(
          'rounded-xl border border-card-edge bg-card-fill backdrop-blur-sm p-6 sm:opacity-95 sm:hover:opacity-100 hover:border-card-edge-hover transition-all duration-300',
          interactive && 'cursor-pointer active:scale-[0.99]',
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
          'font-montserrat text-base sm:text-lg font-semibold tracking-tight text-foreground',
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
        clsx('text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed', className)
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
      className={twMerge(clsx('flex items-center pt-4 border-t border-card-edge', className))}
      {...props}
    >
      {children}
    </div>
  );
}
