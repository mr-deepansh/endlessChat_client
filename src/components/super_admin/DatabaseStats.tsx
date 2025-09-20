import React from 'react';
import { Database, HardDrive, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { DataFormatter } from '../../services';
import type { DatabaseStats } from '../../services/modules';

interface DatabaseStatsProps {
  data: DatabaseStats;
}

export const DatabaseStatsCard: React.FC<DatabaseStatsProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{data.overview.collections}</p>
              <p className="text-sm text-gray-600">Collections</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{DataFormatter.formatNumber(data.overview.objects)}</p>
              <p className="text-sm text-gray-600">Objects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{data.overview.dataSize}</p>
              <p className="text-sm text-gray-600">Data Size</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Storage Size:</span>
              <span>{data.overview.storageSize}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Index Size:</span>
              <span>{data.overview.indexSize}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Avg Object Size:</span>
              <span>{data.overview.avgObjSize}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Collections Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.collections.slice(0, 5).map((collection) => (
              <div key={collection.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{collection.name}</span>
                  <Badge variant={collection.status === 'healthy' ? 'default' : 'destructive'}>
                    {collection.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span>{DataFormatter.formatNumber(collection.count)} docs</span>
                  <span>{collection.size}</span>
                  <div className="w-16">
                    <Progress value={collection.efficiency} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};