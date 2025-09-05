// src/App.tsx
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import PageTransition from './components/layout/PageTransition';
import { Toaster as Sonner } from './components/ui/sonner';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { RateLimitProvider } from './contexts/RateLimitContext';
import RateLimitIndicator from './components/common/RateLimitIndicator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Import pages
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';
import CurrentUserProfile from './pages/CurrentUserProfile';
import Features from './pages/Features';
import Feed from './pages/Feed';
import ForgotPassword from './pages/ForgotPassword';
import Index from './pages/Index';
import Login from './pages/Login';
import Messages from './pages/Messages';
import NotFound from './pages/NotFound';
import Notifications from './pages/Notifications';
import Privacy from './pages/Privacy';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Settings from './pages/Settings';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import Support from './pages/Support';
import Terms from './pages/Terms';

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
                          path="/:username"
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
