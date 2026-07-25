import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../lib/cn'
import { Keys } from '../lib/utils'
import { useDismissableLayer } from '../primitives/dismissable'

interface SelectContextValue {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
  activeIndex: number
  setActiveIndex: (index: number) => void
  items: string[]
  registerItem: (value: string) => void
}

const SelectContext = createContext<SelectContextValue | null>(null)

function useSelect() {
  const ctx = useContext(SelectContext)
  if (!ctx) throw new Error('useSelect must be used within Select')
  return ctx
}

interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: ReactNode
}

function Select({ value: controlledValue, defaultValue = '', onValueChange, children }: SelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [items] = useState<string[]>([])
  const triggerRef = useRef<HTMLButtonElement>(null)

  const value = controlledValue !== undefined ? controlledValue : internalValue

  const handleValueChange = useCallback(
    (v: string) => {
      if (controlledValue === undefined) setInternalValue(v)
      onValueChange?.(v)
      setOpen(false)
    },
    [controlledValue, onValueChange]
  )

  const registerItem = useCallback(
    (v: string) => {
      if (!items.includes(v)) items.push(v)
    },
    [items]
  )

  return (
    <SelectContext.Provider
      value={{ value, onValueChange: handleValueChange, open, setOpen, triggerRef, activeIndex, setActiveIndex, items, registerItem }}
    >
      {children}
    </SelectContext.Provider>
  )
}

const SelectTrigger = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen, triggerRef } = useSelect()

    const combinedRef = (node: HTMLButtonElement | null) => {
      (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
    }

    return (
      <button
        ref={combinedRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center justify-between h-10 w-full border border-border bg-background px-3 text-sm font-mono',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className
        )}
        {...props}
      >
        {children}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 ml-2">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    )
  }
)
SelectTrigger.displayName = 'SelectTrigger'

function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = useSelect()
  return <span className={cn('truncate', !value && 'text-foreground-dim')}>{value || placeholder}</span>
}

interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

function SelectContent({ className, children, ...props }: SelectContentProps) {
  const { open, setOpen, triggerRef, activeIndex, setActiveIndex, items, value, onValueChange } = useSelect()
  const contentRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
      setActiveIndex(items.indexOf(value))
    }
  }, [open, triggerRef, value, items, setActiveIndex])

  useDismissableLayer(contentRef, {
    enabled: open,
    onDismiss: () => setOpen(false),
    onEscape: () => triggerRef.current?.focus(),
    ignoreRef: triggerRef,
  })

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === Keys.ArrowDown) {
        e.preventDefault()
        setActiveIndex(Math.min(activeIndex + 1, items.length - 1))
      } else if (e.key === Keys.ArrowUp) {
        e.preventDefault()
        setActiveIndex(Math.max(activeIndex - 1, 0))
      } else if (e.key === Keys.Enter && activeIndex >= 0) {
        e.preventDefault()
        onValueChange(items[activeIndex])
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, activeIndex, setActiveIndex, items, onValueChange])

  if (!open) return null

  return createPortal(
    <div
      ref={contentRef}
      role="listbox"
      aria-label="Options"
      className={cn(
        'fixed z-50 bg-background-panel border border-border py-1 shadow-lg',
        className
      )}
      style={{ top: pos.top, left: pos.left, width: pos.width }}
      {...props}
    >
      {children}
    </div>,
    document.body
  )
}

interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  children: ReactNode
}

function SelectItem({ value: itemValue, className, children, ...props }: SelectItemProps) {
  const { value, onValueChange, activeIndex, items, registerItem } = useSelect()
  const isSelected = value === itemValue
  const idx = items.indexOf(itemValue)
  const isActive = activeIndex === idx

  useEffect(() => {
    registerItem(itemValue)
  }, [itemValue, registerItem])

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={() => onValueChange(itemValue)}
      className={cn(
        'flex items-center px-3 py-2 text-xs font-mono cursor-pointer hover:bg-primary/5 hover:text-primary transition-colors',
        isSelected && 'text-primary',
        isActive && 'bg-primary/5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function SelectGroup({ className, children, label, ...props }: HTMLAttributes<HTMLDivElement> & { label?: string }) {
  return (
    <div className={className} {...props}>
      {label && (
        <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.15em] text-foreground-dim">
          {label}
        </div>
      )}
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectContent, SelectItem, SelectGroup, SelectValue }
