// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import RateLimitIndicator from './components/common/RateLimitIndicator';
import PageTransition from './components/layout/PageTransition';
import { Toaster as Sonner } from './components/ui/sonner';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { RateLimitProvider } from './contexts/RateLimitContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Import pages from organized folders
import {
    ForgotPassword,
    Login,
    Register,
    ResetPassword,
    VerifyEmail,
} from './pages/auth';

import {
    AdminDashboard,
    SuperAdminDashboard,
} from './pages/admin';

import {
    Bookmarks,
    CurrentUserProfile,
    Messages,
    Notifications,
    Profile,
    Settings,
} from './pages/user';

import {
    About,
    Contact,
    Features,
    Privacy,
    Support,
    Terms,
} from './pages/public';

import {
    Discover,
    Feed,
    Index,
    NotFound,
} from './pages/app/app';

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <ThemeProvider>
              <RateLimitProvider>
                <AuthProvider>
                  <NotificationProvider>
                    <Toaster />
                    <Sonner />
                    <RateLimitIndicator />
                    <PageTransition>
                      <Routes>
                        {/* Public routes - accessible to everyone */}
                        <Route path="/" element={<Index />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/features" element={<Features />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/support" element={<Support />} />

                        {/* Authentication routes - only for non-authenticated users */}
                        <Route
                          path="/login"
                          element={
                            <ErrorBoundary>
                              <ProtectedRoute requireAuth={false}>
                                <Login />
                              </ProtectedRoute>
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/register"
                          element={
                            <ErrorBoundary>
                              <ProtectedRoute requireAuth={false}>
                                <Register />
                              </ProtectedRoute>
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/forgot-password"
                          element={
                            <ErrorBoundary>
                              <ProtectedRoute requireAuth={false}>
                                <ForgotPassword />
                              </ProtectedRoute>
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/reset-password"
                          element={
                            <ErrorBoundary>
                              <ProtectedRoute requireAuth={false}>
                                <ResetPassword />
                              </ProtectedRoute>
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/verify-email/:token"
                          element={
                            <ErrorBoundary>
                              <ProtectedRoute requireAuth={false}>
                                <VerifyEmail />
                              </ProtectedRoute>
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/verify-email"
                          element={
                            <ErrorBoundary>
                              <ProtectedRoute requireAuth={false}>
                                <VerifyEmail />
                              </ProtectedRoute>
                            </ErrorBoundary>
                          }
                        />

                        {/* Protected routes - require authentication */}
                        <Route
                          path="/feed"
                          element={
                            <ErrorBoundary>
                              <ProtectedRoute>
                                <Feed />
                              </ProtectedRoute>
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/profile/me"
                          element={
                            <ErrorBoundary>
                              <ProtectedRoute>
                                <CurrentUserProfile />
                              </ProtectedRoute>
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/u/:username"
                          element={
                            <ErrorBoundary>
                              <ProtectedRoute>
                                <Profile />
                              </ProtectedRoute>
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/profile/:userId"
                          element={
                            <ErrorBoundary>
                              <ProtectedRoute>
                                <Profile />
                              </ProtectedRoute>
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/settings"
                          element={
                            <ErrorBoundary>
                              <ProtectedRoute>
                                <Settings />
                              </ProtectedRoute>
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/messages"
                          element={
                            <ErrorBoundary>
                              <ProtectedRoute>
                                <Messages />
                              </ProtectedRoute>
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/notifications"
                          element={
                            <ErrorBoundary>
                              <ProtectedRoute>
                                <Notifications />
                              </ProtectedRoute>
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/discover"
                          element={
                            <ErrorBoundary>
                              <ProtectedRoute>
                                <Discover />
                              </ProtectedRoute>
                            </ErrorBoundary>
                          }
                        />
                        <Route
                          path="/bookmarks"
                          element={
                            <ErrorBoundary>
                              <ProtectedRoute>
                                <Bookmarks />
                              </ProtectedRoute>
                            </ErrorBoundary>
                          }
                        />

                        {/* Admin only routes */}
                        <Route
                          path="/admin"
                          element={
                            <ErrorBoundary>
                              <ProtectedRoute adminOnly={true}>
                                <AdminDashboard />
                              </ProtectedRoute>
                            </ErrorBoundary>
                          }
                        />

                        {/* Super Admin only routes */}
                        <Route
                          path="/super-admin"
                          element={
                            <ErrorBoundary>
                              <ProtectedRoute superAdminOnly={true}>
                                <SuperAdminDashboard />
                              </ProtectedRoute>
                            </ErrorBoundary>
                          }
                        />

                        {/* Catch-all route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </PageTransition>
                  </NotificationProvider>
                </AuthProvider>
              </RateLimitProvider>
            </ThemeProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
