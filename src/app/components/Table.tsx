import * as React from 'react'

import { cn } from '~/lib/utils'

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { variant?: 'bg-blurred' | 'bg-transparent' }
>(({ className, variant = 'bg-blurred', ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn(
        'w-full caption-bottom border-separate border-spacing-0 overflow-hidden rounded-t-xl text-sm text-white',
        {
          'bg-white/20 backdrop-blur-xl': variant === 'bg-blurred',
          'bg-transparent': variant === 'bg-transparent'
        },
        className
      )}
      {...props}
    />
  </div>
))
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'overflow-hidden rounded-t-xl bg-gradient-to-r from-[#2E046A] to-[#946AD0] text-inherit [&_th]:border-r [&_th]:border-[#D1D4DB] [&_th:last-child]:border-none [&_tr:first-child]:rounded-t-xl [&_tr]:border-b',
      className
    )}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('', className)} {...props} />
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-[#D1D4DB] border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted  [&_td:first-child]:border-l',
      className
    )}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-10 p-4 text-center  align-middle font-semibold text-inherit [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    variant?: 'center' | 'left'
  }
>(({ className, variant = 'center', ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      ' border-[#D1D4DB] p-4 font-dmsans [&:has([role=checkbox])]:pr-0 border-y [&>[role=checkbox]]:translate-y-[2px] border-r w-fit',
      {
        'text-center': variant === 'center',
        'text-left': variant === 'left'
      },
      className
    )}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
}
