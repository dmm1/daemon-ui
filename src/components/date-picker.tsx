import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../lib/cn'
import { Calendar } from './calendar'
import { useDismissableLayer } from '../primitives/dismissable'

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date) => void
  placeholder?: string
  className?: string
}

function formatDate(d?: Date) {
  if (!d) return ''
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date...',
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, left: rect.left })
    }
  }, [open])

  useDismissableLayer(panelRef, {
    enabled: open,
    onDismiss: () => setOpen(false),
    ignoreRef: triggerRef,
  })

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center h-10 w-full border border-border bg-background px-3 text-sm font-mono',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          !value && 'text-foreground-dim',
          className
        )}
      >
        {value ? formatDate(value) : placeholder}
      </button>
      {open &&
        createPortal(
          <div
            ref={panelRef}
            className="fixed z-50 bg-background-panel border border-border shadow-lg"
            style={{ top: pos.top, left: pos.left }}
          >
            <Calendar
              selected={value}
              onSelect={(d) => {
                onChange?.(d)
                setOpen(false)
              }}
            />
          </div>,
          document.body
        )}
    </>
  )
}

export { DatePicker, type DatePickerProps }
