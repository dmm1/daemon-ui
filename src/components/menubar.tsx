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
import { usePopperPosition } from '../primitives/popper'
import { useDismissableLayer } from '../primitives/dismissable'

interface MenubarContextValue {
  activeMenu: string | null
  setActiveMenu: (id: string | null) => void
  registerMenu: (id: string) => void
  unregisterMenu: (id: string) => void
  menuIds: string[]
}

const MenubarContext = createContext<MenubarContextValue | null>(null)

function useMenubar() {
  const ctx = useContext(MenubarContext)
  if (!ctx)
    throw new Error('Menubar compound components must be used within <Menubar>')
  return ctx
}

interface MenubarMenuContextValue {
  id: string
  open: boolean
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const MenubarMenuContext = createContext<MenubarMenuContextValue | null>(null)

function useMenubarMenu() {
  const ctx = useContext(MenubarMenuContext)
  if (!ctx)
    throw new Error(
      'MenubarMenu compound components must be used within <MenubarMenu>'
    )
  return ctx
}

interface MenubarProps extends HTMLAttributes<HTMLDivElement> {}

const Menubar = forwardRef<HTMLDivElement, MenubarProps>(
  ({ className, children, ...props }, ref) => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const menuIdsRef = useRef<string[]>([])
    const [menuIds, setMenuIds] = useState<string[]>([])

    const registerMenu = useCallback((id: string) => {
      menuIdsRef.current = [...menuIdsRef.current, id]
      setMenuIds([...menuIdsRef.current])
    }, [])

    const unregisterMenu = useCallback((id: string) => {
      menuIdsRef.current = menuIdsRef.current.filter((m) => m !== id)
      setMenuIds([...menuIdsRef.current])
    }, [])

    return (
      <MenubarContext.Provider
        value={{
          activeMenu,
          setActiveMenu,
          registerMenu,
          unregisterMenu,
          menuIds,
        }}
      >
        <div
          ref={ref}
          role="menubar"
          className={cn(
            'flex items-center gap-1 border border-border bg-background-panel p-1',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </MenubarContext.Provider>
    )
  }
)
Menubar.displayName = 'Menubar'

interface MenubarMenuProps {
  children: ReactNode
  id?: string
}

let menuIdCounter = 0

function MenubarMenu({ children, id }: MenubarMenuProps) {
  const { activeMenu, registerMenu, unregisterMenu } = useMenubar()
  const menuId = useRef(id ?? `menubar-menu-${++menuIdCounter}`).current
  const triggerRef = useRef<HTMLButtonElement>(null)
  const open = activeMenu === menuId

  useEffect(() => {
    registerMenu(menuId)
    return () => unregisterMenu(menuId)
  }, [menuId, registerMenu, unregisterMenu])

  return (
    <MenubarMenuContext.Provider value={{ id: menuId, open, triggerRef }}>
      {children}
    </MenubarMenuContext.Provider>
  )
}

const MenubarTrigger = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>(({ className, onClick, onKeyDown, ...props }, ref) => {
  const { activeMenu, setActiveMenu, menuIds } = useMenubar()
  const { id, open, triggerRef } = useMenubarMenu()

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
      role="menuitem"
      aria-expanded={open}
      aria-haspopup="menu"
      data-state={open ? 'open' : 'closed'}
      className={cn(
        'px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-foreground outline-none',
        'hover:text-primary hover:bg-primary/5',
        'focus-visible:ring-2 focus-visible:ring-ring',
        open && 'text-primary bg-primary/5',
        className
      )}
      onClick={(e) => {
        setActiveMenu(open ? null : id)
        onClick?.(e)
      }}
      onKeyDown={(e) => {
        if (e.key === Keys.ArrowRight || e.key === Keys.ArrowLeft) {
          e.preventDefault()
          const currentIdx = menuIds.indexOf(id)
          const nextIdx =
            e.key === Keys.ArrowRight
              ? (currentIdx + 1) % menuIds.length
              : (currentIdx - 1 + menuIds.length) % menuIds.length

          if (activeMenu) setActiveMenu(menuIds[nextIdx])
          const triggers = triggerRef.current
            ?.closest('[role="menubar"]')
            ?.querySelectorAll<HTMLElement>('[role="menuitem"]')
          triggers?.[nextIdx]?.focus()
        }
        onKeyDown?.(e)
      }}
      onMouseEnter={() => {
        if (activeMenu && activeMenu !== id) setActiveMenu(id)
      }}
      {...props}
    />
  )
})
MenubarTrigger.displayName = 'MenubarTrigger'

interface MenubarContentProps {
  className?: string
  children?: ReactNode
}

const MenubarContent = forwardRef<HTMLDivElement, MenubarContentProps>(
  ({ className, children }, ref) => {
    const { setActiveMenu } = useMenubar()
    const { open, triggerRef } = useMenubarMenu()
    const contentRef = useRef<HTMLDivElement>(null)
    const activeIndex = useRef(-1)

    const { coords, transform } = usePopperPosition(triggerRef, {
      placement: 'bottom',
      align: 'start',
      offset: 4,
      open,
    })

    useDismissableLayer(contentRef, {
      enabled: open,
      onDismiss: () => setActiveMenu(null),
      onEscape: () => triggerRef.current?.focus(),
      ignoreRef: triggerRef,
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
              position: 'absolute',
              top: coords.top,
              left: coords.left,
              transform,
              transformOrigin: 'top left',
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
MenubarContent.displayName = 'MenubarContent'

interface MenubarItemProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean
  onSelect?: () => void
}

const MenubarItem = forwardRef<HTMLDivElement, MenubarItemProps>(
  ({ className, disabled, onSelect, onClick, onKeyDown, ...props }, ref) => {
    const { setActiveMenu } = useMenubar()

    function handleSelect() {
      if (disabled) return
      onSelect?.()
      setActiveMenu(null)
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
MenubarItem.displayName = 'MenubarItem'

const MenubarSeparator = forwardRef<
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
MenubarSeparator.displayName = 'MenubarSeparator'

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
}
