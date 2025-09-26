import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { useAuth } from '../../contexts/AuthContext';
import { feedService } from '../../services';
import { toast } from '../../hooks/use-toast';
import { Image, Smile, MapPin, Calendar } from 'lucide-react';
import { Post } from '../../types/api';

const MAX_POST_LENGTH = 280;

interface CreatePostProps {
  onClose?: () => void;
  onPostCreated?: (post: Post) => void;
  onCancel?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onClose, onPostCreated, onCancel }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsPosting(true);
    try {
      const response = await feedService.createPost({
        content: content.trim(),
        visibility: 'public',
      });

      if (response.success && response.data) {
        setContent('');
        onPostCreated?.(response.data);
        toast({
          title: 'Success',
          description: 'Your post has been created successfully!',
        });
      } else {
        throw new Error(response.message || 'Failed to create post');
      }
    } catch (error: any) {
      console.error('Failed to create post:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsPosting(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="mb-3 sm:mb-4 lg:mb-6 xl:mb-8 2xl:mb-10 shadow-sm border-border/50 bg-gradient-card backdrop-blur-sm">
      <CardContent className="p-3 sm:p-4 lg:p-5 xl:p-6 2xl:p-8">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-5">
          <div className="flex gap-2 sm:gap-3 lg:gap-4">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 2xl:h-16 2xl:w-16 ring-2 ring-primary/10 flex-shrink-0">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="bg-gradient-primary text-white text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl">
                {user.firstName?.[0] || user.username?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={e => setContent(e.target.value)}
                className="min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] xl:min-h-[140px] 2xl:min-h-[160px] resize-none border-0 bg-transparent focus-visible:ring-0 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl placeholder:text-muted-foreground/70 p-0"
                maxLength={MAX_POST_LENGTH}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-border/30">
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 p-0 text-primary hover:bg-primary/10 rounded-full"
              >
                <Image className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 p-0 text-primary hover:bg-primary/10 rounded-full"
              >
                <Smile className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 p-0 text-primary hover:bg-primary/10 rounded-full hidden md:inline-flex"
              >
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {content.length > 0 && (
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    content.length > MAX_POST_LENGTH * 0.9
                      ? content.length > MAX_POST_LENGTH
                        ? 'text-destructive'
                        : 'text-orange-500'
                      : 'text-muted-foreground'
                  }`}
                >
                  {MAX_POST_LENGTH - content.length}
                </span>
              )}
              <Button
                type="submit"
                disabled={!content.trim() || isPosting || content.length > MAX_POST_LENGTH}
                className="px-3 sm:px-4 lg:px-6 h-8 sm:h-9 lg:h-10 xl:h-11 2xl:h-12 font-medium text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl"
                size="sm"
              >
                {isPosting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
