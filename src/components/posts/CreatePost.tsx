import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Image, Smile, MapPin, Calendar } from 'lucide-react';

interface CreatePostProps {
  onSubmit?: (content: string, images?: string[]) => void;
  placeholder?: string;
}

const CreatePost: React.FC<CreatePostProps> = ({
  onSubmit,
  placeholder = "What's happening?",
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(content);
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const characterLimit = 280;
  const remainingChars = characterLimit - content.length;
  const isOverLimit = remainingChars < 0;

  if (!user) return null;

  return (
    <Card className="border-none shadow-soft bg-gradient-card backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar className="w-12 h-12 ring-2 ring-primary/20">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="bg-gradient-primary text-white">
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder={placeholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] border-none bg-transparent text-lg placeholder:text-muted-foreground resize-none focus-visible:ring-0"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon-sm" className="text-primary hover:bg-primary/10">
                  <Image className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon-sm" className="text-primary hover:bg-primary/10">
                  <Smile className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon-sm" className="text-primary hover:bg-primary/10">
                  <MapPin className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon-sm" className="text-primary hover:bg-primary/10">
                  <Calendar className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                {content.length > 0 && (
                  <div className={`text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {remainingChars}
                  </div>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isOverLimit || isSubmitting}
                  variant="gradient"
                  size="sm"
                  className="px-6"
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;