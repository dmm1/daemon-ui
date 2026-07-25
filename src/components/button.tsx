import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default:
          'border border-primary text-primary hover:bg-primary hover:text-primary-foreground',
        daemon: 'text-foreground hover:bg-foreground/10',
        outline:
          'border border-border text-foreground hover:border-primary hover:text-primary',
        destructive:
          'border border-error text-error hover:bg-error hover:text-background',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        sm: 'h-8 px-3 text-[10px]',
        md: 'h-10 px-5 text-xs',
        lg: 'h-12 px-6 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
)
Button.displayName = 'Button'

export { Button, buttonVariants, type ButtonProps }
