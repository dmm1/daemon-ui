import { forwardRef, useCallback, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

const toggleVariants = cva(
  'inline-flex items-center justify-center font-mono text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-transparent hover:bg-muted text-foreground',
        outline:
          'border border-border bg-transparent hover:bg-muted text-foreground',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-9 px-3 text-sm',
        lg: 'h-10 px-4 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface ToggleProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof toggleVariants> {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      className,
      variant,
      size,
      pressed,
      defaultPressed,
      onPressedChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const isControlled = pressed !== undefined
    const isPressed = isControlled ? pressed : undefined

    const handleClick = useCallback(() => {
      if (disabled) return
      onPressedChange?.(!pressed)
    }, [disabled, onPressedChange, pressed])

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isPressed}
        data-state={isPressed ? 'on' : 'off'}
        disabled={disabled}
        className={cn(
          toggleVariants({ variant, size }),
          isPressed && 'bg-primary/10 text-primary',
          className
        )}
        onClick={handleClick}
        {...props}
      />
    )
  }
)

Toggle.displayName = 'Toggle'

export { Toggle, toggleVariants }
