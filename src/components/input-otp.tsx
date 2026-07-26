import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ClipboardEvent,
} from 'react'
import { cn } from '../lib/cn'

export interface InputOTPProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  maxLength: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
}

const InputOTP = forwardRef<HTMLDivElement, InputOTPProps>(
  (
    {
      className,
      maxLength,
      value = '',
      onChange,
      onComplete,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value)
    const val = value !== undefined ? value : internalValue

    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const updateValue = useCallback(
      (newVal: string) => {
        const clamped = newVal.slice(0, maxLength)
        setInternalValue(clamped)
        onChange?.(clamped)
        if (clamped.length === maxLength) {
          onComplete?.(clamped)
        }
      },
      [maxLength, onChange, onComplete]
    )

    const handleInput = useCallback(
      (index: number, char: string) => {
        if (!/^\d$/.test(char)) return
        const chars = val.split('')
        chars[index] = char
        const newVal = chars.join('').replace(/undefined/g, '')
        updateValue(newVal)
        if (index < maxLength - 1) {
          inputRefs.current[index + 1]?.focus()
        }
      },
      [val, maxLength, updateValue]
    )

    const handleKeyDown = useCallback(
      (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
          e.preventDefault()
          const chars = val.split('')
          if (chars[index]) {
            chars[index] = ''
            updateValue(chars.join(''))
          } else if (index > 0) {
            chars[index - 1] = ''
            updateValue(chars.join(''))
            inputRefs.current[index - 1]?.focus()
          }
        } else if (e.key === 'ArrowLeft' && index > 0) {
          inputRefs.current[index - 1]?.focus()
        } else if (e.key === 'ArrowRight' && index < maxLength - 1) {
          inputRefs.current[index + 1]?.focus()
        }
      },
      [val, maxLength, updateValue]
    )

    const handlePaste = useCallback(
      (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '')
        if (pasted) {
          updateValue(pasted)
          const focusIdx = Math.min(pasted.length, maxLength) - 1
          inputRefs.current[focusIdx]?.focus()
        }
      },
      [maxLength, updateValue]
    )

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center gap-2', className)}
        {...props}
      >
        {Array.from({ length: maxLength }, (_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={val[i] || ''}
            disabled={disabled}
            className={cn(
              'w-10 h-12 border border-border bg-background rounded-sm text-center text-lg font-mono text-foreground-bright transition-all',
              'focus:border-primary focus:ring-1 focus:ring-ring focus:outline-none',
              'disabled:opacity-50 disabled:pointer-events-none'
            )}
            onChange={(e) => {
              const char = e.target.value.slice(-1)
              if (char) handleInput(i, char)
            }}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
    )
  }
)

InputOTP.displayName = 'InputOTP'

export interface InputOTPGroupProps extends HTMLAttributes<HTMLDivElement> {}

const InputOTPGroup = forwardRef<HTMLDivElement, InputOTPGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  )
)

InputOTPGroup.displayName = 'InputOTPGroup'

export interface InputOTPSeparatorProps extends HTMLAttributes<HTMLSpanElement> {}

const InputOTPSeparator = forwardRef<HTMLSpanElement, InputOTPSeparatorProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('text-foreground-dim font-mono', className)}
      {...props}
    >
      –
    </span>
  )
)

InputOTPSeparator.displayName = 'InputOTPSeparator'

export { InputOTP, InputOTPGroup, InputOTPSeparator }
