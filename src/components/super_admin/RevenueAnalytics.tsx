import React from 'react';
import { DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { DataFormatter } from '../../services';
import type { RevenueAnalytics, UserLifetimeValue } from '../../services/modules';

interface RevenueAnalyticsProps {
  revenue: RevenueAnalytics;
  ltv?: UserLifetimeValue;
}

export const RevenueAnalyticsCard: React.FC<RevenueAnalyticsProps> = ({ revenue, ltv }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Overview ({revenue.period})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{DataFormatter.formatCurrency(revenue.revenue.total)}</p>
                <Badge variant="default" className="mt-1">
                  {revenue.revenue.growth}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Recurring Revenue</p>
                <p className="text-lg font-semibold">{DataFormatter.formatCurrency(revenue.revenue.recurring)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">One-time Revenue</p>
                <p className="text-lg font-semibold">{DataFormatter.formatCurrency(revenue.revenue.oneTime)}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">MRR</p>
                <p className="text-xl font-bold">{DataFormatter.formatCurrency(revenue.metrics.mrr)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ARR</p>
                <p className="text-lg font-semibold">{DataFormatter.formatCurrency(revenue.metrics.arr)}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Churn Rate</p>
                  <p className="font-semibold">{DataFormatter.formatPercentage(revenue.metrics.churn)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">LTV</p>
                  <p className="font-semibold">{DataFormatter.formatCurrency(revenue.metrics.ltv)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {ltv && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Lifetime Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-lg font-bold">{DataFormatter.formatCurrency(ltv.segments.premium.ltv)}</p>
                <p className="text-sm text-gray-600">Premium ({DataFormatter.formatNumber(ltv.segments.premium.count)})</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-lg font-bold">{DataFormatter.formatCurrency(ltv.segments.standard.ltv)}</p>
                <p className="text-sm text-gray-600">Standard ({DataFormatter.formatNumber(ltv.segments.standard.count)})</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold">{DataFormatter.formatCurrency(ltv.segments.basic.ltv)}</p>
                <p className="text-sm text-gray-600">Basic ({DataFormatter.formatNumber(ltv.segments.basic.count)})</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Retention Rate:</span>
                <span>{DataFormatter.formatPercentage(ltv.factors.retentionRate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Order Value:</span>
                <span>{DataFormatter.formatCurrency(ltv.factors.averageOrderValue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Purchase Frequency:</span>
                <span>{ltv.factors.purchaseFrequency.toFixed(1)}x</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};