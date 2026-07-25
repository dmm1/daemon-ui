import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  ratio?: number
}

const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, className, children, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative w-full', className)}
      style={{ paddingBottom: `${(1 / ratio) * 100}%`, ...style }}
      {...props}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  )
)
AspectRatio.displayName = 'AspectRatio'

export { AspectRatio, type AspectRatioProps }
