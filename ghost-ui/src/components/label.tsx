import { forwardRef, type LabelHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-[11px] font-mono uppercase tracking-[0.15em] text-foreground-dim peer-disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  )
)
Label.displayName = 'Label'

export { Label, type LabelProps }
