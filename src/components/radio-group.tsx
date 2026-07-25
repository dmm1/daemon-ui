import { createContext, forwardRef, useCallback, useContext, type HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

interface RadioGroupContextValue {
  value?: string
  onValueChange?: (value: string) => void
}

const RadioGroupContext = createContext<RadioGroupContextValue>({})

export interface RadioGroupProps extends HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, orientation = 'vertical', children, ...props }, ref) => {
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const items = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]'),
        )
        const currentIndex = items.findIndex((el) => el === document.activeElement)
        if (currentIndex === -1) return

        let nextIndex = currentIndex
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault()
          nextIndex = (currentIndex + 1) % items.length
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault()
          nextIndex = (currentIndex - 1 + items.length) % items.length
        }

        if (nextIndex !== currentIndex) {
          items[nextIndex].focus()
          const val = items[nextIndex].getAttribute('data-value')
          if (val) onValueChange?.(val)
        }
      },
      [onValueChange],
    )

    return (
      <RadioGroupContext.Provider value={{ value, onValueChange }}>
        <div
          ref={ref}
          role="radiogroup"
          className={cn(
            'flex',
            orientation === 'vertical' ? 'flex-col gap-2' : 'flex-row gap-3',
            className,
          )}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  },
)

RadioGroup.displayName = 'RadioGroup'

export interface RadioGroupItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  disabled?: boolean
}

const RadioGroupItem = forwardRef<HTMLDivElement, RadioGroupItemProps>(
  ({ className, value, disabled, ...props }, ref) => {
    const ctx = useContext(RadioGroupContext)
    const isSelected = ctx.value === value

    const handleClick = useCallback(() => {
      if (disabled) return
      ctx.onValueChange?.(value)
    }, [ctx, disabled, value])

    return (
      <div
        ref={ref}
        role="radio"
        aria-checked={isSelected}
        aria-disabled={disabled}
        data-value={value}
        tabIndex={isSelected ? 0 : -1}
        className={cn(
          'inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-background transition-all',
          isSelected && 'border-primary',
          disabled && 'opacity-50 pointer-events-none cursor-default',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        {isSelected && <span className="block h-2 w-2 rounded-full bg-primary" />}
      </div>
    )
  },
)

RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }
