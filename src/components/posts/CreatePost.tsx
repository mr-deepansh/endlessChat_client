import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Sanitizer from '@/utils/sanitizer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Hash,
  AtSign,
} from 'lucide-react';
import { format } from 'date-fns';
// Upload service will be handled by postService

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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
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
    if (!content.trim() && postType !== 'poll' && images.length === 0) return;
    if (
      postType === 'poll' &&
      (!pollQuestion.trim() || pollOptions.filter(opt => opt.text.trim()).length < 2)
    )
      return;

    setIsSubmitting(true);
    try {
      const sanitizedContent = Sanitizer.sanitizeContent(content);
      const sanitizedTitle = Sanitizer.sanitizeContent(articleTitle);
      const sanitizedLocation = Sanitizer.sanitizeInput(location.trim());

      const postData: any = {
        content:
          postType === 'article'
            ? `${sanitizedTitle}\n\n${sanitizedContent}`
            : sanitizedContent || (images.length > 0 ? '📷 Shared media' : 'New post'),
        files: imageFiles && imageFiles.length > 0 ? imageFiles : undefined,
        type: postType,
        location: sanitizedLocation || undefined,
        scheduledFor:
          scheduledDate && scheduledTime
            ? new Date(`${format(scheduledDate, 'yyyy-MM-dd')}T${scheduledTime}`).toISOString()
            : undefined,
      };

      if (postType === 'poll') {
        postData.poll = {
          question: Sanitizer.sanitizeContent(pollQuestion),
          options: pollOptions
            .filter(opt => opt.text.trim())
            .map(opt => ({ text: Sanitizer.sanitizeContent(opt.text), votes: 0 })),
          totalVotes: 0,
          endsAt: new Date(Date.now() + pollDuration * 60 * 60 * 1000).toISOString(),
        };
      }

      await onSubmit?.(postData);

      // Reset form
      setContent('');
      setPostType('text');
      setImages([]);
      setImageFiles([]);
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
        // Validate file type
        const isVideo = file.type.startsWith('video/');
        const isValidFile = isVideo ? Sanitizer.isValidVideo(file) : Sanitizer.isValidImage(file);

        if (!isValidFile) {
          toast({
            title: 'Invalid file type',
            description: 'Please select valid image or video files only.',
            variant: 'destructive',
          });
          return;
        }

        const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for videos, 10MB for images

        if (file.size > maxSize) {
          toast({
            title: 'File too large',
            description: `Please select ${isVideo ? 'videos under 50MB' : 'images under 10MB'}.`,
            variant: 'destructive',
          });
          return;
        }

        // Store the actual file
        setImageFiles(prev => [...prev, file]);

        // Create preview URL
        const reader = new FileReader();
        reader.onload = e => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.onerror = () => {
          toast({
            title: 'Upload failed',
            description: 'Failed to read the file.',
            variant: 'destructive',
          });
        };
        reader.readAsDataURL(file);
      });
    }
    event.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
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

  const handleHashtagClick = () => {
    setContent(prev => prev + '#');
  };

  const handleMentionClick = () => {
    setContent(prev => prev + '@');
  };

  const detectHashtagsAndMentions = (text: string) => {
    const hashtags = text.match(/#\w+/g) || [];
    const mentions = text.match(/@\w+/g) || [];
    return { hashtags, mentions };
  };

  const { hashtags, mentions } = detectHashtagsAndMentions(content);

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
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const locationName =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.state ||
            'Unknown Location';
          setLocation(locationName);
          toast({
            title: 'Location added',
            description: `Added ${locationName} to your post.`,
          });
        } catch (_error) {
          setLocation(
            `${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`
          );
          toast({
            title: 'Location added',
            description: 'Location coordinates added to your post.',
          });
        } finally {
          setIsGettingLocation(false);
        }
      },
      _error => {
        setIsGettingLocation(false);
        toast({
          title: 'Location denied',
          description: 'Please allow location access to add your location.',
          variant: 'destructive',
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.size > 50 * 1024 * 1024) {
          toast({
            title: 'File too large',
            description: 'Video files must be under 50MB.',
            variant: 'destructive',
          });
          return;
        }
        setImageFiles(prev => [...prev, file]);
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
        reader.onerror = () => {
          toast({
            title: 'Upload failed',
            description: 'Failed to read the video file.',
            variant: 'destructive',
          });
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset input value
    event.target.value = '';
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
      <CardContent className="p-3 sm:p-4">
        {/* Mobile Header with Logo */}
        <div className="flex items-center justify-between mb-3 sm:hidden">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">💬</span>
            </div>
            <span className="font-bold text-lg gradient-text">EndlessChat</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {postType === 'text' && '📝'}
            {postType === 'poll' && '📊'}
            {postType === 'article' && '📄'}
            {postType === 'media' && '🎬'}
            {postType.charAt(0).toUpperCase() + postType.slice(1)}
          </Badge>
        </div>

        <div className="flex space-x-3">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-primary/20">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="bg-gradient-primary text-white">
              {user.firstName?.[0] || user.username?.[0] || 'U'}
              {user.lastName?.[0] || ''}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            {/* Post Type Selector - Hidden on mobile, shown in header */}
            <div className="hidden sm:flex items-center space-x-2">
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

            {/* Mobile Post Type Selector */}
            <div className="sm:hidden flex space-x-1 overflow-x-auto pb-2">
              <Button
                variant={postType === 'text' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPostType('text')}
                className="h-8 px-3 flex-shrink-0"
              >
                <Globe className="w-4 h-4 mr-1" />
                Text
              </Button>
              <Button
                variant={postType === 'poll' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPostType('poll')}
                className="h-8 px-3 flex-shrink-0"
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Poll
              </Button>
              <Button
                variant={postType === 'article' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPostType('article')}
                className="h-8 px-3 flex-shrink-0"
              >
                <FileText className="w-4 h-4 mr-1" />
                Article
              </Button>
              <Button
                variant={postType === 'media' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPostType('media')}
                className="h-8 px-3 flex-shrink-0"
              >
                <Image className="w-4 h-4 mr-1" />
                Media
              </Button>
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
              className="min-h-[80px] max-h-[300px] border-none bg-transparent text-lg placeholder:text-muted-foreground resize-none focus-visible:ring-0 overflow-hidden"
              style={{ height: 'auto' }}
              onInput={e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 300) + 'px';
              }}
            />

            {/* Hashtags and Mentions Preview */}
            {(hashtags.length > 0 || mentions.length > 0) && (
              <div className="flex flex-wrap gap-1.5 p-2 bg-muted/20 rounded-lg">
                {hashtags.map((tag, index) => (
                  <Badge
                    key={`hashtag-${index}`}
                    variant="secondary"
                    className="text-blue-600 text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
                {mentions.map((mention, index) => (
                  <Badge
                    key={`mention-${index}`}
                    variant="secondary"
                    className="text-green-600 text-xs"
                  >
                    {mention}
                  </Badge>
                ))}
              </div>
            )}

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
              <div
                className={`grid gap-2 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}
              >
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group bg-muted/20 rounded-lg overflow-hidden border border-border/50"
                  >
                    <div
                      className={`${images.length === 1 ? 'aspect-video' : 'aspect-square'} w-full`}
                    >
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>

                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 px-3 bg-white/90 hover:bg-white text-black"
                          onClick={() => {
                            // Crop functionality placeholder
                            toast({
                              title: 'Crop Feature',
                              description: 'Image cropping will be available soon!',
                            });
                          }}
                        >
                          <span className="text-xs">Crop</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* File info */}
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {index + 1}/{images.length}
                    </div>
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
              <div className="flex items-center space-x-1 overflow-x-auto pb-2">
                {/* Poll */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={`transition-colors hover:scale-105 flex-shrink-0 ${
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
                  className="text-primary hover:bg-primary/10 transition-colors hover:scale-105 flex-shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                  title="Add photos"
                >
                  <Image className="w-5 h-5" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/mov,video/avi"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  key={images.length} // Force re-render to allow same file selection
                />

                {/* Video Upload */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-primary hover:bg-primary/10 transition-colors hover:scale-105 flex-shrink-0"
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

                {/* Hashtag */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-primary hover:bg-primary/10 transition-colors hover:scale-105 flex-shrink-0"
                  onClick={handleHashtagClick}
                  title="Add hashtag"
                >
                  <Hash className="w-5 h-5" />
                </Button>

                {/* Mention */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-primary hover:bg-primary/10 transition-colors hover:scale-105 flex-shrink-0"
                  onClick={handleMentionClick}
                  title="Mention someone"
                >
                  <AtSign className="w-5 h-5" />
                </Button>

                {/* Emoji */}
                <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-primary hover:bg-primary/10 transition-colors hover:scale-105 flex-shrink-0"
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
                  className={`transition-colors hover:scale-105 flex-shrink-0 ${
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
                      className={`transition-colors flex-shrink-0 ${
                        scheduledDate
                          ? 'text-purple-600 bg-purple-50 hover:bg-purple-100'
                          : 'text-primary hover:bg-primary/10'
                      }`}
                      title="Schedule post"
                    >
                      <CalendarIcon className="w-5 h-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule Post</DialogTitle>
                      <DialogDescription>
                        Choose when you want your post to be published.
                      </DialogDescription>
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
                    (!content.trim() && postType !== 'poll' && images.length === 0) ||
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
