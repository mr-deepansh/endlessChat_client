import React from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { DataFormatter } from '../../services';
import type { SecurityOverview } from '../../services/modules';

interface SecurityOverviewProps {
  data: SecurityOverview;
}

export const SecurityOverviewCard: React.FC<SecurityOverviewProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Verified</span>
              {data.accountSecurity.isEmailVerified ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">2FA Enabled</span>
              {data.accountSecurity.twoFactorEnabled ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Lock className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Account Locked</span>
              {data.accountSecurity.isAccountLocked ? (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600">Failed Attempts</span>
              <p className="font-semibold">{data.accountSecurity.failedLoginAttempts}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Last Password Change</span>
              <p className="text-sm">{DataFormatter.formatDate(data.accountSecurity.lastPasswordChange, 'relative')}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Last Active</span>
              <p className="text-sm">{DataFormatter.formatDate(data.recentActivity.lastActive, 'relative')}</p>
            </div>
          </div>
        </div>
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm">Last Login IP</span>
            <Badge variant="outline">{data.deviceInfo.lastLoginIP}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};