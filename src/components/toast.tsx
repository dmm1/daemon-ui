import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { cva } from 'class-variance-authority'
import { cn } from '../lib/cn'

export interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'success' | 'error' | 'warning'
  duration?: number
}

type Listener = () => void

const toastVariants = cva(
  'relative bg-background-panel border p-4 pr-8 font-mono text-sm shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'border-border',
        success: 'border-success/30',
        error: 'border-error/30',
        warning: 'border-warning/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

let toasts: ToastProps[] = []
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((l) => l())
}

let counter = 0

export function toast(opts: Omit<ToastProps, 'id'> & { id?: string }) {
  const id = opts.id ?? `toast-${++counter}`
  const t: ToastProps = { ...opts, id, duration: opts.duration ?? 4000 }
  toasts = [...toasts, t].slice(-5)
  emit()
  return id
}

toast.success = (
  title: string,
  opts?: Partial<Omit<ToastProps, 'id' | 'title' | 'variant'>>
) => toast({ title, variant: 'success', ...opts })

toast.error = (
  title: string,
  opts?: Partial<Omit<ToastProps, 'id' | 'title' | 'variant'>>
) => toast({ title, variant: 'error', ...opts })

toast.warning = (
  title: string,
  opts?: Partial<Omit<ToastProps, 'id' | 'title' | 'variant'>>
) => toast({ title, variant: 'warning', ...opts })

toast.dismiss = (id: string) => {
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

function useToastState() {
  const [state, setState] = useState(toasts)
  useEffect(() => {
    const listener = () => setState([...toasts])
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])
  return state
}

function ToastItem({ t }: { t: ToastProps }) {
  const dismiss = useCallback(() => toast.dismiss(t.id), [t.id])

  useEffect(() => {
    if (!t.duration) return
    const timer = setTimeout(dismiss, t.duration)
    return () => clearTimeout(timer)
  }, [t.duration, dismiss])

  return (
    <motion.div
      layout
      role="alert"
      aria-live="assertive"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.2 }}
      className={cn(toastVariants({ variant: t.variant }))}
    >
      {t.title && (
        <p className="text-xs font-mono uppercase tracking-wider text-foreground-bright">
          {t.title}
        </p>
      )}
      {t.description && (
        <p className="text-xs text-foreground-dim mt-1">{t.description}</p>
      )}
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-2 top-2 text-foreground-dim hover:text-foreground transition-all"
        aria-label="Close"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M1 1l10 10M11 1L1 11" />
        </svg>
      </button>
    </motion.div>
  )
}

export function Toaster() {
  const items = useToastState()

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
      <AnimatePresence mode="popLayout">
        {items.map((t) => (
          <ToastItem key={t.id} t={t} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  )
}
