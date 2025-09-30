import * as React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'accent' | 'destructive';
  align?: 'left' | 'center' | 'right' | 'justify';
  responsive?: boolean;
}

const ResponsiveText = React.forwardRef<HTMLElement, ResponsiveTextProps>(
  (
    {
      className,
      as: Component = 'p',
      size = 'base',
      weight = 'normal',
      color = 'default',
      align = 'left',
      responsive = true,
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: responsive ? 'text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl' : 'text-xs',
      sm: responsive ? 'text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl' : 'text-sm',
      base: responsive ? 'text-base sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl' : 'text-base',
      lg: responsive ? 'text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl' : 'text-lg',
      xl: responsive ? 'text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl' : 'text-xl',
      '2xl': responsive ? 'text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl' : 'text-2xl',
      '3xl': responsive ? 'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl' : 'text-3xl',
      '4xl': responsive ? 'text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl' : 'text-4xl',
      '5xl': responsive ? 'text-5xl sm:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl' : 'text-5xl',
      '6xl': responsive ? 'text-6xl sm:text-7xl lg:text-8xl xl:text-9xl 2xl:text-10xl' : 'text-6xl',
    };

    const weightClasses = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    };

    const colorClasses = {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
      accent: 'text-accent-foreground',
      destructive: 'text-destructive',
    };

    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    };

    return (
      <Component
        ref={ref}
        className={cn(
          sizeClasses[size],
          weightClasses[weight],
          colorClasses[color],
          alignClasses[align],
          'leading-relaxed',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ResponsiveText.displayName = 'ResponsiveText';

export { ResponsiveText };
