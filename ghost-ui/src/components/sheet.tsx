import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../lib/cn'
import { getFocusableElements, Keys } from '../lib/utils'

type Side = 'top' | 'right' | 'bottom' | 'left'

interface SheetContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const SheetContext = createContext<SheetContextValue | null>(null)

function useSheetContext() {
  const ctx = useContext(SheetContext)
  if (!ctx) throw new Error('Sheet compounds must be used within <Sheet>')
  return ctx
}

interface SheetProps {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Sheet({ children, open: controlledOpen, onOpenChange }: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = useCallback(
    (v: boolean) => {
      setUncontrolledOpen(v)
      onOpenChange?.(v)
    },
    [onOpenChange]
  )

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

export function SheetTrigger({ children, className }: { children: ReactNode; className?: string }) {
  const { setOpen } = useSheetContext()
  return (
    <button type="button" className={className} onClick={() => setOpen(true)}>
      {children}
    </button>
  )
}

const sideClasses: Record<Side, string> = {
  right: 'fixed inset-y-0 right-0 w-3/4 max-w-sm border-l',
  left: 'fixed inset-y-0 left-0 w-3/4 max-w-sm border-r',
  top: 'fixed inset-x-0 top-0 h-auto max-h-[50vh] border-b',
  bottom: 'fixed inset-x-0 bottom-0 h-auto max-h-[50vh] border-t',
}

const slideVariants: Record<Side, { initial: Record<string, number>; animate: Record<string, number> }> = {
  right: { initial: { x: 300 }, animate: { x: 0 } },
  left: { initial: { x: -300 }, animate: { x: 0 } },
  top: { initial: { y: -300 }, animate: { y: 0 } },
  bottom: { initial: { y: 300 }, animate: { y: 0 } },
}

interface SheetContentProps {
  children: ReactNode
  className?: string
  side?: Side
}

export function SheetContent({ children, className, side = 'right' }: SheetContentProps) {
  const { open, setOpen } = useSheetContext()

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === Keys.Escape) {
        setOpen(false)
        return
      }
      if (e.key !== Keys.Tab) return

      const container = e.currentTarget
      const elements = getFocusableElements(container)
      if (elements.length === 0) return

      const first = elements[0]
      const last = elements[elements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [setOpen]
  )

  const slide = slideVariants[side]

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div onKeyDown={handleKeyDown} tabIndex={-1}>
            <motion.div
              initial={{ opacity: 0, ...slide.initial }}
              animate={{ opacity: 1, ...slide.animate }}
              exit={{ opacity: 0, ...slide.initial }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className={cn(
                'z-50 bg-background-panel border-border p-6 font-mono shadow-lg',
                sideClasses[side],
                className
              )}
            >
              {children}
              <SheetClose />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export function SheetClose({ className }: { className?: string }) {
  const { setOpen } = useSheetContext()
  return (
    <button
      type="button"
      onClick={() => setOpen(false)}
      className={cn(
        'absolute right-4 top-4 text-foreground-dim hover:text-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      aria-label="Close"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 1l12 12M13 1L1 13" />
      </svg>
    </button>
  )
}

export function SheetHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-1.5 mb-4', className)}>{children}</div>
}

export function SheetFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex justify-end gap-2 mt-4', className)}>{children}</div>
}

export function SheetTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-sm font-mono uppercase tracking-wider text-foreground-bright', className)}>
      {children}
    </h2>
  )
}

export function SheetDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-xs text-foreground-dim', className)}>{children}</p>
}
