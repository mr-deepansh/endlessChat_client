import { Image, MapPin, Smile } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../hooks/use-toast';
import { feedService } from '../../services';
import { Post } from '../../types/api';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Textarea } from '../ui/textarea';

const MAX_POST_LENGTH = 280;

interface CreatePostProps {
  onClose?: () => void;
  onPostCreated?: (post: Post) => void;
  onCancel?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
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
    <Card className="mb-4 sm:mb-6 shadow-sm border-border/50">
      <CardContent className="p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/10">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="bg-gradient-primary text-white">
                {user.firstName?.[0] || user.username?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={e => setContent(e.target.value)}
                className="min-h-[100px] resize-none border-0 bg-transparent focus-visible:ring-0 text-base placeholder:text-muted-foreground/70 p-0"
                maxLength={MAX_POST_LENGTH}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-primary hover:bg-primary/10 rounded-full"
              >
                <Image className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-primary hover:bg-primary/10 rounded-full"
              >
                <Smile className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-primary hover:bg-primary/10 rounded-full hidden sm:inline-flex"
              >
                <MapPin className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              {content.length > 0 && (
                <span
                  className={`text-xs font-medium ${
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
                className="px-6 h-9 font-medium"
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
