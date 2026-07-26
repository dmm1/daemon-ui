import {
  forwardRef,
  type HTMLAttributes,
  type AnchorHTMLAttributes,
} from 'react'
import { cn } from '../lib/cn'

const Pagination = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      role="navigation"
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
)
Pagination.displayName = 'Pagination'

const PaginationContent = forwardRef<
  HTMLUListElement,
  HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement>>(
  (props, ref) => <li ref={ref} {...props} />
)
PaginationItem.displayName = 'PaginationItem'

interface PaginationLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean
}

const PaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, ...props }, ref) => (
    <a
      ref={ref}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'h-8 min-w-8 flex items-center justify-center border border-border text-xs font-mono text-foreground transition-colors cursor-pointer outline-none',
        'hover:border-primary hover:text-primary',
        'focus-visible:ring-2 focus-visible:ring-ring',
        isActive && 'bg-primary/10 border-primary text-primary',
        className
      )}
      {...props}
    />
  )
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    aria-label="Go to previous page"
    className={cn(
      'h-8 min-w-8 flex items-center justify-center gap-1 border border-border text-xs font-mono text-foreground transition-colors cursor-pointer outline-none px-2',
      'hover:border-primary hover:text-primary',
      'focus-visible:ring-2 focus-visible:ring-ring',
      className
    )}
    {...props}
  >
    <span aria-hidden="true">&larr;</span>
    <span>PREV</span>
  </a>
))
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    aria-label="Go to next page"
    className={cn(
      'h-8 min-w-8 flex items-center justify-center gap-1 border border-border text-xs font-mono text-foreground transition-colors cursor-pointer outline-none px-2',
      'hover:border-primary hover:text-primary',
      'focus-visible:ring-2 focus-visible:ring-ring',
      className
    )}
    {...props}
  >
    <span>NEXT</span>
    <span aria-hidden="true">&rarr;</span>
  </a>
))
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn(
      'h-8 min-w-8 flex items-center justify-center text-xs font-mono text-foreground-dim',
      className
    )}
    {...props}
  >
    &hellip;
  </span>
))
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
