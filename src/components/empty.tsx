import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface EmptyProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode
  title?: string
  description?: string
  action?: ReactNode
}

function Empty({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
      {...props}
    >
      {icon && <div className="mb-4 text-foreground-dim">{icon}</div>}
      {title && (
        <h3 className="text-sm font-mono text-foreground-bright uppercase tracking-wider mb-1">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-xs font-mono text-foreground-dim max-w-[280px]">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

Empty.displayName = 'Empty'

export { Empty }
