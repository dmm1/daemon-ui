import { useState, useLayoutEffect, useCallback, type ReactNode, type RefObject } from 'react'
import { Portal } from './portal'

export type Placement = 'top' | 'bottom' | 'left' | 'right'
export type Align = 'start' | 'center' | 'end'

export interface Coords {
  top: number
  left: number
}

function calculateCoords(
  reference: Element,
  placement: Placement,
  align: Align,
  offset: number
): Coords {
  const rect = reference.getBoundingClientRect()

  if (placement === 'top' || placement === 'bottom') {
    const top =
      placement === 'top'
        ? rect.top + window.scrollY - offset
        : rect.bottom + window.scrollY + offset
    const left =
      align === 'start'
        ? rect.left + window.scrollX
        : align === 'end'
          ? rect.right + window.scrollX
          : rect.left + window.scrollX + rect.width / 2
    return { top, left }
  }

  const left =
    placement === 'left'
      ? rect.left + window.scrollX - offset
      : rect.right + window.scrollX + offset
  const top =
    align === 'start'
      ? rect.top + window.scrollY
      : align === 'end'
        ? rect.bottom + window.scrollY
        : rect.top + window.scrollY + rect.height / 2
  return { top, left }
}

function calculateTransform(placement: Placement, align: Align): string {
  const alongAxis = align === 'start' ? '0' : align === 'end' ? '-100%' : '-50%'
  const horizontal = placement === 'left' ? '-100%' : placement === 'right' ? '0' : alongAxis
  const vertical = placement === 'top' ? '-100%' : placement === 'bottom' ? '0' : alongAxis
  return `translate(${horizontal}, ${vertical})`
}

/**
 * Shared reference-anchored positioning for overlays (popovers, menus, tooltips).
 * Tracks the reference element's rect while `open`, recomputing on scroll/resize.
 */
export function usePopperPosition(
  referenceRef: RefObject<Element | null>,
  {
    placement = 'bottom',
    align = 'center',
    offset = 8,
    open,
  }: { placement?: Placement; align?: Align; offset?: number; open: boolean }
): { coords: Coords; transform: string } {
  const [coords, setCoords] = useState<Coords>({ top: 0, left: 0 })

  const update = useCallback(() => {
    const reference = referenceRef.current
    if (!reference) return
    setCoords(calculateCoords(reference, placement, align, offset))
  }, [referenceRef, placement, align, offset])

  useLayoutEffect(() => {
    if (!open) return
    update()

    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, update])

  return { coords, transform: calculateTransform(placement, align) }
}

interface PopperProps {
  referenceRef: RefObject<Element | null>
  children: ReactNode
  placement?: Placement
  align?: Align
  offset?: number
  open: boolean
}

export function Popper({
  referenceRef,
  children,
  placement = 'bottom',
  align = 'center',
  offset = 8,
  open,
}: PopperProps) {
  const { coords, transform } = usePopperPosition(referenceRef, { placement, align, offset, open })

  if (!open) return null

  return (
    <Portal>
      <div
        style={{
          position: 'absolute',
          top: coords.top,
          left: coords.left,
          transform,
          zIndex: 9999,
        }}
      >
        {children}
      </div>
    </Portal>
  )
}
