import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type TypographyProps = HTMLAttributes<HTMLElement>

const H1 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn(
        'text-4xl font-light tracking-tight text-foreground-bright',
        className
      )}
      {...props}
    />
  )
)
H1.displayName = 'H1'

const H2 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        'text-3xl font-light tracking-tight text-foreground-bright',
        className
      )}
      {...props}
    />
  )
)
H2.displayName = 'H2'

const H3 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-2xl font-light text-foreground-bright',
        className
      )}
      {...props}
    />
  )
)
H3.displayName = 'H3'

const H4 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn(
        'text-xl font-light text-foreground-bright',
        className
      )}
      {...props}
    />
  )
)
H4.displayName = 'H4'

const H5 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('text-lg text-foreground-bright', className)}
      {...props}
    />
  )
)
H5.displayName = 'H5'

const H6 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h6
      ref={ref}
      className={cn('text-base text-foreground-bright', className)}
      {...props}
    />
  )
)
H6.displayName = 'H6'

const P = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-foreground leading-relaxed', className)}
      {...props}
    />
  )
)
P.displayName = 'P'

const Lead = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-lg text-foreground-dim font-light', className)}
      {...props}
    />
  )
)
Lead.displayName = 'Lead'

const Code = forwardRef<HTMLElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(
        'block bg-muted px-1.5 py-0.5 text-xs font-mono text-primary rounded-sm',
        className
      )}
      {...props}
    />
  )
)
Code.displayName = 'Code'

const InlineCode = forwardRef<HTMLElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(
        'bg-muted px-1.5 py-0.5 text-xs font-mono text-primary rounded-sm',
        className
      )}
      {...props}
    />
  )
)
InlineCode.displayName = 'InlineCode'

const BlockQuote = forwardRef<HTMLQuoteElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn(
        'border-l-2 border-primary pl-4 italic text-foreground-dim',
        className
      )}
      {...props}
    />
  )
)
BlockQuote.displayName = 'BlockQuote'

export { H1, H2, H3, H4, H5, H6, P, Lead, Code, InlineCode, BlockQuote }
