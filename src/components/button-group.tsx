import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {}

const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex',
          '[&>button]:rounded-none [&>button:first-child]:rounded-l-sm [&>button:last-child]:rounded-r-sm [&>button:not(:first-child)]:-ml-px',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ButtonGroup.displayName = 'ButtonGroup'

export { ButtonGroup }
