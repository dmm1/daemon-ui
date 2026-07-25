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

type AccordionType = 'single' | 'multiple'

interface AccordionContextValue {
  type: AccordionType
  value: string[]
  toggle: (item: string) => void
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

function useAccordion() {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error('useAccordion must be used within Accordion')
  return ctx
}

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  type?: AccordionType
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ type = 'single', value: controlledValue, defaultValue, onValueChange, className, children, ...props }, ref) => {
    const normalize = (v?: string | string[]) =>
      v == null ? [] : Array.isArray(v) ? v : [v]

    const [internalValue, setInternalValue] = useState<string[]>(normalize(defaultValue))
    const value = controlledValue !== undefined ? normalize(controlledValue) : internalValue

    const toggle = useCallback(
      (item: string) => {
        const next =
          type === 'single'
            ? value.includes(item) ? [] : [item]
            : value.includes(item)
              ? value.filter((v) => v !== item)
              : [...value, item]

        if (controlledValue === undefined) setInternalValue(next)
        onValueChange?.(type === 'single' ? (next[0] ?? '') : next)
      },
      [type, value, controlledValue, onValueChange]
    )

    return (
      <AccordionContext.Provider value={{ type, value, toggle }}>
        <div ref={ref} className={cn('divide-y divide-border', className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = 'Accordion'

interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string
}

const AccordionItemContext = createContext<string>('')

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, className, ...props }, ref) => (
    <AccordionItemContext.Provider value={value}>
      <div ref={ref} className={cn('border-b border-border', className)} {...props} />
    </AccordionItemContext.Provider>
  )
)
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const { value, toggle } = useAccordion()
    const itemValue = useContext(AccordionItemContext)
    const isOpen = value.includes(itemValue)

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => toggle(itemValue)}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${itemValue}`}
        className={cn(
          'flex w-full items-center justify-between py-3 px-4 text-xs font-mono uppercase tracking-wider text-foreground hover:text-primary transition-all',
          className
        )}
        {...props}
      >
        {children}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={cn('shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    )
  }
)
AccordionTrigger.displayName = 'AccordionTrigger'

interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { value } = useAccordion()
    const itemValue = useContext(AccordionItemContext)
    const isOpen = value.includes(itemValue)
    const contentRef = useRef<HTMLDivElement>(null)
    const [height, setHeight] = useState(0)

    useEffect(() => {
      if (contentRef.current) {
        setHeight(contentRef.current.scrollHeight)
      }
    }, [children, isOpen])

    return (
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div ref={contentRef}>
              <div ref={ref} id={`accordion-content-${itemValue}`} className={cn('px-4 pb-3 text-xs text-foreground', className)} {...props}>
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
