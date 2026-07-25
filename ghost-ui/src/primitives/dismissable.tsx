import { useEffect, useRef, type ReactNode } from 'react'
import { Keys } from '../lib/utils'

interface DismissableProps {
  children: ReactNode
  onDismiss: () => void
  enabled?: boolean
  disableOutsideClick?: boolean
  disableEscape?: boolean
}

export function Dismissable({
  children,
  onDismiss,
  enabled = true,
  disableOutsideClick = false,
  disableEscape = false,
}: DismissableProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return

    function handleMouseDown(e: MouseEvent) {
      if (disableOutsideClick) return
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onDismiss()
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (disableEscape) return
      if (e.key === Keys.Escape) {
        onDismiss()
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, onDismiss, disableOutsideClick, disableEscape])

  return <div ref={containerRef}>{children}</div>
}
