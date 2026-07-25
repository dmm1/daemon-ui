import { forwardRef, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

const progressIndicatorVariants = cva('h-full transition-all', {
  variants: {
    color: {
      default: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-error',
    },
  },
  defaultVariants: {
    color: 'default',
  },
})

type ProgressProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof progressIndicatorVariants> & {
    value?: number
    max?: number
  }

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, color, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(
          'relative h-2 w-full overflow-hidden bg-muted rounded-sm',
          className
        )}
        {...props}
      >
        <div
          className={cn(progressIndicatorVariants({ color }))}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = 'Progress'

export { Progress, progressIndicatorVariants, type ProgressProps }
