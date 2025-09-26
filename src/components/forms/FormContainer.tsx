import * as React from 'react';
import { cn } from '@/lib/utils';
import { ResponsiveCard, ResponsiveCardContent, ResponsiveCardHeader, ResponsiveCardTitle, ResponsiveCardDescription } from '@/components/ui/responsive-card';

interface FormContainerProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  description?: string;
  loading?: boolean;
  error?: string;
  success?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
}

const FormContainer = React.forwardRef<HTMLFormElement, FormContainerProps>(
  ({
    className,
    title,
    description,
    loading = false,
    error,
    success,
    maxWidth = 'md',
    variant = 'elevated',
    children,
    ...props
  }, ref) => {
    const maxWidthClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      full: 'max-w-full',
    };

    return (
      <div className={cn('w-full', maxWidthClasses[maxWidth], 'mx-auto')}>
        <ResponsiveCard variant={variant} className="relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                <span className="text-sm font-medium">Processing...</span>
              </div>
            </div>
          )}
          
          {(title || description) && (
            <ResponsiveCardHeader>
              {title && (
                <ResponsiveCardTitle className="text-center">
                  {title}
                </ResponsiveCardTitle>
              )}
              {description && (
                <ResponsiveCardDescription className="text-center">
                  {description}
                </ResponsiveCardDescription>
              )}
            </ResponsiveCardHeader>
          )}
          
          <ResponsiveCardContent>
            {error && (
              <div className="mb-4 p-3 sm:p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{error}</span>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 sm:p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{success}</span>
                </div>
              </div>
            )}
            
            <form
              ref={ref}
              className={cn('space-y-4 sm:space-y-5 lg:space-y-6', className)}
              {...props}
            >
              {children}
            </form>
          </ResponsiveCardContent>
        </ResponsiveCard>
      </div>
    );
  }
);

FormContainer.displayName = 'FormContainer';

export { FormContainer };