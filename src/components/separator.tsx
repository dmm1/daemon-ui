import { cn } from '../lib/cn'

type SeparatorProps = {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

function Separator({ orientation = 'horizontal', className }: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        orientation === 'horizontal'
          ? 'h-px w-full bg-border'
          : 'w-px h-full bg-border',
        className
      )}
    />
  )
}

export { Separator, type SeparatorProps }
