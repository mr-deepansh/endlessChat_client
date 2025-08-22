import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Hash } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const trendingTopics = [
    { tag: 'React', posts: '12.5K' },
    { tag: 'TypeScript', posts: '8.2K' },
    { tag: 'WebDev', posts: '15.1K' },
    { tag: 'JavaScript', posts: '25.3K' },
    { tag: 'NextJS', posts: '6.8K' }
  ];

  const suggestedUsers = [
    {
      id: '1',
      username: 'johndoe',
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      followers: '2.5K'
    },
    {
      id: '2',
      username: 'sarahsmith',
      name: 'Sarah Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      followers: '1.8K'
    },
    {
      id: '3',
      username: 'mikejohnson',
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      followers: '3.2K'
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Trending Topics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Trending
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-lg cursor-pointer transition-colors">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium hover:text-primary">{topic.tag}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {topic.posts}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Users */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary" />
            Who to follow
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="cursor-pointer">
                    <p className="font-medium text-sm hover:text-primary">{user.name}</p>
                    <p className="text-muted-foreground text-xs hover:text-primary">@{user.username}</p>
                    <p className="text-muted-foreground text-xs">{user.followers} followers</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">2.5M</p>
              <p className="text-xs text-muted-foreground">Active Users</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">15K</p>
              <p className="text-xs text-muted-foreground">Posts Today</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};