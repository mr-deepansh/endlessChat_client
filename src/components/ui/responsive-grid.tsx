import * as React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

const ResponsiveGrid = React.forwardRef<HTMLDivElement, ResponsiveGridProps>(
  (
    {
      className,
      cols = { default: 1, md: 2, lg: 3 },
      gap = 'md',
      align = 'stretch',
      children,
      ...props
    },
    ref
  ) => {
    const gapClasses = {
      none: 'gap-0',
      sm: 'gap-2 sm:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6',
      md: 'gap-4 sm:gap-5 lg:gap-6 xl:gap-8 2xl:gap-10',
      lg: 'gap-6 sm:gap-8 lg:gap-10 xl:gap-12 2xl:gap-16',
      xl: 'gap-8 sm:gap-10 lg:gap-12 xl:gap-16 2xl:gap-20',
    };

    const alignClasses = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    };

    const getGridCols = () => {
      const classes = [];
      if (cols.default) classes.push(`grid-cols-${cols.default}`);
      if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
      if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
      if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
      if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
      if (cols['2xl']) classes.push(`2xl:grid-cols-${cols['2xl']}`);
      return classes.join(' ');
    };

    return (
      <div
        ref={ref}
        className={cn('grid', getGridCols(), gapClasses[gap], alignClasses[align], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveGrid.displayName = 'ResponsiveGrid';

export { ResponsiveGrid };
