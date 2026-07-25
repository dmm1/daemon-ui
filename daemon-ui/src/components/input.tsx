import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-10 w-full bg-background border border-border px-3 py-2 text-sm font-mono text-foreground transition-all placeholder:text-foreground-dim focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input, type InputProps }
