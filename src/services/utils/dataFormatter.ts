export class DataFormatter {
  static formatBytes(bytes: number | undefined | null): string {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static formatCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }

  static formatPercentage(value: number | undefined | null, decimals = 1): string {
    if (value === undefined || value === null || isNaN(value)) {
      return '0%';
    }
    return `${value.toFixed(decimals)}%`;
  }

  static formatNumber(num: number | undefined | null): string {
    if (num === undefined || num === null || isNaN(num)) {
      return '0';
    }
    return new Intl.NumberFormat('en-US').format(num);
  }

  static formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
    const d = new Date(date);

    if (format === 'relative') {
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days === 0) return 'Today';
      if (days === 1) return 'Yesterday';
      if (days < 7) return `${days} days ago`;
      if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
      return `${Math.floor(days / 30)} months ago`;
    }

    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: format === 'long' ? 'long' : 'short',
      day: 'numeric',
    });
  }

  static formatDuration(seconds: number | undefined | null): string {
    if (seconds === undefined || seconds === null || isNaN(seconds)) {
      return '0s';
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  }

  static calculateGrowth(
    current: number,
    previous: number
  ): {
    value: number;
    percentage: string;
    trend: 'up' | 'down' | 'stable';
  } {
    if (previous === 0) {
      return { value: current, percentage: '0%', trend: 'stable' };
    }

    const growth = ((current - previous) / previous) * 100;
    const trend = growth > 0 ? 'up' : growth < 0 ? 'down' : 'stable';

    return {
      value: growth,
      percentage: `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`,
      trend,
    };
  }
}
