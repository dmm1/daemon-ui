import { useState, useLayoutEffect, useCallback, type ReactNode, type RefObject } from 'react'
import { Portal } from './portal'

type Placement = 'top' | 'bottom' | 'left' | 'right'

interface PopperProps {
  referenceRef: RefObject<Element | null>
  children: ReactNode
  placement?: Placement
  offset?: number
  open: boolean
}

interface Coords {
  top: number
  left: number
}

function calculateCoords(
  reference: Element,
  placement: Placement,
  offset: number
): Coords {
  const rect = reference.getBoundingClientRect()

  switch (placement) {
    case 'top':
      return {
        top: rect.top + window.scrollY - offset,
        left: rect.left + window.scrollX + rect.width / 2,
      }
    case 'bottom':
      return {
        top: rect.bottom + window.scrollY + offset,
        left: rect.left + window.scrollX + rect.width / 2,
      }
    case 'left':
      return {
        top: rect.top + window.scrollY + rect.height / 2,
        left: rect.left + window.scrollX - offset,
      }
    case 'right':
      return {
        top: rect.top + window.scrollY + rect.height / 2,
        left: rect.right + window.scrollX + offset,
      }
  }
}

const placementTransforms: Record<Placement, string> = {
  top: 'translate(-50%, -100%)',
  bottom: 'translate(-50%, 0)',
  left: 'translate(-100%, -50%)',
  right: 'translate(0, -50%)',
}

export function Popper({
  referenceRef,
  children,
  placement = 'bottom',
  offset = 8,
  open,
}: PopperProps) {
  const [coords, setCoords] = useState<Coords>({ top: 0, left: 0 })

  const update = useCallback(() => {
    const reference = referenceRef.current
    if (!reference) return
    setCoords(calculateCoords(reference, placement, offset))
  }, [referenceRef, placement, offset])

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

  if (!open) return null

  return (
    <Portal>
      <div
        style={{
          position: 'absolute',
          top: coords.top,
          left: coords.left,
          transform: placementTransforms[placement],
          zIndex: 9999,
        }}
      >
        {children}
      </div>
    </Portal>
  )
}
