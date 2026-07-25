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
import { usePopperPosition, type Align } from '../primitives/popper'
import { useDismissableLayer } from '../primitives/dismissable'

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null)

function useDropdownMenu() {
  const ctx = useContext(DropdownMenuContext)
  if (!ctx) throw new Error('DropdownMenu compound components must be used within <DropdownMenu>')
  return ctx
}

interface DropdownMenuProps {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function DropdownMenu({ children, open: controlledOpen, onOpenChange }: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = useCallback(
    (v: boolean) => {
      setUncontrolledOpen(v)
      onOpenChange?.(v)
    },
    [onOpenChange]
  )

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

const DropdownMenuTrigger = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  const { open, setOpen, triggerRef } = useDropdownMenu()

  return (
    <button
      ref={(node) => {
        (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
      }}
      type="button"
      aria-expanded={open}
      aria-haspopup="menu"
      className={cn('inline-flex items-center justify-center', className)}
      onClick={(e) => {
        setOpen(!open)
        onClick?.(e)
      }}
      {...props}
    />
  )
})
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

interface DropdownMenuContentProps {
  className?: string
  align?: Align
  sideOffset?: number
  children?: ReactNode
}

const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, align = 'start', sideOffset = 4, children }, ref) => {
    const { open, setOpen, triggerRef } = useDropdownMenu()
    const contentRef = useRef<HTMLDivElement>(null)
    const activeIndex = useRef(-1)

    const { coords, transform } = usePopperPosition(triggerRef, {
      placement: 'bottom',
      align,
      offset: sideOffset,
      open,
    })

    useDismissableLayer(contentRef, {
      enabled: open,
      onDismiss: () => setOpen(false),
      onEscape: () => triggerRef.current?.focus(),
      ignoreRef: triggerRef,
    })

    useEffect(() => {
      if (!open) return

      function handleKeyDown(e: KeyboardEvent) {
        const items = contentRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([data-disabled])')
        if (!items?.length) return

        if (e.key === Keys.ArrowDown) {
          e.preventDefault()
          activeIndex.current = Math.min(activeIndex.current + 1, items.length - 1)
          items[activeIndex.current]?.focus()
        } else if (e.key === Keys.ArrowUp) {
          e.preventDefault()
          activeIndex.current = Math.max(activeIndex.current - 1, 0)
          items[activeIndex.current]?.focus()
        } else if (e.key === Keys.Home) {
          e.preventDefault()
          activeIndex.current = 0
          items[0]?.focus()
        } else if (e.key === Keys.End) {
          e.preventDefault()
          activeIndex.current = items.length - 1
          items[items.length - 1]?.focus()
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [open])

    useEffect(() => {
      if (open) activeIndex.current = -1
    }, [open])

    const transformOrigin =
      align === 'end' ? 'top right' : align === 'center' ? 'top center' : 'top left'

    return createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            ref={(node) => {
              (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node
              if (typeof ref === 'function') ref(node)
              else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
            }}
            role="menu"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: coords.top,
              left: coords.left,
              transform,
              transformOrigin,
              zIndex: 50,
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
DropdownMenuContent.displayName = 'DropdownMenuContent'

interface DropdownMenuItemProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean
  onSelect?: () => void
}

const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className, disabled, onSelect, onClick, onKeyDown, ...props }, ref) => {
    const { setOpen } = useDropdownMenu()

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
DropdownMenuItem.displayName = 'DropdownMenuItem'

const DropdownMenuSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn('h-px bg-border mx-2 my-1', className)}
      {...props}
    />
  )
)
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'

const DropdownMenuLabel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-foreground-dim font-mono',
        className
      )}
      {...props}
    />
  )
)
DropdownMenuLabel.displayName = 'DropdownMenuLabel'

const DropdownMenuGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => <div ref={ref} role="group" {...props} />
)
DropdownMenuGroup.displayName = 'DropdownMenuGroup'

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
}
