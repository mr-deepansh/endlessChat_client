import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const responsiveButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:scale-105 active:scale-95',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        gradient:
          'bg-gradient-primary text-white hover:shadow-primary hover:scale-105 active:scale-95',
      },
      size: {
        sm: 'h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm lg:h-10 lg:px-5 lg:text-base xl:h-11 xl:px-6 2xl:h-12 2xl:px-7',
        default: 'h-9 px-4 py-2 sm:h-10 sm:px-5 lg:h-11 lg:px-6 xl:h-12 xl:px-8 2xl:h-14 2xl:px-10',
        lg: 'h-10 px-6 sm:h-11 sm:px-8 lg:h-12 lg:px-10 xl:h-14 xl:px-12 2xl:h-16 2xl:px-16',
        xl: 'h-12 px-8 sm:h-14 sm:px-10 lg:h-16 lg:px-12 xl:h-18 xl:px-16 2xl:h-20 2xl:px-20',
        icon: 'h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14',
      },
      responsive: {
        true: 'text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      responsive: true,
    },
  }
);

export interface ResponsiveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof responsiveButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const ResponsiveButton = React.forwardRef<HTMLButtonElement, ResponsiveButtonProps>(
  (
    {
      className,
      variant,
      size,
      responsive,
      asChild = false,
      loading = false,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    const isDisabled = disabled || loading;

    return (
      <Comp
        className={cn(responsiveButtonVariants({ variant, size, responsive, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        )}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </Comp>
    );
  }
);

ResponsiveButton.displayName = 'ResponsiveButton';

export { ResponsiveButton, responsiveButtonVariants };
