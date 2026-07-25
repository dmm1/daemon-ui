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

interface AlertDialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null)

function useAlertDialogContext() {
  const ctx = useContext(AlertDialogContext)
  if (!ctx) throw new Error('AlertDialog compounds must be used within <AlertDialog>')
  return ctx
}

interface AlertDialogProps {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AlertDialog({ children, open: controlledOpen, onOpenChange }: AlertDialogProps) {
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
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  )
}

interface AlertDialogTriggerProps {
  children: ReactNode
  className?: string
}

export function AlertDialogTrigger({ children, className }: AlertDialogTriggerProps) {
  const { setOpen } = useAlertDialogContext()
  return (
    <button type="button" className={className} onClick={() => setOpen(true)}>
      {children}
    </button>
  )
}

interface AlertDialogContentProps {
  children: ReactNode
  className?: string
}

export function AlertDialogContent({ children, className }: AlertDialogContentProps) {
  const { open, setOpen } = useAlertDialogContext()

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
          />
          <div onKeyDown={handleKeyDown} tabIndex={-1}>
            <motion.div
              role="alertdialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-background-panel border border-border p-6 font-mono shadow-lg',
                className
              )}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export function AlertDialogHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-1.5', className)}>{children}</div>
}

export function AlertDialogFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex justify-end gap-2 mt-4', className)}>{children}</div>
}

export function AlertDialogTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-sm font-mono uppercase tracking-wider text-foreground-bright', className)}>
      {children}
    </h2>
  )
}

export function AlertDialogDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-xs text-foreground-dim', className)}>{children}</p>
}

interface AlertDialogActionProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function AlertDialogAction({ children, className, onClick }: AlertDialogActionProps) {
  const { setOpen } = useAlertDialogContext()
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider h-10 px-5 border border-error text-error hover:bg-error hover:text-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      onClick={() => {
        onClick?.()
        setOpen(false)
      }}
    >
      {children}
    </button>
  )
}

interface AlertDialogCancelProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function AlertDialogCancel({ children, className, onClick }: AlertDialogCancelProps) {
  const { setOpen } = useAlertDialogContext()
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider h-10 px-5 border border-border text-foreground hover:border-primary hover:text-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      onClick={() => {
        onClick?.()
        setOpen(false)
      }}
    >
      {children}
    </button>
  )
}
