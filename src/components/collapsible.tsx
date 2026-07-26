import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../lib/cn'

interface CollapsibleContextValue {
  open: boolean
  toggle: () => void
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null)

function useCollapsible() {
  const ctx = useContext(CollapsibleContext)
  if (!ctx) throw new Error('useCollapsible must be used within Collapsible')
  return ctx
}

interface CollapsibleProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen)
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen

    const toggle = useCallback(() => {
      const next = !open
      if (controlledOpen === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    }, [open, controlledOpen, onOpenChange])

    return (
      <CollapsibleContext.Provider value={{ open, toggle }}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </CollapsibleContext.Provider>
    )
  }
)
Collapsible.displayName = 'Collapsible'

const CollapsibleTrigger = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { open, toggle } = useCollapsible()
  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-expanded={open}
      aria-controls="collapsible-content"
      className={className}
      {...props}
    >
      {children}
    </button>
  )
})
CollapsibleTrigger.displayName = 'CollapsibleTrigger'

interface CollapsibleContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open } = useCollapsible()
    const contentRef = useRef<HTMLDivElement>(null)
    const [height, setHeight] = useState(0)

    useEffect(() => {
      if (contentRef.current) {
        setHeight(contentRef.current.scrollHeight)
      }
    }, [children, open])

    return (
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div ref={contentRef}>
              <div
                ref={ref}
                id="collapsible-content"
                className={cn('text-xs', className)}
                {...props}
              >
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)
CollapsibleContent.displayName = 'CollapsibleContent'

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
