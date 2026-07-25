import { useEffect, useRef, type ReactNode } from 'react'
import { getFocusableElements, Keys } from '../lib/utils'

interface FocusTrapProps {
  children: ReactNode
  enabled?: boolean
  onEscape?: () => void
}

export function FocusTrap({ children, enabled = true, onEscape }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return
    const container = containerRef.current
    if (!container) return

    const focusables = getFocusableElements(container)
    if (focusables.length > 0) {
      focusables[0].focus()
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === Keys.Escape) {
        onEscape?.()
        return
      }

      if (e.key !== Keys.Tab) return

      const elements = getFocusableElements(container!)
      if (elements.length === 0) return

      const first = elements[0]
      const last = elements[elements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [enabled, onEscape])

  return <div ref={containerRef}>{children}</div>
}
