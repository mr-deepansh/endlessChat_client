import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CreatePost } from '@/components/feed/CreatePost';
import { PostCard } from '@/components/feed/PostCard';
import { Sidebar } from '@/components/feed/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Filter, RefreshCw, MessageCircle, Plus } from 'lucide-react';

interface Post {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isReposted: boolean;
  createdAt: string;
  updatedAt: string;
  media?: string[];
}

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'following'>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    loadFeed();
  }, [filter]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        hasMore &&
        !isLoadingMore &&
        !isLoading
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoadingMore, isLoading]);

  const loadFeed = async () => {
    try {
      setIsLoading(true);
      // Mock data - replace with actual API call
      const mockPosts: Post[] = [
        {
          _id: '1',
          content:
            'Just shipped a new feature! 🚀 Really excited about the improvements to user experience. What do you think about the new design patterns in modern web development?',
          author: {
            _id: 'user1',
            username: 'johndoe',
            firstName: 'John',
            lastName: 'Doe',
            avatar:
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 24,
          commentsCount: 8,
          repostsCount: 3,
          isLiked: false,
          isBookmarked: false,
          isReposted: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '2',
          content:
            "Beautiful sunset today! 🌅 Sometimes it's important to take a break from coding and appreciate the world around us.",
          author: {
            _id: 'user2',
            username: 'sarahsmith',
            firstName: 'Sarah',
            lastName: 'Smith',
            avatar:
              'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 156,
          commentsCount: 23,
          repostsCount: 12,
          isLiked: true,
          isBookmarked: true,
          isReposted: false,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          media: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          ],
          location: 'San Francisco, CA',
        },
        {
          _id: '3',
          content:
            'Working on a new React component library. The developer experience is so much better with TypeScript! Anyone else loving the type safety?',
          author: {
            _id: 'user3',
            username: 'mikejohnson',
            firstName: 'Mike',
            lastName: 'Johnson',
            avatar:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 89,
          commentsCount: 34,
          repostsCount: 7,
          isLiked: false,
          isBookmarked: false,
          isReposted: true,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '4',
          content:
            'Quick quiz: Which of these languages do you use the most? 🤔\n1. JavaScript\n2. Python\n3. Java\n4. Go',
          author: {
            _id: 'user4',
            username: 'quizmaster',
            firstName: 'Alice',
            lastName: 'Wonder',
            avatar:
              'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 200,
          commentsCount: 50,
          repostsCount: 10,
          isLiked: true,
          isBookmarked: false,
          isReposted: false,
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          poll: {
            options: [
              { text: 'JavaScript', votes: 120 },
              { text: 'Python', votes: 90 },
              { text: 'Java', votes: 40 },
              { text: 'Go', votes: 25 },
            ],
            expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
        {
          _id: '5',
          content:
            'Morning motivation 🌞: "Do one thing every day that scares you." – Eleanor Roosevelt',
          author: {
            _id: 'user5',
            username: 'motivationdaily',
            firstName: 'David',
            lastName: 'Lee',
            avatar:
              'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 500,
          commentsCount: 40,
          repostsCount: 100,
          isLiked: false,
          isBookmarked: true,
          isReposted: false,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          location: 'New York, USA',
        },
        {
          _id: '6',
          content: 'Check out my photography project 📸 Exploring streets of Tokyo.',
          author: {
            _id: 'user6',
            username: 'artlover',
            firstName: 'Lena',
            lastName: 'Kim',
            avatar:
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 102,
          commentsCount: 20,
          repostsCount: 8,
          isLiked: true,
          isBookmarked: false,
          isReposted: false,
          createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
          media: [
            'https://images.unsplash.com/photo-1549693578-d683be217e58?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=800&h=600&fit=crop',
          ],
          location: 'Tokyo, Japan',
        },
        {
          _id: '7',
          content:
            'What’s your preferred way of learning? 📚\n- Online courses\n- YouTube tutorials\n- Books\n- Bootcamps',
          author: {
            _id: 'user7',
            username: 'learnerhub',
            firstName: 'Sophia',
            lastName: 'Brown',
            avatar:
              'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 65,
          commentsCount: 15,
          repostsCount: 2,
          isLiked: false,
          isBookmarked: true,
          isReposted: false,
          createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
          poll: {
            options: [
              { text: 'Online courses', votes: 45 },
              { text: 'YouTube tutorials', votes: 30 },
              { text: 'Books', votes: 12 },
              { text: 'Bootcamps', votes: 8 },
            ],
            expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
        {
          _id: '8',
          content:
            'Finally deployed my first Dockerized app with Nginx reverse proxy! 🔥 Anyone want me to write a tutorial?',
          author: {
            _id: 'user8',
            username: 'devopsninja',
            firstName: 'Raj',
            lastName: 'Kumar',
            avatar:
              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 134,
          commentsCount: 42,
          repostsCount: 20,
          isLiked: true,
          isBookmarked: false,
          isReposted: false,
          createdAt: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '9',
          content:
            'Which one do you prefer for backend? ⚡️\n1. Node.js\n2. Django\n3. Spring Boot\n4. FastAPI',
          author: {
            _id: 'user9',
            username: 'techquiz',
            firstName: 'Elena',
            lastName: 'Rodriguez',
            avatar:
              'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 92,
          commentsCount: 33,
          repostsCount: 5,
          isLiked: false,
          isBookmarked: true,
          isReposted: false,
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          poll: {
            options: [
              { text: 'Node.js', votes: 50 },
              { text: 'Django', votes: 30 },
              { text: 'Spring Boot', votes: 25 },
              { text: 'FastAPI', votes: 15 },
            ],
            expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
        {
          _id: '10',
          content:
            'Travel throwback ✈️🇮🇹 Rome is still one of the most beautiful cities in the world!',
          author: {
            _id: 'user10',
            username: 'wanderlust',
            firstName: 'Maria',
            lastName: 'Giovanni',
            avatar:
              'https://images.unsplash.com/photo-1544725176-7c40e5a2c9f9?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 500,
          commentsCount: 88,
          repostsCount: 21,
          isLiked: true,
          isBookmarked: true,
          isReposted: false,
          createdAt: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(),
          media: [
            'https://images.unsplash.com/photo-1526120311540-1ec9a72f5d4a?w=800&h=600&fit=crop',
          ],
          location: 'Rome, Italy',
        },
        {
          _id: '11',
          content:
            'Daily coding challenge: Reverse a linked list in O(n) time. 🚀 Post your solutions!',
          author: {
            _id: 'user11',
            username: 'coderdaily',
            firstName: 'Ibrahim',
            lastName: 'Ahmed',
            avatar:
              'https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 76,
          commentsCount: 19,
          repostsCount: 6,
          isLiked: false,
          isBookmarked: false,
          isReposted: true,
          createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '12',
          content: 'Running a marathon this weekend 🏃‍♂️💨 Training has been tough but worth it!',
          author: {
            _id: 'user12',
            username: 'fitnessgeek',
            firstName: 'Chris',
            lastName: 'Walker',
            avatar:
              'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 230,
          commentsCount: 45,
          repostsCount: 18,
          isLiked: true,
          isBookmarked: false,
          isReposted: false,
          createdAt: new Date(Date.now() - 80 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 80 * 60 * 60 * 1000).toISOString(),
          location: 'Boston, MA',
        },
        {
          _id: '13',
          content: 'Who else loves dark mode? 🌙💻 #Productivity',
          author: {
            _id: 'user13',
            username: 'uxguru',
            firstName: 'Hannah',
            lastName: 'Jones',
            avatar:
              'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 310,
          commentsCount: 60,
          repostsCount: 25,
          isLiked: true,
          isBookmarked: true,
          isReposted: false,
          createdAt: new Date(Date.now() - 90 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 90 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '14',
          content:
            'Quick poll: Which cloud provider do you use? ☁️\n- AWS\n- Azure\n- Google Cloud\n- Other',
          author: {
            _id: 'user14',
            username: 'cloudman',
            firstName: 'Victor',
            lastName: 'Nguyen',
            avatar:
              'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 155,
          commentsCount: 44,
          repostsCount: 11,
          isLiked: false,
          isBookmarked: false,
          isReposted: false,
          createdAt: new Date(Date.now() - 100 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 100 * 60 * 60 * 1000).toISOString(),
          poll: {
            options: [
              { text: 'AWS', votes: 100 },
              { text: 'Azure', votes: 50 },
              { text: 'Google Cloud', votes: 40 },
              { text: 'Other', votes: 15 },
            ],
            expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
        {
          _id: '15',
          content: 'Startup grind never ends 💡 Pitched to 3 investors today, fingers crossed 🤞',
          author: {
            _id: 'user15',
            username: 'founderlife',
            firstName: 'Priya',
            lastName: 'Singh',
            avatar:
              'https://images.unsplash.com/photo-1502767089025-6572583495b0?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 420,
          commentsCount: 82,
          repostsCount: 40,
          isLiked: true,
          isBookmarked: false,
          isReposted: true,
          createdAt: new Date(Date.now() - 110 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 110 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '16',
          content: 'Fun fact: The first computer bug was an actual moth stuck in a relay. 🐛',
          author: {
            _id: 'user16',
            username: 'techfacts',
            firstName: 'Leo',
            lastName: 'Martinez',
            avatar:
              'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 170,
          commentsCount: 29,
          repostsCount: 12,
          isLiked: false,
          isBookmarked: true,
          isReposted: false,
          createdAt: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '17',
          content: 'Which IDE do you prefer? 🛠️\n1. VS Code\n2. IntelliJ\n3. Sublime\n4. Other',
          author: {
            _id: 'user17',
            username: 'devtools',
            firstName: 'Nina',
            lastName: 'Peterson',
            avatar:
              'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 115,
          commentsCount: 32,
          repostsCount: 8,
          isLiked: true,
          isBookmarked: false,
          isReposted: false,
          createdAt: new Date(Date.now() - 130 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 130 * 60 * 60 * 1000).toISOString(),
          poll: {
            options: [
              { text: 'VS Code', votes: 70 },
              { text: 'IntelliJ', votes: 25 },
              { text: 'Sublime', votes: 10 },
              { text: 'Other', votes: 5 },
            ],
            expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
        {
          _id: '18',
          content: 'Nature therapy 🌳🍃 Sometimes you just need a walk in the woods.',
          author: {
            _id: 'user18',
            username: 'greenmind',
            firstName: 'Olivia',
            lastName: 'Miller',
            avatar:
              'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 300,
          commentsCount: 41,
          repostsCount: 15,
          isLiked: true,
          isBookmarked: true,
          isReposted: false,
          createdAt: new Date(Date.now() - 140 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 140 * 60 * 60 * 1000).toISOString(),
          media: [
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop',
          ],
          location: 'Vancouver, Canada',
        },
        {
          _id: '19',
          content: 'Today’s question: What’s your favorite algorithm and why? 💭',
          author: {
            _id: 'user19',
            username: 'algogeek',
            firstName: 'Mateo',
            lastName: 'Garcia',
            avatar:
              'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 61,
          commentsCount: 25,
          repostsCount: 3,
          isLiked: false,
          isBookmarked: false,
          isReposted: false,
          createdAt: new Date(Date.now() - 150 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 150 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '20',
          content: 'Throwback to my first hackathon 🖥️ We built a full-stack app in 24 hours!',
          author: {
            _id: 'user20',
            username: 'hackerman',
            firstName: 'Ankit',
            lastName: 'Verma',
            avatar:
              'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 450,
          commentsCount: 75,
          repostsCount: 30,
          isLiked: true,
          isBookmarked: false,
          isReposted: true,
          createdAt: new Date(Date.now() - 160 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 160 * 60 * 60 * 1000).toISOString(),
          media: [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
          ],
          location: 'Bangalore, India',
        },
      ];

      setPosts(mockPosts);
      setPage(1);
      setHasMore(mockPosts.length >= 10);
    } catch (error) {
      console.error('Failed to load feed:', error);
      toast({
        title: 'Error',
        description: 'Failed to load feed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock additional posts
      const morePosts: Post[] = [
        {
          _id: `${Date.now()}-1`,
          content: 'Another interesting post from the community! 💡',
          author: {
            _id: 'user4',
            username: 'alexdev',
            firstName: 'Alex',
            lastName: 'Developer',
            avatar:
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face',
          },
          likesCount: 15,
          commentsCount: 3,
          repostsCount: 1,
          isLiked: false,
          isBookmarked: false,
          isReposted: false,
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setPosts(prev => [...prev, ...morePosts]);
      setPage(prev => prev + 1);

      // Simulate end of data after 3 pages
      if (page >= 3) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadFeed();
    setIsRefreshing(false);
  };

  const handleLike = async (postId: string) => {
    try {
      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleRepost = async (postId: string) => {
    try {
      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? {
                ...post,
                isReposted: !post.isReposted,
                repostsCount: post.isReposted ? post.repostsCount - 1 : post.repostsCount + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error('Failed to repost:', error);
    }
  };

  const handleBookmark = async (postId: string) => {
    try {
      setPosts(prev =>
        prev.map(post =>
          post._id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post
        )
      );
    } catch (error) {
      console.error('Failed to bookmark post:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to view your feed.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold gradient-text">Home</h1>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilter(filter === 'all' ? 'following' : 'all')}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {filter === 'all' ? 'All' : 'Following'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Create Post */}
            <CreatePost onPostCreated={loadFeed} />

            {/* Posts */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <div className="flex space-x-4 mt-4">
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-6 w-12" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Follow some users or create your first post to get started!
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {posts.map(post => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onLike={handleLike}
                    onRepost={handleRepost}
                    onBookmark={handleBookmark}
                  />
                ))}

                {/* Loading more indicator */}
                {isLoadingMore && (
                  <div className="flex justify-center py-8">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Loading more posts...</span>
                    </div>
                  </div>
                )}

                {/* End of feed indicator */}
                {!hasMore && posts.length > 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You've reached the end of your feed</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
