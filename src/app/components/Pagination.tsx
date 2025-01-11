import React from 'react'
import { cn } from '~/lib/utils'
import {
  Pagination as RadixPagination,
  PaginationContent as RadixPaginationContent,
  PaginationLink as RadixPaginationLink,
  PaginationItem as RadixPaginationItem,
  PaginationPrevious as RadixPaginationPrevious,
  PaginationNext as RadixPaginationNext,
  PaginationEllipsis as RadixPaginationEllipsis
} from './ui/pagination'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const gradientClasses = cn('[background:linear-gradient(113.98deg,_#48E6FF_-34.84%,_#9274FF_45.46%,_#C159D8_125.76%)] text-white', 
    'hover:shadow hover:shadow-[#946AD0] focus:border-2 focus:border-[#EBC3FF] disabled:[background:_#595959] ',
    '[&[aria-disabled=true]]:[background:#595959] [&[aria-disabled=true]]:cursor-not-allowed',
    'transition-all duration-200 ease-out')
  
const activeGradientClasses = 
  '[background:linear-gradient(113.98deg,_#3BB8CC_-34.84%,_#745CC8_45.46%,_#9A47AD_125.76%)]'


const PaginationLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof RadixPaginationLink> & { isActive?: boolean }
>(({ className, isActive, ...props }, ref) => (
  <RadixPaginationLink
    ref={ref}
    className={cn(gradientClasses, isActive && activeGradientClasses, className)}
    {...props}
  />
))
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof RadixPaginationPrevious>
>(({ className, ...props }, ref) => (
  <RadixPaginationPrevious
    ref={ref}
    className={cn(gradientClasses, className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
  </RadixPaginationPrevious>
))
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof RadixPaginationNext>
>(({ className, ...props }, ref) => (
  <RadixPaginationNext ref={ref} className={cn(gradientClasses, className)} {...props} >
    <ChevronRight className="h-4 w-4" />
  </RadixPaginationNext>
))
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof RadixPaginationEllipsis>
>(({ className, ...props }, ref) => (
  <RadixPaginationEllipsis
    ref={ref}
    className={cn('text-[#B89BDF]', className)}
    {...props}
  />
))
PaginationEllipsis.displayName = 'PaginationEllipsis'

const PaginationBackward = ({
  className,
  ...props
}: React.ComponentProps<typeof RadixPaginationLink>) => (
  <PaginationLink
    aria-label="Go backward"
    size="default"
    className={cn('gap-1 px-2.5', className)}
    {...props}>
    <HiChevronDoubleLeft />
  </PaginationLink>
)
PaginationBackward.displayName = 'PaginationBackward'

const PaginationForward = ({
  className,
  ...props
}: React.ComponentProps<typeof RadixPaginationLink>) => (
  <PaginationLink
    aria-label="Go forward"
    size="default"
    className={cn('gap-1 px-2.5', className)}
    {...props}>
    <HiChevronDoubleRight />
  </PaginationLink>
)
PaginationForward.displayName = 'PaginationForward'

const Pagination = RadixPagination
const PaginationContent = RadixPaginationContent
const PaginationItem = RadixPaginationItem

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationForward,
  PaginationBackward
}
