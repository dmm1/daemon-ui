import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../lib/cn'
import { Keys } from '../lib/utils'

interface CommandContextValue {
  search: string
  setSearch: (s: string) => void
  selectedIndex: number
  setSelectedIndex: (i: number) => void
  items: React.RefObject<string[]>
  registerItem: (id: string, textContent: string) => void
  unregisterItem: (id: string) => void
  getFilteredItems: () => string[]
  onSelect?: (value: string) => void
}

const CommandContext = createContext<CommandContextValue | null>(null)

function useCommand() {
  const ctx = useContext(CommandContext)
  if (!ctx) throw new Error('Command compound components must be used within <Command>')
  return ctx
}

interface CommandProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  onSelect?: (value: string) => void
}

const Command = forwardRef<HTMLDivElement, CommandProps>(
  ({ className, children, onSelect, ...props }, ref) => {
    const [search, setSearch] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const items = useRef<string[]>([])
    const itemTextMap = useRef<Map<string, string>>(new Map())

    const registerItem = useCallback((id: string, textContent: string) => {
      if (!items.current.includes(id)) {
        items.current = [...items.current, id]
      }
      itemTextMap.current.set(id, textContent.toLowerCase())
    }, [])

    const unregisterItem = useCallback((id: string) => {
      items.current = items.current.filter((i) => i !== id)
      itemTextMap.current.delete(id)
    }, [])

    const getFilteredItems = useCallback(() => {
      if (!search) return items.current
      const lower = search.toLowerCase()
      return items.current.filter((id) => {
        const text = itemTextMap.current.get(id)
        return text?.includes(lower)
      })
    }, [search])

    useEffect(() => {
      setSelectedIndex(0)
    }, [search])

    return (
      <CommandContext.Provider
        value={{ search, setSearch, selectedIndex, setSelectedIndex, items, registerItem, unregisterItem, getFilteredItems, onSelect }}
      >
        <div
          ref={ref}
          className={cn(
            'flex flex-col overflow-hidden bg-background-panel border border-border',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </CommandContext.Provider>
    )
  }
)
Command.displayName = 'Command'

const CommandInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    const { search, setSearch, selectedIndex, setSelectedIndex, getFilteredItems, onSelect } = useCommand()

    return (
      <div className="flex items-center border-b border-border px-3">
        <svg width="14" height="14" viewBox="0 0 14 14" className="mr-2 shrink-0 text-foreground-dim">
          <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <input
          ref={ref}
          type="text"
          aria-label="Search commands"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            const filtered = getFilteredItems()

            if (e.key === Keys.ArrowDown) {
              e.preventDefault()
              setSelectedIndex(Math.min(selectedIndex + 1, filtered.length - 1))
            } else if (e.key === Keys.ArrowUp) {
              e.preventDefault()
              setSelectedIndex(Math.max(selectedIndex - 1, 0))
            } else if (e.key === Keys.Enter) {
              e.preventDefault()
              const item = filtered[selectedIndex]
              if (item) onSelect?.(item)
            }
          }}
          className={cn(
            'h-10 w-full bg-transparent text-sm font-mono text-foreground placeholder:text-foreground-dim outline-none',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
CommandInput.displayName = 'CommandInput'

const CommandList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('max-h-[300px] overflow-y-auto py-1', className)}
      {...props}
    />
  )
)
CommandList.displayName = 'CommandList'

interface CommandItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  disabled?: boolean
  onSelect?: () => void
}

const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, value, disabled, onSelect: onItemSelect, children, ...props }, ref) => {
    const { search, selectedIndex, setSelectedIndex, getFilteredItems, registerItem, unregisterItem, onSelect } = useCommand()
    const textRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const text = textRef.current?.textContent || value
      registerItem(value, text)
      return () => unregisterItem(value)
    }, [value, registerItem, unregisterItem])

    const filtered = getFilteredItems()
    const itemIndex = filtered.indexOf(value)
    const isHidden = search && itemIndex === -1
    const isSelected = itemIndex === selectedIndex

    if (isHidden) return null

    return (
      <div
        ref={(node) => {
          (textRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled}
        data-value={value}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-xs font-mono text-foreground cursor-pointer outline-none',
          isSelected && 'bg-primary/5 text-primary',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        onClick={() => {
          if (disabled) return
          onItemSelect?.()
          onSelect?.(value)
        }}
        onMouseEnter={() => {
          if (!disabled) setSelectedIndex(itemIndex)
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CommandItem.displayName = 'CommandItem'

interface CommandGroupProps extends HTMLAttributes<HTMLDivElement> {
  heading?: string
}

const CommandGroup = forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, heading, children, ...props }, ref) => (
    <div ref={ref} role="group" className={className} {...props}>
      {heading && (
        <div className="px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-foreground-dim font-mono">
          {heading}
        </div>
      )}
      {children}
    </div>
  )
)
CommandGroup.displayName = 'CommandGroup'

const CommandSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn('h-px bg-border mx-2 my-1', className)}
      {...props}
    />
  )
)
CommandSeparator.displayName = 'CommandSeparator'

const CommandEmpty = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { getFilteredItems } = useCommand()
    const filtered = getFilteredItems()

    if (filtered.length > 0) return null

    return (
      <div
        ref={ref}
        className={cn('px-3 py-6 text-center text-xs text-foreground-dim font-mono', className)}
        {...props}
      >
        {children ?? 'No results found.'}
      </div>
    )
  }
)
CommandEmpty.displayName = 'CommandEmpty'

interface CommandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

function CommandDialog({ open, onOpenChange, children }: CommandDialogProps) {
  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === Keys.Escape) onOpenChange(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 z-50"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandSeparator,
  CommandEmpty,
  CommandDialog,
}
