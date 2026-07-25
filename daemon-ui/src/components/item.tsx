import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface ItemProps extends HTMLAttributes<HTMLDivElement> {
  leading?: ReactNode
  trailing?: ReactNode
  selected?: boolean
  disabled?: boolean
}

const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ className, leading, trailing, selected, disabled, children, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
        className={cn(
          'flex items-center gap-3 px-3 py-2 text-sm font-mono text-foreground transition-colors',
          onClick && 'cursor-pointer hover:bg-muted/50',
          selected && 'bg-primary/5 text-primary',
          disabled && 'opacity-50 pointer-events-none',
          className,
        )}
        onClick={disabled ? undefined : onClick}
        aria-disabled={disabled}
        aria-selected={selected}
        {...props}
      >
        {leading && <span className="shrink-0">{leading}</span>}
        <span className="flex-1 min-w-0">{children}</span>
        {trailing && <span className="shrink-0">{trailing}</span>}
      </div>
    )
  },
)

Item.displayName = 'Item'

export { Item }
