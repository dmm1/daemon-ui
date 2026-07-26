import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../lib/cn'
import { Keys } from '../lib/utils'
import { useDismissableLayer } from '../primitives/dismissable'

interface ContextMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  position: { x: number; y: number }
  setPosition: (pos: { x: number; y: number }) => void
}

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null)

function useContextMenu() {
  const ctx = useContext(ContextMenuContext)
  if (!ctx)
    throw new Error(
      'ContextMenu compound components must be used within <ContextMenu>'
    )
  return ctx
}

interface ContextMenuProps {
  children: ReactNode
  onOpenChange?: (open: boolean) => void
}

function ContextMenu({ children, onOpenChange }: ContextMenuProps) {
  const [open, setOpenState] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const setOpen = useCallback(
    (v: boolean) => {
      setOpenState(v)
      onOpenChange?.(v)
    },
    [onOpenChange]
  )

  return (
    <ContextMenuContext.Provider
      value={{ open, setOpen, position, setPosition }}
    >
      {children}
    </ContextMenuContext.Provider>
  )
}

interface ContextMenuTriggerProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const ContextMenuTrigger = forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
  ({ className, onContextMenu, ...props }, ref) => {
    const { setOpen, setPosition } = useContextMenu()

    return (
      <div
        ref={ref}
        className={className}
        onContextMenu={(e) => {
          e.preventDefault()
          setPosition({ x: e.clientX, y: e.clientY })
          setOpen(true)
          onContextMenu?.(e)
        }}
        {...props}
      />
    )
  }
)
ContextMenuTrigger.displayName = 'ContextMenuTrigger'

interface ContextMenuContentProps {
  className?: string
  children?: ReactNode
}

const ContextMenuContent = forwardRef<HTMLDivElement, ContextMenuContentProps>(
  ({ className, children }, ref) => {
    const { open, setOpen, position } = useContextMenu()
    const contentRef = useRef<HTMLDivElement>(null)
    const activeIndex = useRef(-1)

    useDismissableLayer(contentRef, {
      enabled: open,
      onDismiss: () => setOpen(false),
    })

    useEffect(() => {
      if (!open) return

      function handleKeyDown(e: KeyboardEvent) {
        const items = contentRef.current?.querySelectorAll<HTMLElement>(
          '[role="menuitem"]:not([data-disabled])'
        )
        if (!items?.length) return

        if (e.key === Keys.ArrowDown) {
          e.preventDefault()
          activeIndex.current = Math.min(
            activeIndex.current + 1,
            items.length - 1
          )
          items[activeIndex.current]?.focus()
        } else if (e.key === Keys.ArrowUp) {
          e.preventDefault()
          activeIndex.current = Math.max(activeIndex.current - 1, 0)
          items[activeIndex.current]?.focus()
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [open])

    useEffect(() => {
      if (open) activeIndex.current = -1
    }, [open])

    return createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            ref={(node) => {
              ;(
                contentRef as React.MutableRefObject<HTMLDivElement | null>
              ).current = node
              if (typeof ref === 'function') ref(node)
              else if (ref)
                (ref as React.MutableRefObject<HTMLDivElement | null>).current =
                  node
            }}
            role="menu"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              top: position.y,
              left: position.x,
              zIndex: 50,
              transformOrigin: 'top left',
            }}
            className={cn(
              'bg-background-panel border border-border py-1 min-w-[180px] shadow-lg',
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
)
ContextMenuContent.displayName = 'ContextMenuContent'

interface ContextMenuItemProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean
  onSelect?: () => void
}

const ContextMenuItem = forwardRef<HTMLDivElement, ContextMenuItemProps>(
  ({ className, disabled, onSelect, onClick, onKeyDown, ...props }, ref) => {
    const { setOpen } = useContextMenu()

    function handleSelect() {
      if (disabled) return
      onSelect?.()
      setOpen(false)
    }

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        data-disabled={disabled ? '' : undefined}
        aria-disabled={disabled}
        className={cn(
          'flex items-center px-3 py-2 text-xs font-mono text-foreground cursor-pointer outline-none',
          'hover:bg-primary/5 hover:text-primary',
          'focus-visible:bg-primary/5 focus-visible:text-primary',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        onClick={(e) => {
          handleSelect()
          onClick?.(e)
        }}
        onKeyDown={(e) => {
          if (e.key === Keys.Enter || e.key === Keys.Space) {
            e.preventDefault()
            handleSelect()
          }
          onKeyDown?.(e)
        }}
        {...props}
      />
    )
  }
)
ContextMenuItem.displayName = 'ContextMenuItem'

const ContextMenuSeparator = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn('h-px bg-border mx-2 my-1', className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = 'ContextMenuSeparator'

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
}
