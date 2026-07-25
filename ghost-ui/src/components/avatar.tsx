import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
  type ImgHTMLAttributes,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full border border-border',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-14 w-14',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

type AvatarSize = 'sm' | 'md' | 'lg'

const AvatarContext = createContext<AvatarSize>('md')

type AvatarProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof avatarVariants>

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = 'md', ...props }, ref) => (
    <AvatarContext.Provider value={size ?? 'md'}>
      <div
        ref={ref}
        className={cn(avatarVariants({ size, className }))}
        {...props}
      />
    </AvatarContext.Provider>
  )
)
Avatar.displayName = 'Avatar'

type AvatarImageProps = ImgHTMLAttributes<HTMLImageElement>

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, ...props }, ref) => (
    <img
      ref={ref}
      className={cn('aspect-square h-full w-full object-cover', className)}
      {...props}
    />
  )
)
AvatarImage.displayName = 'AvatarImage'

type AvatarFallbackProps = HTMLAttributes<HTMLDivElement>

const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => {
    useContext(AvatarContext)
    return (
      <div
        ref={ref}
        className={cn(
          'flex h-full w-full items-center justify-center bg-muted text-foreground-dim text-xs uppercase font-mono',
          className
        )}
        {...props}
      />
    )
  }
)
AvatarFallback.displayName = 'AvatarFallback'

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  avatarVariants,
  type AvatarProps,
  type AvatarImageProps,
  type AvatarFallbackProps,
}
