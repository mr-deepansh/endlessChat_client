import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  showFeedFilters?: boolean;
  feedType?: 'recent' | 'hot' | 'trending' | 'following';
  onFeedTypeChange?: (type: 'recent' | 'hot' | 'trending' | 'following') => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showFeedFilters = false,
  feedType = 'recent',
  onFeedTypeChange,
}) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar
        feedType={showFeedFilters ? feedType : undefined}
        onFeedTypeChange={showFeedFilters ? onFeedTypeChange : undefined}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
