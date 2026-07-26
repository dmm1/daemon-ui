import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '../lib/cn'

type Direction = 'horizontal' | 'vertical'

interface ResizableContextValue {
  direction: Direction
  sizes: number[]
  setSizes: (sizes: number[]) => void
  panelCount: number
  registerPanel: () => number
}

const ResizableContext = createContext<ResizableContextValue | null>(null)

function useResizable() {
  const ctx = useContext(ResizableContext)
  if (!ctx)
    throw new Error('useResizable must be used within ResizablePanelGroup')
  return ctx
}

interface ResizablePanelGroupProps extends HTMLAttributes<HTMLDivElement> {
  direction?: Direction
  children: ReactNode
}

const ResizablePanelGroup = forwardRef<
  HTMLDivElement,
  ResizablePanelGroupProps
>(({ direction = 'horizontal', className, children, ...props }, ref) => {
  const panelCountRef = useRef(0)
  const [sizes, setSizes] = useState<number[]>([])

  const registerPanel = useCallback(() => {
    const idx = panelCountRef.current++
    setSizes((prev) => {
      const next = [...prev, 50]
      const total = next.reduce((a, b) => a + b, 0)
      return next.map((s) => (s / total) * 100)
    })
    return idx
  }, [])

  return (
    <ResizableContext.Provider
      value={{
        direction,
        sizes,
        setSizes,
        panelCount: panelCountRef.current,
        registerPanel,
      }}
    >
      <div
        ref={ref}
        className={cn(
          'flex w-full h-full',
          direction === 'vertical' && 'flex-col',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ResizableContext.Provider>
  )
})
ResizablePanelGroup.displayName = 'ResizablePanelGroup'

interface ResizablePanelProps extends HTMLAttributes<HTMLDivElement> {
  defaultSize?: number
  minSize?: number
  maxSize?: number
}

const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(
  (
    { defaultSize, minSize, maxSize, className, style, children, ...props },
    ref
  ) => {
    const { direction, sizes, registerPanel } = useResizable()
    const indexRef = useRef<number | null>(null)
    if (indexRef.current === null) {
      indexRef.current = registerPanel()
    }
    const idx = indexRef.current

    const size = sizes[idx] ?? defaultSize ?? 50
    const flexStyle =
      direction === 'horizontal'
        ? {
            width: `${size}%`,
            minWidth: minSize ? `${minSize}%` : undefined,
            maxWidth: maxSize ? `${maxSize}%` : undefined,
          }
        : {
            height: `${size}%`,
            minHeight: minSize ? `${minSize}%` : undefined,
            maxHeight: maxSize ? `${maxSize}%` : undefined,
          }

    return (
      <div
        ref={ref}
        className={cn('overflow-auto', className)}
        style={{ ...flexStyle, ...style }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ResizablePanel.displayName = 'ResizablePanel'

interface ResizableHandleProps extends HTMLAttributes<HTMLDivElement> {
  index?: number
}

const ResizableHandle = forwardRef<HTMLDivElement, ResizableHandleProps>(
  ({ index = 0, className, ...props }, ref) => {
    const { direction, sizes, setSizes } = useResizable()
    const isDragging = useRef(false)
    const startPos = useRef(0)
    const startSizes = useRef<number[]>([])

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault()
        isDragging.current = true
        startPos.current = direction === 'horizontal' ? e.clientX : e.clientY
        startSizes.current = [...sizes]

        const parent = (e.target as HTMLElement).parentElement
        if (!parent) return

        const parentSize =
          direction === 'horizontal' ? parent.offsetWidth : parent.offsetHeight

        const handleMouseMove = (ev: MouseEvent) => {
          if (!isDragging.current) return
          const pos = direction === 'horizontal' ? ev.clientX : ev.clientY
          const delta = ((pos - startPos.current) / parentSize) * 100
          const next = [...startSizes.current]
          next[index] = Math.max(5, next[index] + delta)
          next[index + 1] = Math.max(5, next[index + 1] - delta)
          setSizes(next)
        }

        const handleMouseUp = () => {
          isDragging.current = false
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      },
      [direction, sizes, setSizes, index]
    )

    return (
      <div
        ref={ref}
        role="separator"
        onMouseDown={handleMouseDown}
        className={cn(
          'shrink-0 bg-border hover:bg-primary transition-colors',
          direction === 'horizontal'
            ? 'w-1 cursor-col-resize'
            : 'h-1 cursor-row-resize',
          className
        )}
        {...props}
      />
    )
  }
)
ResizableHandle.displayName = 'ResizableHandle'

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
