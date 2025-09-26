import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

interface ResponsiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  interactive?: boolean;
}

const ResponsiveCard = React.forwardRef<HTMLDivElement, ResponsiveCardProps>(
  ({ className, variant = 'default', size = 'md', hover = false, interactive = false, children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-card border border-border',
      elevated: 'bg-card border-0 shadow-lg hover:shadow-xl',
      outlined: 'bg-transparent border-2 border-border',
      ghost: 'bg-transparent border-0',
    };

    const sizeClasses = {
      sm: 'p-3 sm:p-4 lg:p-5 xl:p-6 2xl:p-7',
      md: 'p-4 sm:p-5 lg:p-6 xl:p-8 2xl:p-10',
      lg: 'p-6 sm:p-8 lg:p-10 xl:p-12 2xl:p-14',
      xl: 'p-8 sm:p-10 lg:p-12 xl:p-16 2xl:p-20',
    };

    const interactiveClasses = interactive
      ? 'cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]'
      : '';

    const hoverClasses = hover
      ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1'
      : '';

    return (
      <Card
        ref={ref}
        className={cn(
          'rounded-lg sm:rounded-xl lg:rounded-2xl',
          variantClasses[variant],
          sizeClasses[size],
          interactiveClasses,
          hoverClasses,
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

ResponsiveCard.displayName = 'ResponsiveCard';

// Responsive Card Components
const ResponsiveCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <CardHeader
      ref={ref}
      className={cn('p-0 pb-3 sm:pb-4 lg:pb-5 xl:pb-6 2xl:pb-8', className)}
      {...props}
    />
  )
);

const ResponsiveCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <CardTitle
      ref={ref}
      className={cn(
        'text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold leading-tight tracking-tight',
        className
      )}
      {...props}
    />
  )
);

const ResponsiveCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <CardDescription
      ref={ref}
      className={cn(
        'text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-muted-foreground mt-1 sm:mt-2',
        className
      )}
      {...props}
    />
  )
);

const ResponsiveCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <CardContent
      ref={ref}
      className={cn('p-0', className)}
      {...props}
    />
  )
);

const ResponsiveCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <CardFooter
      ref={ref}
      className={cn('p-0 pt-3 sm:pt-4 lg:pt-5 xl:pt-6 2xl:pt-8', className)}
      {...props}
    />
  )
);

ResponsiveCardHeader.displayName = 'ResponsiveCardHeader';
ResponsiveCardTitle.displayName = 'ResponsiveCardTitle';
ResponsiveCardDescription.displayName = 'ResponsiveCardDescription';
ResponsiveCardContent.displayName = 'ResponsiveCardContent';
ResponsiveCardFooter.displayName = 'ResponsiveCardFooter';

export {
  ResponsiveCard,
  ResponsiveCardHeader,
  ResponsiveCardTitle,
  ResponsiveCardDescription,
  ResponsiveCardContent,
  ResponsiveCardFooter,
};