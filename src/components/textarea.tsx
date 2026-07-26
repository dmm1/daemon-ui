import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type TextareaHTMLAttributes,
} from 'react'
import { cn } from '../lib/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize, onChange, ...props }, ref) => {
    const innerRef = useRef<HTMLTextAreaElement>(null)
    const textareaRef =
      (ref as React.RefObject<HTMLTextAreaElement>) || innerRef

    const resize = useCallback(() => {
      const el = textareaRef.current
      if (el && autoResize) {
        el.style.height = 'auto'
        el.style.height = `${el.scrollHeight}px`
      }
    }, [autoResize, textareaRef])

    useEffect(() => {
      resize()
    }, [resize, props.value])

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        resize()
        onChange?.(e)
      },
      [onChange, resize]
    )

    return (
      <textarea
        ref={textareaRef}
        className={cn(
          'min-h-[80px] w-full bg-background border border-border rounded-sm px-3 py-2 text-sm font-mono text-foreground placeholder:text-foreground-dim transition-all resize-none',
          'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ring',
          'disabled:opacity-50 disabled:pointer-events-none',
          className
        )}
        onChange={handleChange}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
