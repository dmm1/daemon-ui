import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type HTMLAttributes,
} from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../lib/cn'

interface NavigationMenuContextValue {
  activeItem: string | null
  setActiveItem: (id: string | null) => void
}

const NavigationMenuContext = createContext<NavigationMenuContextValue | null>(
  null
)

function useNavigationMenu() {
  const ctx = useContext(NavigationMenuContext)
  if (!ctx)
    throw new Error(
      'NavigationMenu compound components must be used within <NavigationMenu>'
    )
  return ctx
}

interface NavigationMenuItemContextValue {
  id: string
  open: boolean
}

const NavigationMenuItemContext =
  createContext<NavigationMenuItemContextValue | null>(null)

function useNavigationMenuItem() {
  const ctx = useContext(NavigationMenuItemContext)
  if (!ctx) throw new Error('Must be used within <NavigationMenuItem>')
  return ctx
}

interface NavigationMenuProps extends HTMLAttributes<HTMLElement> {}

const NavigationMenu = forwardRef<HTMLElement, NavigationMenuProps>(
  ({ className, children, ...props }, ref) => {
    const [activeItem, setActiveItem] = useState<string | null>(null)

    return (
      <NavigationMenuContext.Provider value={{ activeItem, setActiveItem }}>
        <nav ref={ref} className={cn('relative', className)} {...props}>
          {children}
        </nav>
      </NavigationMenuContext.Provider>
    )
  }
)
NavigationMenu.displayName = 'NavigationMenu'

const NavigationMenuList = forwardRef<
  HTMLUListElement,
  HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex items-center gap-1', className)}
    {...props}
  />
))
NavigationMenuList.displayName = 'NavigationMenuList'

interface NavigationMenuItemProps extends HTMLAttributes<HTMLLIElement> {
  value: string
}

let navItemCounter = 0

const NavigationMenuItem = forwardRef<HTMLLIElement, NavigationMenuItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const { activeItem, setActiveItem } = useNavigationMenu()
    const id = value ?? `nav-item-${++navItemCounter}`
    const open = activeItem === id

    return (
      <NavigationMenuItemContext.Provider value={{ id, open }}>
        <li
          ref={ref}
          className={cn('relative', className)}
          onMouseEnter={() => setActiveItem(id)}
          onMouseLeave={() => setActiveItem(null)}
          {...props}
        >
          {children}
        </li>
      </NavigationMenuItemContext.Provider>
    )
  }
)
NavigationMenuItem.displayName = 'NavigationMenuItem'

const NavigationMenuTrigger = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { open } = useNavigationMenuItem()

  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={open}
      data-state={open ? 'open' : 'closed'}
      className={cn(
        'group flex items-center gap-1 px-3 py-2 text-xs font-mono uppercase tracking-wider text-foreground outline-none',
        'hover:text-primary',
        'focus-visible:ring-2 focus-visible:ring-ring',
        open && 'text-primary',
        className
      )}
      {...props}
    >
      {children}
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        className={cn(
          'transition-transform duration-200',
          open && 'rotate-180'
        )}
      >
        <path
          d="M2 4l3 3 3-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  )
})
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger'

interface NavigationMenuContentProps {
  className?: string
  children?: React.ReactNode
}

const NavigationMenuContent = forwardRef<
  HTMLDivElement,
  NavigationMenuContentProps
>(({ className, children }, ref) => {
  const { open } = useNavigationMenuItem()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute top-full left-0 w-max bg-background-panel border border-border p-4 shadow-lg z-50',
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
})
NavigationMenuContent.displayName = 'NavigationMenuContent'

interface NavigationMenuLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href?: string
  active?: boolean
}

const NavigationMenuLink = forwardRef<
  HTMLAnchorElement,
  NavigationMenuLinkProps
>(({ className, active, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      'block px-3 py-2 text-xs font-mono text-foreground outline-none transition-colors',
      'hover:text-primary hover:bg-primary/5',
      'focus-visible:ring-2 focus-visible:ring-ring',
      active && 'text-primary bg-primary/5',
      className
    )}
    {...props}
  />
))
NavigationMenuLink.displayName = 'NavigationMenuLink'

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
}
