import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ProfileHeaderSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Avatar */}
        <Skeleton className="w-32 h-32 rounded-full" />

        {/* Profile Info */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ProfileTabsSkeleton = () => (
  <div className="space-y-4">
    {/* Tab Headers */}
    <div className="flex space-x-1 rounded-lg bg-muted p-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-20" />
      ))}
    </div>

    {/* Tab Content */}
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="flex items-center gap-4 pt-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto p-6 space-y-6">
    <ProfileHeaderSkeleton />
    <ProfileTabsSkeleton />
  </div>
);

export default ProfileSkeleton;