import * as React from 'react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import Navbar from './Navbar';
import LeftSidebar from './LeftSidebar';
import Footer from './Footer';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'centered' | 'sidebar' | 'dashboard' | 'auth';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  showNavbar?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
  containerVariant?: 'default' | 'narrow' | 'wide' | 'full';
}

const ResponsiveLayout = React.forwardRef<HTMLDivElement, ResponsiveLayoutProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      showNavbar = true,
      showSidebar = false,
      showFooter = false,
      containerVariant = 'default',
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: 'min-h-screen bg-background',
      centered: 'min-h-screen bg-background flex items-center justify-center',
      sidebar: 'min-h-screen bg-background',
      dashboard:
        'min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800',
      auth: 'min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center',
    };

    const getMainClasses = () => {
      if (variant === 'sidebar' && showSidebar) {
        return 'ml-60 transition-all duration-300';
      }
      if (variant === 'centered' || variant === 'auth') {
        return 'flex items-center justify-center p-4';
      }
      return '';
    };

    const getContentClasses = () => {
      if (variant === 'centered' || variant === 'auth') {
        return '';
      }
      return 'py-4 sm:py-6 lg:py-8 xl:py-10 2xl:py-12';
    };

    return (
      <div ref={ref} className={cn(variantClasses[variant], className)} {...props}>
        {showNavbar && <Navbar />}
        {showSidebar && <LeftSidebar />}

        <main className={cn(getMainClasses())}>
          {variant === 'centered' || variant === 'auth' ? (
            children
          ) : (
            <ResponsiveContainer variant={containerVariant} padding={padding}>
              <div className={cn(getContentClasses())}>{children}</div>
            </ResponsiveContainer>
          )}
        </main>

        {showFooter && <Footer />}
      </div>
    );
  }
);

ResponsiveLayout.displayName = 'ResponsiveLayout';

export { ResponsiveLayout };
