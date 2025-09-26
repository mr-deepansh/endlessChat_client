import * as React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'narrow' | 'wide' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const ResponsiveContainer = React.forwardRef<HTMLDivElement, ResponsiveContainerProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const containerClasses = {
      default: 'max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px]',
      narrow: 'max-w-4xl xl:max-w-5xl 2xl:max-w-6xl',
      wide: 'max-w-full xl:max-w-[1800px] 2xl:max-w-[2000px]',
      full: 'max-w-none',
    };

    const paddingClasses = {
      none: '',
      sm: 'px-2 sm:px-4 lg:px-6 xl:px-8 2xl:px-10',
      md: 'px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16',
      lg: 'px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20',
      xl: 'px-8 sm:px-12 lg:px-16 xl:px-20 2xl:px-24',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto w-full',
          containerClasses[variant],
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveContainer.displayName = 'ResponsiveContainer';

export { ResponsiveContainer };