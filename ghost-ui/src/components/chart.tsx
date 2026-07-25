import { useMemo } from 'react'
import { motion } from 'motion/react'
import { cn } from '../lib/cn'

type ChartVariant = 'cyan' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'primary'

const variantColors: Record<ChartVariant, string> = {
  cyan: 'var(--color-accent-cyan)',
  blue: 'var(--color-accent-blue)',
  green: 'var(--color-success)',
  yellow: 'var(--color-warning)',
  red: 'var(--color-error)',
  purple: 'var(--color-accent-purple)',
  primary: 'var(--color-primary)',
}

function getColor(variant: ChartVariant = 'primary') {
  return variantColors[variant]
}

// --- LineChart ---

interface Series {
  label: string
  data: number[]
  variant?: ChartVariant
}

interface LineChartProps {
  series: Series[]
  labels?: string[]
  height?: number
  showDots?: boolean
  showGrid?: boolean
  showArea?: boolean
  animated?: boolean
  formatValue?: (v: number) => string
  className?: string
}

function LineChart({
  series,
  labels,
  height = 200,
  showDots = true,
  showGrid = true,
  showArea = false,
  animated = true,
  formatValue,
  className,
}: LineChartProps) {
  const padding = { top: 20, right: 20, bottom: 30, left: 50 }
  const width = 600

  const allValues = series.flatMap((s) => s.data)
  const minVal = Math.min(...allValues)
  const maxVal = Math.max(...allValues)
  const range = maxVal - minVal || 1

  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const scaleX = (i: number, len: number) => padding.left + (i / Math.max(len - 1, 1)) * chartW
  const scaleY = (v: number) => padding.top + chartH - ((v - minVal) / range) * chartH

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn('w-full font-mono', className)}>
      {showGrid && (
        <g>
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = padding.top + chartH * (1 - t)
            const val = minVal + range * t
            return (
              <g key={t}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--color-border)" strokeWidth="0.5" />
                <text x={padding.left - 8} y={y + 3} textAnchor="end" fontSize="8" fill="var(--color-foreground-dim)">
                  {formatValue ? formatValue(val) : val.toFixed(1)}
                </text>
              </g>
            )
          })}
        </g>
      )}
      {labels && (
        <g>
          {labels.map((l, i) => (
            <text key={i} x={scaleX(i, labels.length)} y={height - 6} textAnchor="middle" fontSize="8" fill="var(--color-foreground-dim)">
              {l}
            </text>
          ))}
        </g>
      )}
      {series.map((s, si) => {
        const color = getColor(s.variant)
        const points = s.data.map((v, i) => ({ x: scaleX(i, s.data.length), y: scaleY(v) }))
        const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
        const areaPath = `${linePath} L${points[points.length - 1].x},${padding.top + chartH} L${points[0].x},${padding.top + chartH} Z`

        return (
          <g key={si}>
            {showArea && (
              <motion.path
                d={areaPath}
                fill={color}
                fillOpacity={0.1}
                initial={animated ? { opacity: 0 } : undefined}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
            )}
            <motion.path
              d={linePath}
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              initial={animated ? { pathLength: 0 } : undefined}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            {showDots &&
              points.map((p, i) => (
                <motion.circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="2.5"
                  fill={color}
                  initial={animated ? { scale: 0 } : undefined}
                  animate={{ scale: 1 }}
                  transition={{ delay: (i / points.length) * 0.5, duration: 0.2 }}
                />
              ))}
          </g>
        )
      })}
    </svg>
  )
}

// --- Sparkline ---

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  variant?: ChartVariant
  className?: string
}

function Sparkline({ data, width = 80, height = 24, variant = 'primary', className }: SparklineProps) {
  const color = getColor(variant)
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((v, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x},${y}`
  })

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={cn('inline-block', className)}>
      <polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// --- BarChart ---

interface BarData {
  label: string
  value: number
  variant?: ChartVariant
}

interface BarChartProps {
  data: BarData[]
  height?: number
  animated?: boolean
  className?: string
}

function BarChart({ data, height = 200, animated = true, className }: BarChartProps) {
  const padding = { top: 10, right: 10, bottom: 30, left: 50 }
  const width = 600
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const maxVal = Math.max(...data.map((d) => d.value), 1)

  const barWidth = Math.min(chartW / data.length - 4, 40)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn('w-full font-mono', className)}>
      {[0, 0.5, 1].map((t) => {
        const y = padding.top + chartH * (1 - t)
        return (
          <g key={t}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--color-border)" strokeWidth="0.5" />
            <text x={padding.left - 8} y={y + 3} textAnchor="end" fontSize="8" fill="var(--color-foreground-dim)">
              {(maxVal * t).toFixed(0)}
            </text>
          </g>
        )
      })}
      {data.map((d, i) => {
        const color = getColor(d.variant)
        const barH = (d.value / maxVal) * chartH
        const x = padding.left + (i / data.length) * chartW + (chartW / data.length - barWidth) / 2
        const y = padding.top + chartH - barH
        return (
          <g key={i}>
            <motion.rect
              x={x}
              y={animated ? padding.top + chartH : y}
              width={barWidth}
              height={animated ? 0 : barH}
              fill={color}
              fillOpacity={0.8}
              animate={{ y, height: barH }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
            />
            <text x={x + barWidth / 2} y={height - 8} textAnchor="middle" fontSize="8" fill="var(--color-foreground-dim)">
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// --- AreaChart ---

interface AreaChartProps {
  data: number[]
  height?: number
  variant?: ChartVariant
  animated?: boolean
  className?: string
}

function AreaChart({ data, height = 200, variant = 'primary', animated = true, className }: AreaChartProps) {
  const padding = { top: 10, right: 10, bottom: 10, left: 10 }
  const width = 600
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const color = getColor(variant)
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = useMemo(
    () =>
      data.map((v, i) => ({
        x: padding.left + (i / Math.max(data.length - 1, 1)) * chartW,
        y: padding.top + chartH - ((v - min) / range) * chartH,
      })),
    [data, chartW, chartH, min, range, padding.left, padding.top]
  )

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${points[points.length - 1].x},${padding.top + chartH} L${points[0].x},${padding.top + chartH} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn('w-full font-mono', className)}>
      <defs>
        <linearGradient id={`area-grad-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={areaPath}
        fill={`url(#area-grad-${variant})`}
        initial={animated ? { opacity: 0 } : undefined}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        initial={animated ? { pathLength: 0 } : undefined}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </svg>
  )
}

export { LineChart, Sparkline, BarChart, AreaChart }
export type { Series, LineChartProps, SparklineProps, BarData, BarChartProps, AreaChartProps, ChartVariant }
