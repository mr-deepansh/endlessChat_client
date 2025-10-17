const fs = require('fs');
const path = require('path');

const fixes = [
  // Components - remaining
  { file: 'src/components/admin/AdminDashboard.tsx', from: '} catch (error) {', to: '} catch (_error) {' },
  { file: 'src/components/common/EmailVerificationBanner.tsx', from: 'const { user, refreshUser }', to: 'const { user }' },
  { file: 'src/components/common/FollowButton.tsx', from: 'const { user: currentUser, refreshUserAfterFollow }', to: 'const { refreshUserAfterFollow }' },
  { file: 'src/components/super_admin/DatabaseStats.tsx', from: 'Activity, ', to: '' },
  { file: 'src/components/super_admin/RevenueAnalytics.tsx', from: 'CreditCard, ', to: '' },
  { file: 'src/components/super_admin/SuperAdminDashboard.tsx', from: 'Card, ', to: '' },
  { file: 'src/components/super_admin/SuperAdminDashboard.tsx', from: 'CardContent, ', to: '' },
  { file: 'src/components/super_admin/SuperAdminDashboard.tsx', from: 'CardHeader, ', to: '' },
  { file: 'src/components/super_admin/SuperAdminDashboard.tsx', from: 'CardTitle, ', to: '' },
  { file: 'src/components/super_admin/SuperAdminDashboard.tsx', from: 'SecurityOverviewCard, ', to: '' },
  { file: 'src/components/user/UserProfile.tsx', from: 'LinkIcon, ', to: '' },
  { file: 'src/components/user/UserProfile.tsx', from: 'User, ', to: '' },
  
  // Contexts - remaining
  { file: 'src/contexts/NotificationContext.tsx', from: 'showNotificationToast, ', to: '' },
  { file: 'src/contexts/NotificationContext.tsx', from: 'const playNotificationSound =', to: 'const _playNotificationSound =' },
  { file: 'src/contexts/RateLimitContext.tsx', from: 'const handleRateLimit = (event) =>', to: 'const handleRateLimit = (_event) =>' },
  
  // Hooks - remaining
  { file: 'src/hooks/useAccessibility.ts', from: 'const announceToScreenReader = (message: string, priority = ', to: 'const announceToScreenReader = (message: string, _priority = ' },
  { file: 'src/hooks/useAccessibility.ts', from: 'const setFocusTrap = (container: HTMLElement, priority = ', to: 'const setFocusTrap = (container: HTMLElement, _priority = ' },
  { file: 'src/hooks/useArcjet.ts', from: 'const protectRoute = async (userId: string, action: ', to: 'const protectRoute = async (userId: string, _action: ' },
  { file: 'src/hooks/useOptimizedFeed.ts', from: 'const prefetchPost = async (postId: string, data) =>', to: 'const prefetchPost = async (postId: string, _data) =>' },
  { file: 'src/hooks/usePerformance.ts', from: 'debounce, ', to: '' },
  
  // Pages - remaining
  { file: 'src/pages/admin/AdminDashboard.tsx', from: 'const handleExport = (type) =>', to: 'const handleExport = (_type) =>' },
  { file: 'src/pages/app/Feed.tsx', from: 'const handleFollow = async (userId) =>', to: 'const handleFollow = async (_userId) =>' },
  { file: 'src/pages/app/PostDetail.tsx', from: 'const handleCommentSubmit = async (postId, ', to: 'const handleCommentSubmit = async (_postId, ' },
  { file: 'src/pages/app/PostDetail.tsx', from: '} catch (error) {', to: '} catch (_error) {' },
  { file: 'src/pages/public/Terms.tsx', from: 'resources.map((resource, ', to: 'resources.map((_resource, ' },
  { file: 'src/pages/user/CurrentUserProfile.tsx', from: 'LinkIcon, ', to: '' },
  { file: 'src/pages/user/CurrentUserProfile.tsx', from: '} catch (postsError) {', to: '} catch (_postsError) {' },
  { file: 'src/pages/user/CurrentUserProfile.tsx', from: '} catch (statsError) {', to: '} catch (_statsError) {' },
  { file: 'src/pages/user/Messages.tsx', from: 'import React, { useState, useEffect }', to: 'import React, { useState }' },
  { file: 'src/pages/user/Notifications.tsx', from: 'CardHeader, ', to: '' },
  { file: 'src/pages/user/Notifications.tsx', from: 'Tabs, ', to: '' },
  { file: 'src/pages/user/Notifications.tsx', from: 'TabsContent, ', to: '' },
  { file: 'src/pages/user/Notifications.tsx', from: 'TabsList, ', to: '' },
  { file: 'src/pages/user/Notifications.tsx', from: 'TabsTrigger, ', to: '' },
  
  // Services - remaining
  { file: 'src/services/core/serviceClients.ts', from: 'config, ', to: '' },
  { file: 'src/services/followService.ts', from: 'ApiResponse, ', to: '' },
  { file: 'src/services/modules/auth.service.ts', from: '} catch (error) {', to: '} catch (_error) {' },
  { file: 'src/services/modules/feed.service.ts', from: 'const handleInteraction = (type) =>', to: 'const handleInteraction = (_type) =>' },
  { file: 'src/services/modules/notification.service.ts', from: 'ApiResponse, ', to: '' },
  { file: 'src/services/modules/notification.service.ts', from: 'PaginatedResponse, ', to: '' },
  { file: 'src/services/modules/securityService.ts', from: 'ApiResponse, ', to: '' },
  { file: 'src/services/modules/social.service.ts', from: 'async updateNotificationSettings(userId: string, settings) {', to: 'async updateNotificationSettings(userId: string, _settings) {' },
  { file: 'src/services/modules/superAdmin.service.ts', from: 'SearchParams, ', to: '' },
  
  // Utils - remaining
  { file: 'src/utils/logger.ts', from: 'trace: (message: string, ...args: any[]) =>', to: 'trace: (_message: string, ..._args: any[]) =>' },
  { file: 'src/utils/logger.ts', from: 'debug: (message: string, ...args: any[]) =>', to: 'debug: (_message: string, ..._args: any[]) =>' },
  { file: 'src/utils/logger.ts', from: 'info: (message: string, ...args: any[]) =>', to: 'info: (_message: string, ..._args: any[]) =>' },
  { file: 'src/utils/logger.ts', from: 'warn: (message: string, ...args: any[]) =>', to: 'warn: (_message: string, ..._args: any[]) =>' },
  { file: 'src/utils/logger.ts', from: 'error: (message: string, ...args: any[]) =>', to: 'error: (_message: string, ..._args: any[]) =>' },
  { file: 'src/utils/requestQueue.ts', from: 'private processQueue(request) {', to: 'private processQueue(_request) {' },
  { file: 'src/utils/sanitizer.ts', from: '/\\.', to: '.' },
  { file: 'src/utils/secureStorage.ts', from: 'encrypt(token: string)', to: 'encrypt(_token: string)' },
  { file: 'src/utils/secureStorage.ts', from: 'decrypt(token: string)', to: 'decrypt(_token: string)' },
];

let fixedCount = 0;

fixes.forEach(({ file, from, to }) => {
  const filePath = path.join(__dirname, file);
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(from)) {
        content = content.replaceAll(from, to);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ ${file}`);
        fixedCount++;
      }
    }
  } catch (error) {
    console.error(`✗ ${file}: ${error.message}`);
  }
});

console.log(`\n✓ Fixed ${fixedCount} files`);
