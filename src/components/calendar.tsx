import { useState, useMemo, useCallback } from 'react'
import { cn } from '../lib/cn'

interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date) => void
  month?: Date
  onMonthChange?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  className?: string
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function Calendar({
  selected,
  onSelect,
  month: controlledMonth,
  onMonthChange,
  minDate,
  maxDate,
  disabledDates = [],
  className,
}: CalendarProps) {
  const [internalMonth, setInternalMonth] = useState(
    () => selected ?? new Date()
  )
  const month = controlledMonth ?? internalMonth
  const today = useMemo(() => new Date(), [])

  const setMonth = useCallback(
    (d: Date) => {
      if (!controlledMonth) setInternalMonth(d)
      onMonthChange?.(d)
    },
    [controlledMonth, onMonthChange]
  )

  const year = month.getFullYear()
  const mo = month.getMonth()
  const monthName = month.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })

  const days = useMemo(() => {
    const firstDay = new Date(year, mo, 1).getDay()
    const daysInMonth = new Date(year, mo + 1, 0).getDate()
    const cells: (Date | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, mo, d))
    return cells
  }, [year, mo])

  const isDisabled = useCallback(
    (d: Date) => {
      if (minDate && d < minDate) return true
      if (maxDate && d > maxDate) return true
      return disabledDates.some((dd) => isSameDay(dd, d))
    },
    [minDate, maxDate, disabledDates]
  )

  const prevMonth = () => setMonth(new Date(year, mo - 1, 1))
  const nextMonth = () => setMonth(new Date(year, mo + 1, 1))

  return (
    <div className={cn('font-mono text-xs p-3', className)}>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="h-7 w-7 flex items-center justify-center border border-border hover:bg-primary/5 hover:text-primary transition-colors"
        >
          ←
        </button>
        <span className="text-[10px] uppercase tracking-[0.15em] text-foreground-dim">
          {monthName}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="h-7 w-7 flex items-center justify-center border border-border hover:bg-primary/5 hover:text-primary transition-colors"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0">
        {DAYS.map((d) => (
          <div
            key={d}
            className="h-8 w-8 flex items-center justify-center text-[10px] uppercase tracking-wider text-foreground-dim"
          >
            {d}
          </div>
        ))}
        {days.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} className="h-8 w-8" />
          const disabled = isDisabled(d)
          const isSelected = selected && isSameDay(d, selected)
          const isToday = isSameDay(d, today)
          return (
            <button
              key={d.getTime()}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelect?.(d)}
              className={cn(
                'h-8 w-8 flex items-center justify-center text-xs font-mono cursor-pointer transition-colors',
                'hover:bg-primary/5',
                disabled && 'opacity-30 cursor-not-allowed',
                isSelected && 'bg-primary text-background',
                isToday && !isSelected && 'border border-primary'
              )}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { Calendar, type CalendarProps }
