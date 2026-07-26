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
import { usePopperPosition, type Placement } from '../primitives/popper'

export function useTooltip({
  placement = 'top' as Placement,
  offset = 8,
  delay = 200,
} = {}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const show = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpen(true)
    }, delay)
  }, [delay])

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(false)
  }, [])

  return {
    open,
    triggerRef: triggerRef as RefObject<HTMLElement>,
    show,
    hide,
    placement,
    offset,
  }
}

interface TooltipPortalProps {
  open: boolean
  triggerRef: RefObject<Element | null>
  placement: Placement
  offset?: number
  children: ReactNode
  className?: string
}

export function TooltipPortal({
  open,
  triggerRef,
  placement,
  offset = 8,
  children,
  className,
}: TooltipPortalProps) {
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
          transition={{ duration: 0.1 }}
          style={{
            position: 'absolute',
            top: coords.top,
            left: coords.left,
            transform,
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

export function TooltipContent({
  title,
  description,
  items,
}: TooltipContentProps) {
  return (
    <div className="flex flex-col gap-1">
      {title && (
        <span className="text-foreground-bright font-mono text-xs uppercase tracking-wider">
          {title}
        </span>
      )}
      {items?.map((item) => (
        <div
          key={item.label}
          className="flex justify-between gap-4 text-[10px]"
        >
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
  triggerRef: RefObject<HTMLElement>
  placement: Placement
  offset: number
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
        triggerRef={tooltip.triggerRef}
        placement={tooltip.placement}
        offset={tooltip.offset}
        className={className}
      >
        {content}
      </TooltipPortal>
    </TooltipContext.Provider>
  )
}
