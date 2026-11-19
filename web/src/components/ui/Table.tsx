import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function TableContainer({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        clsx(
          'w-full overflow-x-auto rounded-xl border border-border bg-card/60 backdrop-blur-sm',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Table({ className, children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={twMerge(clsx('w-full text-xs text-left border-collapse font-sans', className))}
      {...props}
    >
      {children}
    </table>
  );
}

export function TableHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={twMerge(
        clsx('bg-muted/70 text-foreground font-manrope font-semibold border-b border-border', className)
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={twMerge(clsx('divide-y divide-border/60 text-foreground/90', className))} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={twMerge(
        clsx('transition-colors hover:bg-muted/40 focus:bg-muted/50', className)
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  className,
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={twMerge(
        clsx('p-3 font-semibold text-foreground/90 whitespace-nowrap text-xs', className)
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({
  className,
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={twMerge(clsx('p-3 align-middle text-xs', className))} {...props}>
      {children}
    </td>
  );
}

export function TableCaption({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={twMerge(clsx('mt-3 text-[11px] text-muted-foreground italic', className))}
      {...props}
    >
      {children}
    </caption>
  );
}
