import { cn } from '../lib/cn'

type SkeletonProps = {
  className?: string
  width?: string | number
  height?: string | number
}

function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse bg-muted rounded-sm', className)}
      style={{ width, height }}
    />
  )
}

export { Skeleton, type SkeletonProps }
