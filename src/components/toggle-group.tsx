import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  type HTMLAttributes,
} from 'react'
import { cn } from '../lib/cn'
import { Toggle, type ToggleProps } from './toggle'

interface ToggleGroupContextValue {
  type: 'single' | 'multiple'
  value: string[]
  onItemToggle: (value: string) => void
}

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  type: 'single',
  value: [],
  onItemToggle: () => {},
})

export interface ToggleGroupProps extends HTMLAttributes<HTMLDivElement> {
  type: 'single' | 'multiple'
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, type, value, onValueChange, children, ...props }, ref) => {
    const normalizedValue = Array.isArray(value) ? value : value ? [value] : []

    const onItemToggle = useCallback(
      (itemValue: string) => {
        if (type === 'single') {
          const newValue = normalizedValue.includes(itemValue) ? '' : itemValue
          onValueChange?.(newValue)
        } else {
          const newValue = normalizedValue.includes(itemValue)
            ? normalizedValue.filter((v) => v !== itemValue)
            : [...normalizedValue, itemValue]
          onValueChange?.(newValue)
        }
      },
      [type, normalizedValue, onValueChange]
    )

    return (
      <ToggleGroupContext.Provider
        value={{ type, value: normalizedValue, onItemToggle }}
      >
        <div
          ref={ref}
          role="group"
          className={cn('inline-flex items-center gap-1', className)}
          {...props}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    )
  }
)

ToggleGroup.displayName = 'ToggleGroup'

export interface ToggleGroupItemProps extends Omit<
  ToggleProps,
  'pressed' | 'onPressedChange'
> {
  value: string
}

const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ value, ...props }, ref) => {
    const ctx = useContext(ToggleGroupContext)
    const isPressed = ctx.value.includes(value)

    const handlePressedChange = useCallback(() => {
      ctx.onItemToggle(value)
    }, [ctx, value])

    return (
      <Toggle
        ref={ref}
        pressed={isPressed}
        onPressedChange={handlePressedChange}
        {...props}
      />
    )
  }
)

ToggleGroupItem.displayName = 'ToggleGroupItem'

export { ToggleGroup, ToggleGroupItem }
