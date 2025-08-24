import React from 'react';
import { UI_CONFIG } from '@/utils/constants';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
  height?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className = '', 
  count = 1, 
  height = 'h-4' 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-muted rounded ${height} ${className}`}
        />
      ))}
    </>
  );
};

export const AdminDashboardSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto py-6 px-4">
    <div className="animate-pulse">
      <LoadingSkeleton height="h-8" className="w-64 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <LoadingSkeleton count={UI_CONFIG.SKELETON_ITEMS} height="h-32" />
      </div>
      <LoadingSkeleton height="h-96" />
    </div>
  </div>
);