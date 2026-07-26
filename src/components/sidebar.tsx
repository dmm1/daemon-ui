import {
  createContext,
  useContext,
  useState,
  useCallback,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from 'react'
import { cn } from '../lib/cn'

interface SidebarContextValue {
  expanded: boolean
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}

interface SidebarProviderProps {
  defaultExpanded?: boolean
  children: ReactNode
}

function SidebarProvider({
  defaultExpanded = true,
  children,
}: SidebarProviderProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const toggle = useCallback(() => setExpanded((e) => !e), [])

  return (
    <SidebarContext.Provider value={{ expanded, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

const Sidebar = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => {
    const { expanded } = useSidebar()
    return (
      <aside
        ref={ref}
        className={cn(
          'fixed left-0 top-0 h-full bg-background-panel border-r border-border transition-all duration-200 flex flex-col z-40',
          expanded ? 'w-64' : 'w-14',
          className
        )}
        {...props}
      >
        {children}
      </aside>
    )
  }
)
Sidebar.displayName = 'Sidebar'

const SidebarHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-4 border-b border-border', className)}
    {...props}
  />
))
SidebarHeader.displayName = 'SidebarHeader'

const SidebarContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 overflow-y-auto py-2', className)}
    {...props}
  />
))
SidebarContent.displayName = 'SidebarContent'

const SidebarFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-4 border-t border-border', className)}
    {...props}
  />
))
SidebarFooter.displayName = 'SidebarFooter'

const SidebarMenu = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-0.5', className)}
      {...props}
    />
  )
)
SidebarMenu.displayName = 'SidebarMenu'

const SidebarMenuItem = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center', className)} {...props} />
))
SidebarMenuItem.displayName = 'SidebarMenuItem'

interface SidebarMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode
  active?: boolean
}

const SidebarMenuButton = forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ icon, active, className, children, ...props }, ref) => {
    const { expanded } = useSidebar()
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'flex items-center gap-3 w-full px-3 py-2 text-xs font-mono text-foreground hover:bg-primary/5 hover:text-primary transition-colors',
          !expanded && 'justify-center',
          active && 'text-primary bg-primary/5',
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {expanded && children}
      </button>
    )
  }
)
SidebarMenuButton.displayName = 'SidebarMenuButton'

const SidebarTrigger = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { toggle } = useSidebar()
  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      className={cn(
        'flex items-center justify-center h-8 w-8 text-foreground hover:text-primary transition-colors',
        className
      )}
      {...props}
    >
      {children ?? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 4h12M2 8h12M2 12h12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  )
})
SidebarTrigger.displayName = 'SidebarTrigger'

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
}
