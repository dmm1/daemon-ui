import { createContext, useContext, useRef, useState, useCallback, useEffect, forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/cn'

interface CarouselContextValue {
  scrollRef: React.RefObject<HTMLDivElement | null>
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
}

const CarouselContext = createContext<CarouselContextValue | null>(null)

function useCarousel() {
  const ctx = useContext(CarouselContext)
  if (!ctx) throw new Error('useCarousel must be used within Carousel')
  return ctx
}

interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  autoPlay?: number
}

const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  ({ autoPlay, className, children, ...props }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(true)

    const updateScroll = useCallback(() => {
      if (!scrollRef.current) return
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollPrev(scrollLeft > 0)
      setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 1)
    }, [])

    const scrollPrev = useCallback(() => {
      if (!scrollRef.current) return
      scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth, behavior: 'smooth' })
    }, [])

    const scrollNext = useCallback(() => {
      if (!scrollRef.current) return
      scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth, behavior: 'smooth' })
    }, [])

    useEffect(() => {
      const el = scrollRef.current
      if (!el) return
      updateScroll()
      el.addEventListener('scroll', updateScroll, { passive: true })
      return () => el.removeEventListener('scroll', updateScroll)
    }, [updateScroll])

    useEffect(() => {
      if (!autoPlay || autoPlay <= 0) return
      const interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
          if (scrollLeft + clientWidth >= scrollWidth - 1) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
          } else {
            scrollNext()
          }
        }
      }, autoPlay)
      return () => clearInterval(interval)
    }, [autoPlay, scrollNext])

    return (
      <CarouselContext.Provider value={{ scrollRef, scrollPrev, scrollNext, canScrollPrev, canScrollNext }}>
        <div ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = 'Carousel'

const CarouselContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { scrollRef } = useCarousel()
    const combinedRef = (node: HTMLDivElement | null) => {
      (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
    }
    return (
      <div
        ref={combinedRef}
        className={cn(
          'flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4',
          className
        )}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        {...props}
      />
    )
  }
)
CarouselContent.displayName = 'CarouselContent'

const CarouselItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-none snap-start', className)} {...props} />
  )
)
CarouselItem.displayName = 'CarouselItem'

interface CarouselNavProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
}

const CarouselPrevious = forwardRef<HTMLButtonElement, CarouselNavProps>(
  ({ className, children, ...props }, ref) => {
    const { scrollPrev, canScrollPrev } = useCarousel()
    return (
      <button
        ref={ref}
        type="button"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className={cn(
          'absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 flex items-center justify-center',
          'border border-border bg-background-panel hover:bg-muted transition-colors',
          'disabled:opacity-30',
          className
        )}
        {...props}
      >
        {children ?? '←'}
      </button>
    )
  }
)
CarouselPrevious.displayName = 'CarouselPrevious'

const CarouselNext = forwardRef<HTMLButtonElement, CarouselNavProps>(
  ({ className, children, ...props }, ref) => {
    const { scrollNext, canScrollNext } = useCarousel()
    return (
      <button
        ref={ref}
        type="button"
        onClick={scrollNext}
        disabled={!canScrollNext}
        className={cn(
          'absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 flex items-center justify-center',
          'border border-border bg-background-panel hover:bg-muted transition-colors',
          'disabled:opacity-30',
          className
        )}
        {...props}
      >
        {children ?? '→'}
      </button>
    )
  }
)
CarouselNext.displayName = 'CarouselNext'

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext }
