import {
  createContext,
  useState,
  useRef,
  useCallback,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../lib/cn'

type Placement = 'top' | 'bottom' | 'left' | 'right'

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

function calculatePosition(
  reference: Element,
  placement: Placement,
  offset: number
): Coords {
  const rect = reference.getBoundingClientRect()
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

export function useTooltip({
  placement = 'top' as Placement,
  offset = 8,
  delay = 200,
} = {}) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<Coords>({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    setCoords(calculatePosition(triggerRef.current, placement, offset))
  }, [placement, offset])

  const show = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      updatePosition()
      setOpen(true)
    }, delay)
  }, [delay, updatePosition])

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(false)
  }, [])

  return {
    open,
    coords,
    triggerRef: triggerRef as RefObject<HTMLElement>,
    show,
    hide,
    placement,
  }
}

interface TooltipPortalProps {
  open: boolean
  coords: Coords
  placement: Placement
  children: ReactNode
  className?: string
}

export function TooltipPortal({
  open,
  coords,
  placement,
  children,
  className,
}: TooltipPortalProps) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          style={{
            position: 'absolute',
            top: coords.top,
            left: coords.left,
            transform: placementTransforms[placement],
            zIndex: 9999,
          }}
          className={cn(
            'bg-background-panel border border-border px-3 py-2 text-xs font-mono text-foreground shadow-lg',
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

interface TooltipContentProps {
  title?: string
  description?: string
  items?: Array<{ label: string; value: string }>
}

export function TooltipContent({ title, description, items }: TooltipContentProps) {
  return (
    <div className="flex flex-col gap-1">
      {title && (
        <span className="text-foreground-bright font-mono text-xs uppercase tracking-wider">
          {title}
        </span>
      )}
      {items?.map((item) => (
        <div key={item.label} className="flex justify-between gap-4 text-[10px]">
          <span className="text-foreground-dim">{item.label}</span>
          <span className="text-foreground">{item.value}</span>
        </div>
      ))}
      {description && (
        <span className="text-foreground-dim text-[10px]">{description}</span>
      )}
    </div>
  )
}

interface TooltipContextValue {
  open: boolean
  coords: Coords
  triggerRef: RefObject<HTMLElement>
  placement: Placement
  show: () => void
  hide: () => void
}

const TooltipContext = createContext<TooltipContextValue | null>(null)

interface TooltipProps {
  children: ReactNode
  content: ReactNode
  placement?: Placement
  offset?: number
  delay?: number
  className?: string
}

export function Tooltip({
  children,
  content,
  placement = 'top',
  offset = 8,
  delay = 200,
  className,
}: TooltipProps) {
  const tooltip = useTooltip({ placement, offset, delay })

  return (
    <TooltipContext.Provider value={tooltip}>
      <span
        ref={tooltip.triggerRef as RefObject<HTMLSpanElement>}
        tabIndex={0}
        onMouseEnter={tooltip.show}
        onMouseLeave={tooltip.hide}
        onFocus={tooltip.show}
        onBlur={tooltip.hide}
      >
        {children}
      </span>
      <TooltipPortal
        open={tooltip.open}
        coords={tooltip.coords}
        placement={tooltip.placement}
        className={className}
      >
        {content}
      </TooltipPortal>
    </TooltipContext.Provider>
  )
}
