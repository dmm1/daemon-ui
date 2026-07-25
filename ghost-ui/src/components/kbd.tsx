import { type HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type KbdProps = HTMLAttributes<HTMLElement>

function Kbd({ className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center gap-1 border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-foreground-dim rounded-sm',
        className
      )}
      {...props}
    />
  )
}

export { Kbd, type KbdProps }
