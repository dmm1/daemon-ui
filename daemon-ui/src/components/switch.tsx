import { forwardRef, useCallback, useRef, type InputHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: 'sm' | 'md'
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, defaultChecked, onCheckedChange, disabled, size = 'md', ...props }, ref) => {
    const innerRef = useRef<HTMLInputElement>(null)
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || innerRef

    const handleClick = useCallback(() => {
      if (disabled) return
      inputRef.current?.click()
    }, [disabled, inputRef])

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onCheckedChange?.(e.target.checked)
      },
      [onCheckedChange],
    )

    const isChecked = checked ?? false

    return (
      <div
        className={cn(
          'relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-border transition-all',
          size === 'md' ? 'h-5 w-10' : 'h-4 w-8',
          isChecked ? 'bg-primary border-primary' : 'bg-muted',
          disabled && 'opacity-50 pointer-events-none cursor-default',
          className,
        )}
        onClick={handleClick}
        role="switch"
        aria-checked={isChecked}
        aria-disabled={disabled}
      >
        <input
          ref={inputRef}
          type="checkbox"
          className="sr-only"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
        <span
          className={cn(
            'block rounded-full bg-foreground-bright shadow-sm transition-transform',
            size === 'md' ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5',
            isChecked
              ? size === 'md'
                ? 'translate-x-[22px]'
                : 'translate-x-[18px]'
              : 'translate-x-[3px]',
          )}
        />
      </div>
    )
  },
)

Switch.displayName = 'Switch'

export { Switch }
