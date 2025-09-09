import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import LeftSidebar from '../components/layout/LeftSidebar';
import { Card, CardContent } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { Bookmark } from 'lucide-react';

const Bookmarks: React.FC = () => {
  const { isAuthenticated } = useAuth();
  usePageTitle('Bookmarks');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <LeftSidebar />
      <div className="ml-20 lg:ml-64 transition-all duration-300">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground flex items-center">
              <Bookmark className="w-6 h-6 mr-2" />
              Bookmarks
            </h1>
            <p className="text-muted-foreground">Your saved posts</p>
          </div>

          <Card className="border-none shadow-soft bg-gradient-card">
            <CardContent className="p-8 text-center">
              <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No bookmarks yet</h3>
              <p className="text-muted-foreground">
                Save posts you want to read later by clicking the bookmark icon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
