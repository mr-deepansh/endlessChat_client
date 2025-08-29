import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Image,
  Smile,
  MapPin,
  Calendar as CalendarIcon,
  BarChart3,
  FileText,
  X,
  Plus,
  Clock,
  Globe,
  Video,
  Camera,
} from 'lucide-react';
import { format } from 'date-fns';

interface CreatePostProps {
  onSubmit?: (postData: any) => void;
  placeholder?: string;
}

interface PollOption {
  text: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ onSubmit, placeholder = "What's happening?" }) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'text' | 'article' | 'poll' | 'media'>('text');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Poll state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<PollOption[]>([{ text: '' }, { text: '' }]);
  const [pollDuration, setPollDuration] = useState(24); // hours

  // Article state
  const [articleTitle, setArticleTitle] = useState('');

  const handleSubmit = async () => {
    if (!content.trim() && postType !== 'poll') return;
    if (
      postType === 'poll' &&
      (!pollQuestion.trim() || pollOptions.filter(opt => opt.text.trim()).length < 2)
    )
      return;

    setIsSubmitting(true);
    try {
      const postData: any = {
        content: postType === 'article' ? `${articleTitle}\n\n${content}` : content,
        type: postType,
        images: images.length > 0 ? images : undefined,
        location: location.trim() || undefined,
        scheduledFor:
          scheduledDate && scheduledTime
            ? new Date(`${format(scheduledDate, 'yyyy-MM-dd')}T${scheduledTime}`).toISOString()
            : undefined,
      };

      if (postType === 'poll') {
        postData.poll = {
          question: pollQuestion,
          options: pollOptions
            .filter(opt => opt.text.trim())
            .map(opt => ({ text: opt.text, votes: 0 })),
          totalVotes: 0,
          endsAt: new Date(Date.now() + pollDuration * 60 * 60 * 1000).toISOString(),
        };
      }

      await onSubmit?.(postData);

      // Reset form
      setContent('');
      setPostType('text');
      setImages([]);
      setLocation('');
      setScheduledDate(undefined);
      setScheduledTime('');
      setPollQuestion('');
      setPollOptions([{ text: '' }, { text: '' }]);
      setArticleTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions(prev => [...prev, { text: '' }]);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, text: string) => {
    setPollOptions(prev => prev.map((opt, i) => (i === index ? { text } : opt)));
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Location not supported',
        description: 'Your browser does not support location services.',
        variant: 'destructive',
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async position => {
        try {
          // Mock location name - in real app, use reverse geocoding API
          const mockLocations = [
            'New York, NY',
            'San Francisco, CA',
            'Los Angeles, CA',
            'Chicago, IL',
            'Miami, FL',
          ];
          const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
          setLocation(randomLocation);
          toast({
            title: 'Location added',
            description: `Added ${randomLocation} to your post.`,
          });
        } catch (error) {
          toast({
            title: 'Location error',
            description: 'Could not get location name.',
            variant: 'destructive',
          });
        } finally {
          setIsGettingLocation(false);
        }
      },
      error => {
        setIsGettingLocation(false);
        toast({
          title: 'Location denied',
          description: 'Please allow location access to add your location.',
          variant: 'destructive',
        });
      }
    );
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.size > 50 * 1024 * 1024) {
          // 50MB limit
          toast({
            title: 'File too large',
            description: 'Video files must be under 50MB.',
            variant: 'destructive',
          });
          return;
        }
        const reader = new FileReader();
        reader.onload = e => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target!.result as string]);
            toast({
              title: 'Video added',
              description: 'Video has been added to your post.',
            });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const characterLimit = postType === 'article' ? 2000 : 280;
  const remainingChars = characterLimit - content.length;
  const isOverLimit = remainingChars < 0;

  const getPostTypeColor = () => {
    switch (postType) {
      case 'poll':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'article':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'media':
        return 'bg-purple-500/10 text-purple-600 border-purple-200';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  if (!user) return null;

  return (
    <Card className="border-none shadow-soft bg-gradient-card backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar className="w-12 h-12 ring-2 ring-primary/20">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="bg-gradient-primary text-white">
              {user.firstName?.[0] || user.username?.[0] || 'U'}
              {user.lastName?.[0] || ''}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            {/* Post Type Selector */}
            <div className="flex items-center space-x-2">
              <Badge className={`${getPostTypeColor()} cursor-pointer`}>
                {postType === 'text' && <Globe className="w-3 h-3 mr-1" />}
                {postType === 'poll' && <BarChart3 className="w-3 h-3 mr-1" />}
                {postType === 'article' && <FileText className="w-3 h-3 mr-1" />}
                {postType === 'media' && <Image className="w-3 h-3 mr-1" />}
                {postType.charAt(0).toUpperCase() + postType.slice(1)}
              </Badge>
              <div className="flex space-x-1">
                <Button
                  variant={postType === 'text' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPostType('text')}
                  className="h-7 px-2"
                >
                  <Globe className="w-3 h-3" />
                </Button>
                <Button
                  variant={postType === 'poll' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPostType('poll')}
                  className="h-7 px-2"
                >
                  <BarChart3 className="w-3 h-3" />
                </Button>
                <Button
                  variant={postType === 'article' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPostType('article')}
                  className="h-7 px-2"
                >
                  <FileText className="w-3 h-3" />
                </Button>
                <Button
                  variant={postType === 'media' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPostType('media')}
                  className="h-7 px-2"
                >
                  <Image className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Article Title */}
            {postType === 'article' && (
              <Input
                placeholder="Article title..."
                value={articleTitle}
                onChange={e => setArticleTitle(e.target.value)}
                className="text-lg font-semibold border-none bg-transparent focus-visible:ring-0"
              />
            )}

            {/* Poll Creation */}
            {postType === 'poll' && (
              <div className="space-y-3 p-3 border border-border/50 rounded-lg bg-muted/20">
                <Input
                  placeholder="Ask a question..."
                  value={pollQuestion}
                  onChange={e => setPollQuestion(e.target.value)}
                  className="font-medium"
                />
                <div className="space-y-2">
                  {pollOptions.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option.text}
                        onChange={e => updatePollOption(index, e.target.value)}
                        className="flex-1"
                      />
                      {pollOptions.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removePollOption(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {pollOptions.length < 4 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={addPollOption}
                      className="w-full border-dashed border-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add option
                    </Button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="poll-duration" className="text-sm">
                    Duration:
                  </Label>
                  <select
                    id="poll-duration"
                    value={pollDuration}
                    onChange={e => setPollDuration(Number(e.target.value))}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value={1}>1 hour</option>
                    <option value={6}>6 hours</option>
                    <option value={12}>12 hours</option>
                    <option value={24}>1 day</option>
                    <option value={72}>3 days</option>
                    <option value={168}>1 week</option>
                  </select>
                </div>
              </div>
            )}

            {/* Main Content */}
            <Textarea
              placeholder={postType === 'poll' ? 'Add context to your poll...' : placeholder}
              value={content}
              onChange={e => setContent(e.target.value)}
              className="min-h-[120px] border-none bg-transparent text-lg placeholder:text-muted-foreground resize-none focus-visible:ring-0"
            />

            {/* Location Input */}
            {location !== undefined && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Add location..."
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="border-none bg-transparent focus-visible:ring-0"
                />
                <Button variant="ghost" size="icon-sm" onClick={() => setLocation('')}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      className="absolute top-1 right-1"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Scheduled Post Info */}
            {scheduledDate && scheduledTime && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                <Clock className="w-4 h-4" />
                <span>
                  Scheduled for {format(scheduledDate, 'MMM d, yyyy')} at {scheduledTime}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setScheduledDate(undefined);
                    setScheduledTime('');
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {/* Poll */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={`transition-colors hover:scale-105 ${
                    postType === 'poll'
                      ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                      : 'text-primary hover:bg-primary/10'
                  }`}
                  onClick={() => setPostType(postType === 'poll' ? 'text' : 'poll')}
                  title="Create a poll"
                >
                  <BarChart3 className="w-5 h-5" />
                </Button>

                {/* Image Upload */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-primary hover:bg-primary/10 transition-colors hover:scale-105"
                  onClick={() => fileInputRef.current?.click()}
                  title="Add photos"
                >
                  <Image className="w-5 h-5" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Video Upload */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-primary hover:bg-primary/10 transition-colors hover:scale-105"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'video/*';
                    input.onchange = handleVideoUpload;
                    input.click();
                  }}
                  title="Add video"
                >
                  <Video className="w-5 h-5" />
                </Button>

                {/* Emoji */}
                <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-primary hover:bg-primary/10 transition-colors hover:scale-105"
                      title="Add emoji"
                    >
                      <Smile className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2">
                    <div className="grid grid-cols-8 gap-1">
                      {[
                        '😀',
                        '😃',
                        '😄',
                        '😁',
                        '😆',
                        '😅',
                        '😂',
                        '🤣',
                        '😊',
                        '😇',
                        '🙂',
                        '🙃',
                        '😉',
                        '😌',
                        '😍',
                        '🥰',
                        '😘',
                        '😗',
                        '😙',
                        '😚',
                        '😋',
                        '😛',
                        '😝',
                        '😜',
                        '🤪',
                        '🤨',
                        '🧐',
                        '🤓',
                        '😎',
                        '🤩',
                        '🥳',
                        '😏',
                        '😒',
                        '😞',
                        '😔',
                        '😟',
                        '😕',
                        '🙁',
                        '☹️',
                        '😣',
                        '😖',
                        '😫',
                        '😩',
                        '🥺',
                        '😢',
                        '😭',
                        '😤',
                        '😠',
                        '😡',
                        '🤬',
                        '🤯',
                        '😳',
                        '🥵',
                        '🥶',
                        '😱',
                        '😨',
                        '😰',
                        '😥',
                        '😓',
                        '🤗',
                        '🤔',
                        '🤭',
                        '🤫',
                        '🤥',
                        '😶',
                        '😐',
                        '😑',
                        '😬',
                        '🙄',
                        '😯',
                        '😦',
                        '😧',
                        '😮',
                        '😲',
                        '🥱',
                        '😴',
                        '🤤',
                        '😪',
                        '😵',
                        '🤐',
                        '🥴',
                        '🤢',
                        '🤮',
                        '🤧',
                        '😷',
                        '🤒',
                        '🤕',
                      ].map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => handleEmojiSelect(emoji)}
                          className="p-1 hover:bg-muted rounded text-lg transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Location */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={`transition-colors hover:scale-105 ${
                    location
                      ? 'text-green-600 bg-green-50 hover:bg-green-100'
                      : 'text-primary hover:bg-primary/10'
                  }`}
                  onClick={handleGetLocation}
                  disabled={isGettingLocation}
                  title={location ? 'Change location' : 'Add location'}
                >
                  <MapPin className={`w-5 h-5 ${isGettingLocation ? 'animate-pulse' : ''}`} />
                </Button>

                {/* Schedule */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-primary hover:bg-primary/10 transition-colors"
                      title="Schedule post"
                    >
                      <CalendarIcon className="w-5 h-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule Post</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Date</Label>
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={setScheduledDate}
                          disabled={date => date < new Date()}
                          className="rounded-md border"
                        />
                      </div>
                      <div>
                        <Label>Time</Label>
                        <Input
                          type="time"
                          value={scheduledTime}
                          onChange={e => setScheduledTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center space-x-3">
                {content.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div
                      className={`text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}
                    >
                      {remainingChars}
                    </div>
                    <Progress value={(content.length / characterLimit) * 100} className="w-8 h-2" />
                  </div>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={
                    (!content.trim() && postType !== 'poll') ||
                    (postType === 'poll' &&
                      (!pollQuestion.trim() ||
                        pollOptions.filter(opt => opt.text.trim()).length < 2)) ||
                    isOverLimit ||
                    isSubmitting
                  }
                  variant="gradient"
                  size="sm"
                  className="px-6"
                >
                  {isSubmitting ? 'Posting...' : scheduledDate ? 'Schedule' : 'Post'}
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
