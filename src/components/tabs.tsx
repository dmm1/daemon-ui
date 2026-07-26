import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useRef,
  useState,
  type HTMLAttributes,
} from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../lib/cn'
import { Keys } from '../lib/utils'

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx)
    throw new Error('Tabs compound components must be used within <Tabs>')
  return ctx
}

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue = '',
      onValueChange,
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
    const value = controlledValue ?? uncontrolledValue

    const handleValueChange = useCallback(
      (v: string) => {
        setUncontrolledValue(v)
        onValueChange?.(v)
      },
      [onValueChange]
    )

    return (
      <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = 'Tabs'

const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1 border-b border-border',
        className
      )}
      {...props}
    />
  )
)
TabsList.displayName = 'TabsList'

interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string
  disabled?: boolean
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, disabled, onClick, onKeyDown, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useTabs()
    const isActive = selectedValue === value
    const triggerRef = useRef<HTMLButtonElement>(null)

    return (
      <button
        ref={(node) => {
          ;(
            triggerRef as React.MutableRefObject<HTMLButtonElement | null>
          ).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref)
            (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
              node
        }}
        type="button"
        role="tab"
        id={`tab-${value}`}
        aria-selected={isActive}
        aria-controls={`tabpanel-${value}`}
        tabIndex={isActive ? 0 : -1}
        disabled={disabled}
        data-state={isActive ? 'active' : 'inactive'}
        className={cn(
          'px-4 py-2 text-xs font-mono uppercase tracking-wider text-foreground-dim transition-all outline-none',
          'hover:text-foreground',
          'focus-visible:ring-2 focus-visible:ring-ring',
          isActive && 'text-primary border-b-2 border-primary',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        onClick={(e) => {
          if (!disabled) onValueChange(value)
          onClick?.(e)
        }}
        onKeyDown={(e) => {
          if (e.key === Keys.ArrowLeft || e.key === Keys.ArrowRight) {
            e.preventDefault()
            const tablist = triggerRef.current?.closest('[role="tablist"]')
            const tabs = tablist?.querySelectorAll<HTMLButtonElement>(
              '[role="tab"]:not([disabled])'
            )
            if (!tabs?.length) return

            const currentIdx = Array.from(tabs).indexOf(triggerRef.current!)
            const nextIdx =
              e.key === Keys.ArrowRight
                ? (currentIdx + 1) % tabs.length
                : (currentIdx - 1 + tabs.length) % tabs.length

            const nextTab = tabs[nextIdx]
            nextTab?.focus()
            const nextValue = nextTab
              ?.getAttribute('aria-controls')
              ?.replace('tabpanel-', '')
            if (nextValue) onValueChange(nextValue)
          }
          onKeyDown?.(e)
        }}
        {...props}
      />
    )
  }
)
TabsTrigger.displayName = 'TabsTrigger'

interface TabsContentProps {
  className?: string
  value: string
  forceMount?: boolean
  children?: React.ReactNode
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, forceMount, children }, ref) => {
    const { value: selectedValue } = useTabs()
    const isActive = selectedValue === value

    if (!forceMount && !isActive) return null

    return (
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            key={value}
            ref={ref}
            role="tabpanel"
            id={`tabpanel-${value}`}
            aria-labelledby={`tab-${value}`}
            tabIndex={0}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={cn('mt-4 outline-none', className)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
