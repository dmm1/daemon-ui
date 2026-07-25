import { forwardRef, useCallback, useRef, type InputHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  indeterminate?: boolean
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, defaultChecked, onCheckedChange, indeterminate, disabled, ...props }, ref) => {
    const innerRef = useRef<HTMLInputElement>(null)
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || innerRef

    const handleClick = useCallback(() => {
      if (disabled) return
      const input = inputRef.current
      if (input) {
        input.click()
      }
    }, [disabled, inputRef])

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onCheckedChange?.(e.target.checked)
      },
      [onCheckedChange],
    )

    const isChecked = checked ?? undefined

    return (
      <div
        className={cn(
          'relative inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-border bg-background transition-all',
          isChecked && 'border-primary bg-primary',
          indeterminate && !isChecked && 'border-primary bg-primary',
          disabled && 'opacity-50 pointer-events-none cursor-default',
          className,
        )}
        onClick={handleClick}
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : isChecked}
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
        {(isChecked || indeterminate) && (
          <svg
            className="h-3 w-3 text-primary-foreground"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {indeterminate && !isChecked ? (
              <line x1="2" y1="6" x2="10" y2="6" />
            ) : (
              <polyline points="2 6 5 9 10 3" />
            )}
          </svg>
        )}
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
