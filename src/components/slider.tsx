import { forwardRef, useCallback, useMemo, type InputHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'> {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number) => void
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, defaultValue, min = 0, max = 100, step = 1, onValueChange, disabled, ...props }, ref) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange?.(Number(e.target.value))
      },
      [onValueChange],
    )

    const percentage = useMemo(() => {
      const val = value ?? defaultValue ?? min
      return ((val - min) / (max - min)) * 100
    }, [value, defaultValue, min, max])

    return (
      <div
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          disabled && 'opacity-50 pointer-events-none',
          className,
        )}
      >
        <div className="relative h-1 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="absolute h-full bg-primary transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            'absolute inset-0 h-full w-full cursor-pointer opacity-0',
            '[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm',
          )}
          {...props}
        />
        <div
          className="pointer-events-none absolute h-4 w-4 rounded-full border-2 border-primary bg-background shadow-sm transition-all"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    )
  },
)

Slider.displayName = 'Slider'

export { Slider }
