import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../lib/cn'
import { Keys } from '../lib/utils'

type Placement = 'top' | 'bottom' | 'left' | 'right'

interface PopoverContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: RefObject<HTMLButtonElement | null>
}

const PopoverContext = createContext<PopoverContextValue | null>(null)

function usePopoverContext() {
  const ctx = useContext(PopoverContext)
  if (!ctx) throw new Error('Popover compound components must be used within <Popover>')
  return ctx
}

interface PopoverProps {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Popover({ children, open: controlledOpen, onOpenChange }: PopoverProps) {
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

interface Coords {
  top: number
  left: number
}

const placementTransforms: Record<Placement, string> = {
  top: 'translate(-50%, -100%)',
  bottom: 'translate(-50%, 0)',
  left: 'translate(-100%, -50%)',
  right: 'translate(0, -50%)',
}

function calculateCoords(el: Element, placement: Placement, offset: number): Coords {
  const rect = el.getBoundingClientRect()
  switch (placement) {
    case 'top':
      return {
        top: rect.top + window.scrollY - offset,
        left: rect.left + window.scrollX + rect.width / 2,
      }
    case 'bottom':
      return {
        top: rect.bottom + window.scrollY + offset,
        left: rect.left + window.scrollX + rect.width / 2,
      }
    case 'left':
      return {
        top: rect.top + window.scrollY + rect.height / 2,
        left: rect.left + window.scrollX - offset,
      }
    case 'right':
      return {
        top: rect.top + window.scrollY + rect.height / 2,
        left: rect.right + window.scrollX + offset,
      }
  }
}

export function PopoverContent({
  children,
  className,
  placement = 'bottom',
  offset = 8,
}: PopoverContentProps) {
  const { open, setOpen, triggerRef } = usePopoverContext()
  const [coords, setCoords] = useState<Coords>({ top: 0, left: 0 })
  const contentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    setCoords(calculateCoords(triggerRef.current, placement, offset))

    const update = () => {
      if (triggerRef.current) {
        setCoords(calculateCoords(triggerRef.current, placement, offset))
      }
    }
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, triggerRef, placement, offset])

  useLayoutEffect(() => {
    if (!open) return

    function handleClickOutside(e: MouseEvent) {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === Keys.Escape) setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, setOpen, triggerRef])

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
            transform: placementTransforms[placement],
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
