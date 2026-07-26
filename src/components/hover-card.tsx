import {
  createContext,
  useContext,
  useState,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../lib/cn'
import { usePopperPosition, type Placement } from '../primitives/popper'

interface HoverCardContextValue {
  open: boolean
  triggerRef: RefObject<HTMLElement | null>
  show: () => void
  hide: () => void
}

const HoverCardContext = createContext<HoverCardContextValue | null>(null)

function useHoverCardContext() {
  const ctx = useContext(HoverCardContext)
  if (!ctx)
    throw new Error('HoverCard compounds must be used within <HoverCard>')
  return ctx
}

interface HoverCardProps {
  children: ReactNode
  enterDelay?: number
  leaveDelay?: number
}

export function HoverCard({
  children,
  enterDelay = 200,
  leaveDelay = 100,
}: HoverCardProps) {
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

export function HoverCardTrigger({
  children,
  className,
}: HoverCardTriggerProps) {
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

export function HoverCardContent({
  children,
  className,
  placement = 'bottom',
  offset = 8,
}: HoverCardContentProps) {
  const { open, triggerRef, show, hide } = useHoverCardContext()
  const { coords, transform } = usePopperPosition(triggerRef, {
    placement,
    offset,
    open,
  })

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
            transform,
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
