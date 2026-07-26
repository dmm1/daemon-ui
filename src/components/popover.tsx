import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../lib/cn'
import { usePopperPosition, type Placement } from '../primitives/popper'
import { useDismissableLayer } from '../primitives/dismissable'

interface PopoverContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: RefObject<HTMLButtonElement | null>
}

const PopoverContext = createContext<PopoverContextValue | null>(null)

function usePopoverContext() {
  const ctx = useContext(PopoverContext)
  if (!ctx)
    throw new Error('Popover compound components must be used within <Popover>')
  return ctx
}

interface PopoverProps {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Popover({
  children,
  open: controlledOpen,
  onOpenChange,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = useCallback(
    (v: boolean) => {
      setUncontrolledOpen(v)
      onOpenChange?.(v)
    },
    [onOpenChange]
  )
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  )
}

interface PopoverTriggerProps {
  children: ReactNode
  className?: string
  asChild?: boolean
}

export function PopoverTrigger({ children, className }: PopoverTriggerProps) {
  const { open, setOpen, triggerRef } = usePopoverContext()
  return (
    <button
      ref={triggerRef}
      type="button"
      className={className}
      onClick={() => setOpen(!open)}
      aria-haspopup="dialog"
      aria-expanded={open}
    >
      {children}
    </button>
  )
}

interface PopoverContentProps {
  children: ReactNode
  className?: string
  placement?: Placement
  offset?: number
}

export function PopoverContent({
  children,
  className,
  placement = 'bottom',
  offset = 8,
}: PopoverContentProps) {
  const { open, setOpen, triggerRef } = usePopoverContext()
  const contentRef = useRef<HTMLDivElement>(null)
  const { coords, transform } = usePopperPosition(triggerRef, {
    placement,
    offset,
    open,
  })

  useDismissableLayer(contentRef, {
    enabled: open,
    onDismiss: () => setOpen(false),
    ignoreRef: triggerRef,
  })

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'absolute',
            top: coords.top,
            left: coords.left,
            transform,
            zIndex: 50,
          }}
          className={cn(
            'bg-background-panel border border-border p-4 font-mono text-sm text-foreground shadow-lg',
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
