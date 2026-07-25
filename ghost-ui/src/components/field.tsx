import { useId, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
  error?: string
  description?: string
  required?: boolean
  children: ReactNode
}

function Field({ className, label, error, description, required, children, id: externalId, ...props }: FieldProps) {
  const generatedId = useId()
  const fieldId = externalId || generatedId

  return (
    <div className={cn('flex flex-col gap-1.5', className)} {...props}>
      {label && (
        <label htmlFor={fieldId} className="text-[10px] font-mono uppercase tracking-wider text-foreground-dim">
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && (
        <span className="text-[10px] font-mono text-error">{error}</span>
      )}
      {description && !error && (
        <span className="text-[10px] font-mono text-foreground-dim">{description}</span>
      )}
    </div>
  )
}

Field.displayName = 'Field'

export { Field }
