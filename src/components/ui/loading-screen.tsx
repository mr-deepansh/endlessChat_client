import React from 'react';
import { Loader2, Shield, CheckCircle } from 'lucide-react';

interface LoadingScreenProps {
  title?: string;
  description?: string;
  showProgress?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  title = 'Verifying your session',
  description = 'Please wait while we authenticate your account...',
  showProgress = true,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EndlessChat
          </span>
        </div>

        {/* Loading Animation */}
        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-6">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-blue-100 dark:border-blue-900 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Progress Steps */}
        {showProgress && (
          <div className="space-y-3 mt-8">
            <div className="flex items-center space-x-3 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-slate-600 dark:text-slate-400">Connecting to server</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              <span className="text-slate-900 dark:text-white font-medium">
                Verifying credentials
              </span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 rounded-full"></div>
              <span className="text-slate-400 dark:text-slate-500">Loading dashboard</span>
            </div>
          </div>
        )}

        {/* Security Badge */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <Shield className="w-3 h-3" />
            <span>Secured with enterprise-grade encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
