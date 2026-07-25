import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal' | 'both'
}

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, orientation = 'vertical', children, ...props }, ref) => {
    const overflowClass =
      orientation === 'horizontal'
        ? 'overflow-x-auto overflow-y-hidden'
        : orientation === 'both'
          ? 'overflow-auto'
          : 'overflow-y-auto overflow-x-hidden'

    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        {...props}
      >
        <div
          className={cn(
            'h-full w-full',
            overflowClass,
            'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-foreground/20 hover:scrollbar-thumb-foreground/30',
            '[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-1',
            '[&::-webkit-scrollbar-track]:bg-transparent',
            '[&::-webkit-scrollbar-thumb]:bg-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full',
            '[&:hover::-webkit-scrollbar-thumb]:bg-foreground/30'
          )}
        >
          {children}
        </div>
      </div>
    )
  }
)
ScrollArea.displayName = 'ScrollArea'

export { ScrollArea, type ScrollAreaProps }
