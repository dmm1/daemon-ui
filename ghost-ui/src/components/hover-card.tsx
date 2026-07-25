import {
  createContext,
  useContext,
  useState,
  useRef,
  useLayoutEffect,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../lib/cn'

type Placement = 'top' | 'bottom' | 'left' | 'right'

interface HoverCardContextValue {
  open: boolean
  triggerRef: RefObject<HTMLElement | null>
  show: () => void
  hide: () => void
}

const HoverCardContext = createContext<HoverCardContextValue | null>(null)

function useHoverCardContext() {
  const ctx = useContext(HoverCardContext)
  if (!ctx) throw new Error('HoverCard compounds must be used within <HoverCard>')
  return ctx
}

interface HoverCardProps {
  children: ReactNode
  enterDelay?: number
  leaveDelay?: number
}

export function HoverCard({ children, enterDelay = 200, leaveDelay = 100 }: HoverCardProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLElement>(null)
  const enterTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(null)

  const show = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    enterTimer.current = setTimeout(() => setOpen(true), enterDelay)
  }

  const hide = () => {
    if (enterTimer.current) clearTimeout(enterTimer.current)
    leaveTimer.current = setTimeout(() => setOpen(false), leaveDelay)
  }

  return (
    <HoverCardContext.Provider value={{ open, triggerRef, show, hide }}>
      {children}
    </HoverCardContext.Provider>
  )
}

interface HoverCardTriggerProps {
  children: ReactNode
  className?: string
}

export function HoverCardTrigger({ children, className }: HoverCardTriggerProps) {
  const { triggerRef, show, hide } = useHoverCardContext()
  return (
    <span
      ref={triggerRef as RefObject<HTMLSpanElement>}
      className={className}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
    </span>
  )
}

interface HoverCardContentProps {
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

function calcCoords(el: Element, placement: Placement, offset: number): Coords {
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

export function HoverCardContent({
  children,
  className,
  placement = 'bottom',
  offset = 8,
}: HoverCardContentProps) {
  const { open, triggerRef, show, hide } = useHoverCardContext()
  const [coords, setCoords] = useState<Coords>({ top: 0, left: 0 })

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    setCoords(calcCoords(triggerRef.current, placement, offset))

    const update = () => {
      if (triggerRef.current) setCoords(calcCoords(triggerRef.current, placement, offset))
    }
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, triggerRef, placement, offset])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          onMouseEnter={show}
          onMouseLeave={hide}
          style={{
            position: 'absolute',
            top: coords.top,
            left: coords.left,
            transform: placementTransforms[placement],
            zIndex: 50,
          }}
          className={cn(
            'w-64 bg-background-panel border border-border p-4 font-mono text-sm text-foreground shadow-lg',
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
