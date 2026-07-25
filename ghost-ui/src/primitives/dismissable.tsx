import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { Keys } from '../lib/utils'

interface UseDismissableLayerOptions {
  enabled?: boolean
  onDismiss: () => void
  onEscape?: () => void
  ignoreRef?: RefObject<Element | null>
  disableOutsideClick?: boolean
  disableEscape?: boolean
}

/**
 * Shared outside-click + Escape dismissal logic for overlays (menus, popovers,
 * selects, etc). `ignoreRef` excludes a trigger element from outside-click
 * detection so clicking it doesn't fire a dismiss before its own toggle handler runs.
 * `onEscape` fires in addition to `onDismiss`, only for the Escape path (e.g. to
 * return focus to the trigger).
 */
export function useDismissableLayer(
  containerRef: RefObject<Element | null>,
  {
    enabled = true,
    onDismiss,
    onEscape,
    ignoreRef,
    disableOutsideClick = false,
    disableEscape = false,
  }: UseDismissableLayerOptions
) {
  useEffect(() => {
    if (!enabled) return

    function handleMouseDown(e: MouseEvent) {
      if (disableOutsideClick) return
      const target = e.target as Node
      if (containerRef.current?.contains(target)) return
      if (ignoreRef?.current?.contains(target)) return
      onDismiss()
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (disableEscape) return
      if (e.key === Keys.Escape) {
        onDismiss()
        onEscape?.()
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, onDismiss, onEscape, containerRef, ignoreRef, disableOutsideClick, disableEscape])
}

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

  useDismissableLayer(containerRef, { enabled, onDismiss, disableOutsideClick, disableEscape })

  return <div ref={containerRef}>{children}</div>
}
