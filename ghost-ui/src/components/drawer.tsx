import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, type PanInfo } from 'motion/react'
import { cn } from '../lib/cn'
import { Keys } from '../lib/utils'

interface DrawerContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DrawerContext = createContext<DrawerContextValue | null>(null)

function useDrawerContext() {
  const ctx = useContext(DrawerContext)
  if (!ctx) throw new Error('Drawer compounds must be used within <Drawer>')
  return ctx
}

interface DrawerProps {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Drawer({ children, open: controlledOpen, onOpenChange }: DrawerProps) {
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
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  )
}

export function DrawerTrigger({ children, className }: { children: ReactNode; className?: string }) {
  const { setOpen } = useDrawerContext()
  return (
    <button type="button" className={className} onClick={() => setOpen(true)}>
      {children}
    </button>
  )
}

interface DrawerContentProps {
  children: ReactNode
  className?: string
}

export function DrawerContent({ children, className }: DrawerContentProps) {
  const { open, setOpen } = useDrawerContext()

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === Keys.Escape) setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, setOpen])

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y > 100 || info.velocity.y > 500) {
        setOpen(false)
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
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={cn(
              'fixed inset-x-0 bottom-0 z-50 bg-background-panel border-t border-border rounded-t-lg max-h-[85vh] font-mono shadow-lg',
              className
            )}
          >
            <div className="w-12 h-1 bg-foreground-dim/30 rounded-full mx-auto mt-3 mb-2" />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export function DrawerHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-1.5 px-6 pb-2', className)}>{children}</div>
}

export function DrawerFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex justify-end gap-2 px-6 py-4', className)}>{children}</div>
}

export function DrawerTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-sm font-mono uppercase tracking-wider text-foreground-bright', className)}>
      {children}
    </h2>
  )
}

export function DrawerDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-xs text-foreground-dim', className)}>{children}</p>
}
