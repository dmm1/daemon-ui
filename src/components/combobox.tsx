import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../lib/cn'
import { Keys } from '../lib/utils'
import { useDismissableLayer } from '../primitives/dismissable'

interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  className?: string
}

function Combobox({
  options,
  value = '',
  onValueChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  className,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })

  const selectedLabel = options.find((o) => o.value === value)?.label ?? ''

  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options

  const handleOpen = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
    }
    setSearch('')
    setActiveIndex(0)
    setOpen(true)
  }, [])

  const handleSelect = useCallback(
    (val: string) => {
      onValueChange?.(val)
      setOpen(false)
      triggerRef.current?.focus()
    },
    [onValueChange]
  )

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useDismissableLayer(contentRef, {
    enabled: open,
    onDismiss: () => setOpen(false),
    onEscape: () => triggerRef.current?.focus(),
    ignoreRef: triggerRef,
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === Keys.ArrowDown) {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === Keys.ArrowUp) {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === Keys.Enter && filtered[activeIndex]) {
      e.preventDefault()
      handleSelect(filtered[activeIndex].value)
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : handleOpen())}
        className={cn(
          'flex items-center justify-between h-10 w-full border border-border bg-background px-3 text-sm font-mono',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className
        )}
      >
        <span className={cn('truncate', !value && 'text-foreground-dim')}>
          {selectedLabel || placeholder}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 ml-2">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open &&
        createPortal(
          <div
            ref={contentRef}
            className="fixed z-50 bg-background-panel border border-border shadow-lg"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
            onKeyDown={handleKeyDown}
          >
            <div className="border-b border-border p-2">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setActiveIndex(0) }}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-xs font-mono outline-none text-foreground placeholder:text-foreground-dim"
              />
            </div>
            <div role="listbox" className="max-h-48 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-3 py-2 text-xs font-mono text-foreground-dim">No results</div>
              ) : (
                filtered.map((opt, i) => (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      'flex items-center px-3 py-2 text-xs font-mono cursor-pointer hover:bg-primary/5 hover:text-primary transition-colors',
                      opt.value === value && 'text-primary',
                      i === activeIndex && 'bg-primary/5'
                    )}
                  >
                    {opt.label}
                  </div>
                ))
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

export { Combobox, type ComboboxOption, type ComboboxProps }
