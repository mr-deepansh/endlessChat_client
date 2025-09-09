import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, Hash } from 'lucide-react';
import VerticalUserSuggestions from '../user/VerticalUserSuggestions';
import { useAuth } from '../../contexts/AuthContext';

interface FeedSidebarProps {
  onUserFollow?: (userId: string) => void;
}

const FeedSidebar: React.FC<FeedSidebarProps> = ({ onUserFollow }) => {
  const { user } = useAuth();

  const trendingTopics = [
    { tag: 'React', posts: 1234 },
    { tag: 'TypeScript', posts: 987 },
    { tag: 'WebDev', posts: 756 },
    { tag: 'JavaScript', posts: 654 },
    { tag: 'Frontend', posts: 543 },
  ];

  return (
    <div className="space-y-6">
      {/* Suggested Users */}
      <VerticalUserSuggestions currentUserId={user?._id} onUserFollow={onUserFollow} limit={4} />

      {/* Trending Topics */}
      <Card className="border-none shadow-soft bg-gradient-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div key={topic.tag} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">#{index + 1}</span>
                  <div className="flex items-center space-x-1">
                    <Hash className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{topic.tag}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {topic.posts.toLocaleString()} posts
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="border-none shadow-soft bg-gradient-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Your Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Posts this week</span>
              <Badge variant="outline">0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Likes received</span>
              <Badge variant="outline">0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Comments made</span>
              <Badge variant="outline">0</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Links */}
      <Card className="border-none shadow-soft bg-gradient-card">
        <CardContent className="p-4">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex flex-wrap gap-2">
              <a href="/about" className="hover:text-primary transition-smooth">
                About
              </a>
              <span>•</span>
              <a href="/privacy" className="hover:text-primary transition-smooth">
                Privacy
              </a>
              <span>•</span>
              <a href="/terms" className="hover:text-primary transition-smooth">
                Terms
              </a>
            </div>
            <p className="mt-2">© 2024 EndlessChat</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedSidebar;
