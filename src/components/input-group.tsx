import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {}

const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center border border-border bg-background rounded-sm transition-all',
          'focus-within:border-primary focus-within:ring-1 focus-within:ring-ring',
          '[&>input]:border-0 [&>input]:ring-0 [&>input]:focus-visible:ring-0 [&>input]:focus-visible:border-0',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

InputGroup.displayName = 'InputGroup'

export interface InputAddonProps extends HTMLAttributes<HTMLDivElement> {
  position?: 'left' | 'right'
}

const InputAddon = forwardRef<HTMLDivElement, InputAddonProps>(
  ({ className, position = 'left', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center px-3 text-foreground-dim text-sm font-mono bg-muted self-stretch',
          position === 'left'
            ? 'border-r border-border'
            : 'border-l border-border',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

InputAddon.displayName = 'InputAddon'

export { InputGroup, InputAddon }
