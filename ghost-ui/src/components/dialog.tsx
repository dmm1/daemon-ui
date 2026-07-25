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

interface DialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = createContext<DialogContextValue | null>(null)

function useDialogContext() {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error('Dialog compounds must be used within <Dialog>')
  return ctx
}

interface DialogProps {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Dialog({ children, open: controlledOpen, onOpenChange }: DialogProps) {
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
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

interface DialogTriggerProps {
  children: ReactNode
  className?: string
}

export function DialogTrigger({ children, className }: DialogTriggerProps) {
  const { setOpen } = useDialogContext()
  return (
    <button type="button" className={className} onClick={() => setOpen(true)}>
      {children}
    </button>
  )
}

interface DialogContentProps {
  children: ReactNode
  className?: string
}

export function DialogContent({ children, className }: DialogContentProps) {
  const { open, setOpen } = useDialogContext()

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <DialogFocusTrap onEscape={() => setOpen(false)}>
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-background-panel border border-border p-6 font-mono shadow-lg',
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
              <DialogClose />
            </motion.div>
          </DialogFocusTrap>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

function DialogFocusTrap({
  children,
  onEscape,
}: {
  children: ReactNode
  onEscape: () => void
}) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === Keys.Escape) {
        onEscape()
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
    [onEscape]
  )

  return (
    <div onKeyDown={handleKeyDown} tabIndex={-1}>
      {children}
    </div>
  )
}

export function DialogClose({ className }: { className?: string }) {
  const { setOpen } = useDialogContext()
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

export function DialogHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-1.5', className)}>{children}</div>
}

export function DialogFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex justify-end gap-2 mt-4', className)}>{children}</div>
}

export function DialogTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-sm font-mono uppercase tracking-wider text-foreground-bright', className)}>
      {children}
    </h2>
  )
}

export function DialogDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-xs text-foreground-dim', className)}>{children}</p>
}
