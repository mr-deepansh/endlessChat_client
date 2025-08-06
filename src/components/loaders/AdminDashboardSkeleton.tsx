import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const AdminStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
    {Array.from({ length: 5 }).map((_, i) => (
      <Card key={i} className="bg-gradient-card border-none shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export const AdminUserTableSkeleton = () => (
  <Card className="bg-gradient-card border-none shadow-soft">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-72" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {/* Table Header */}
        <div className="grid grid-cols-7 gap-4 py-3 border-b">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        {/* Table Rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="grid grid-cols-7 gap-4 py-3 items-center">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            
            {/* Email */}
            <Skeleton className="h-4 w-32" />
            
            {/* Role */}
            <Skeleton className="h-6 w-16 rounded-full" />
            
            {/* Status */}
            <Skeleton className="h-6 w-16 rounded-full" />
            
            {/* Followers */}
            <Skeleton className="h-4 w-12" />
            
            {/* Joined */}
            <Skeleton className="h-4 w-20" />
            
            {/* Actions */}
            <Skeleton className="h-8 w-8 rounded ml-auto" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const AdminDashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto py-6 px-4">
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-8 w-32 rounded-full" />
    </div>

    {/* Stats Cards */}
    <AdminStatsSkeleton />

    {/* User Management */}
    <AdminUserTableSkeleton />
  </div>
);

export default AdminDashboardSkeleton;