# API Integration Guide

This document outlines the API integration between the EndlessChat frontend and the social-media-blog-app backend.

## Backend Setup

1. **Clone and setup the backend:**
   ```bash
   git clone https://github.com/mr-deepansh/social-media-blog-app.git
   cd social-media-blog-app
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Configure your MongoDB, Redis, and other services
   ```

3. **Start the backend server:**
   ```bash
   npm run dev
   # Server will run on http://localhost:5000
   ```

## Frontend Configuration

1. **Set API base URL:**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   # Frontend will run on http://localhost:5173
   ```

## API Services Implemented

### 1. Authentication Service (`authService.ts`)
- ✅ User registration
- ✅ User login/logout
- ✅ Token refresh
- ✅ Password management
- ✅ Email verification
- ✅ Security overview

### 2. Post Service (`postService.ts`)
- ✅ Create posts with media upload
- ✅ Get posts (feed, user posts, my posts)
- ✅ Like/unlike posts
- ✅ Repost functionality
- ✅ View tracking
- ✅ Post management (update, delete)

### 3. Comment Service (`commentService.ts`)
- ✅ Add comments to posts
- ✅ Get comments for posts
- ✅ Like/unlike comments
- ✅ Reply to comments
- ✅ Comment management

### 4. User Service (`userService.ts`)
- ✅ User profile management
- ✅ Follow/unfollow users
- ✅ User search
- ✅ Get followers/following
- ✅ User feed
- ✅ Avatar/cover upload

### 5. Notification Service (`notificationService.ts`)
- ✅ Get notifications
- ✅ Mark as read/unread
- ✅ Delete notifications
- ✅ Notification preferences
- ✅ Real-time notification count

### 6. Admin Service (`adminService.ts`)
- ✅ Admin dashboard
- ✅ User management
- ✅ Analytics and reporting
- ✅ Security monitoring
- ✅ Bulk operations

## API Endpoints Used

### Authentication
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `POST /users/logout` - User logout
- `POST /users/refresh-token` - Refresh access token
- `POST /auth/forgot-password` - Forgot password
- `POST /auth/reset-password/:token` - Reset password

### Posts
- `GET /blogs/posts` - Get all posts (feed)
- `POST /blogs/posts` - Create new post
- `GET /blogs/posts/my-posts` - Get current user's posts
- `GET /blogs/posts/user/:username` - Get user's posts
- `PATCH /blogs/posts/:id` - Update post
- `DELETE /blogs/posts/:id` - Delete post

### Engagement
- `POST /blogs/engagement/:postId/like` - Toggle like
- `POST /blogs/engagement/:postId/view` - Track view
- `POST /blogs/engagement/:postId/repost` - Repost

### Comments
- `GET /blogs/comments/:postId` - Get comments
- `POST /blogs/comments/:postId` - Add comment

### Users
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update profile
- `GET /users/profile/:username` - Get user profile
- `POST /users/follow/:userId` - Follow user
- `POST /users/unfollow/:userId` - Unfollow user
- `GET /users/feed` - Get user feed
- `GET /users/search` - Search users

### Notifications
- `GET /notifications` - Get notifications
- `PATCH /notifications/:id/read` - Mark as read
- `PATCH /notifications/mark-all-read` - Mark all as read
- `DELETE /notifications/:id` - Delete notification

## Features Implemented

### Social Media Features
- ✅ Post creation with text, images, polls, articles
- ✅ Like, comment, repost, share functionality
- ✅ Real-time notifications
- ✅ User profiles with follow/unfollow
- ✅ User feed with posts from followed users
- ✅ Search functionality
- ✅ Media upload support

### UI/UX Features
- ✅ Responsive design (mobile-first)
- ✅ Dark/light theme support
- ✅ Instagram-like interface
- ✅ Real-time updates
- ✅ Loading states and error handling
- ✅ Toast notifications
- ✅ Infinite scroll (ready for implementation)

### Admin Features
- ✅ Admin dashboard with analytics
- ✅ User management
- ✅ Content moderation
- ✅ Security monitoring
- ✅ Bulk operations

## Error Handling

All API calls include proper error handling:
- Network errors
- Authentication errors (401)
- Authorization errors (403)
- Validation errors (400)
- Server errors (500)

## Token Management

- Automatic token refresh on 401 errors
- Secure token storage in localStorage
- Automatic logout on refresh failure

## Next Steps

1. **Real-time Features:**
   - WebSocket integration for live updates
   - Real-time notifications
   - Live chat functionality

2. **Advanced Features:**
   - Push notifications
   - Offline support (PWA)
   - Advanced search filters
   - Content recommendations

3. **Performance:**
   - Image optimization
   - Lazy loading
   - Caching strategies
   - Bundle optimization

## Testing

To test the integration:

1. Start both backend and frontend servers
2. Register a new user
3. Create posts with different types (text, images, polls)
4. Test social interactions (like, comment, follow)
5. Check notifications functionality
6. Test admin features (if admin user)

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Ensure backend CORS is configured for frontend URL
   - Check if both servers are running

2. **Authentication Issues:**
   - Clear localStorage and try again
   - Check if backend JWT configuration is correct

3. **File Upload Issues:**
   - Check file size limits
   - Ensure proper multipart/form-data headers

4. **API Errors:**
   - Check backend logs for detailed error messages
   - Verify API endpoint URLs match backend routes