import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export interface NativeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative inline-flex">
        <select
          ref={ref}
          className={cn(
            'appearance-none bg-background border border-border rounded-sm h-10 px-3 pr-8 text-sm font-mono text-foreground transition-all',
            'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ring',
            'disabled:opacity-50 disabled:pointer-events-none',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-foreground-dim text-xs"
        >
          ▾
        </span>
      </div>
    )
  }
)

NativeSelect.displayName = 'NativeSelect'

export { NativeSelect }
