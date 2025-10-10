# 🌐 EndlessChat - Enterprise Social Media Platform (Frontend)

<div align="center">

![React](https://img.shields.io/badge/React-19+-61DAFB.svg?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6.svg?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1+-646CFF.svg?logo=vite&logoColor=FFD62E)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4+-38BDF8.svg?logo=tailwindcss&logoColor=white)
![Shadcn](https://img.shields.io/badge/Shadcn/UI-Latest-0F172A.svg?logo=storybook&logoColor=white)  
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8.svg?logo=pwa&logoColor=white)
![Security](https://img.shields.io/badge/Security-A+-0F9D58.svg?logo=shield&logoColor=white)
![Version](https://img.shields.io/badge/Version-1.0.0-673AB7.svg?logo=semver&logoColor=white)  
![Status](https://img.shields.io/badge/Status-Development-2E7D32.svg?logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-FFD43B.svg?logo=open-source-initiative&logoColor=black)

---

**Enterprise-grade social media frontend built with modern React ecosystem —  
optimized for scalability, real-time interaction, and professional UI/UX.**

[🚀 Quick Start](#-quick-start) • [✨ Features](#-enterprise-features) • [🏗️ Architecture](#️-architecture) • [📡 API Integration](#-backend-integration) • [🚀 Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [🚀 Quick Start](#-quick-start)
- [✨ Enterprise Features](#-enterprise-features)
- [🏗️ Architecture](#️-architecture)
- [📡 Backend Integration](#-backend-integration)
- [🔒 Security Features](#-security-features)
- [⚡ Performance](#-performance)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Project Overview

**EndlessChat Frontend** is a modern, enterprise-grade React application providing a comprehensive social media experience. Built with React 19, TypeScript, Vite, and Tailwind CSS, it offers Instagram-like features with professional UI/UX design and enterprise-level security.

### 🎯 Tech Stack

- **React 19.2** - Latest React with concurrent features
- **TypeScript 5.5** - Type-safe development
- **Vite 7.1** - Lightning-fast build tool
- **Tailwind CSS 3.4** - Utility-first styling
- **Shadcn/UI** - Accessible component library
- **React Query** - Server state management
- **React Router 6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Zod** - Schema validation
- **React Hook Form** - Form management

### 🏆 Key Features

- **Instagram-like Social Feed** - Posts, comments, likes, reposts, bookmarks
- **Real-time Notifications** - Live updates with sound alerts
- **Advanced Admin Dashboard** - User management and analytics
- **Multi-step Registration** - Professional onboarding
- **Theme Support** - System preference detection
- **PWA Ready** - Offline support and installable
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG compliant

---

## 🚀 Quick Start

### 🔧 Prerequisites

| Component | Version | Purpose             |
| --------- | ------- | ------------------- |
| Node.js   | 18+     | Runtime environment |
| npm       | Latest  | Package manager     |
| Git       | 2.30+   | Version control     |

### ⚡ Installation

```bash
# 1. Clone repository
git clone https://github.com/mr-deepansh/endlessChat_client.git
cd endlessChat_client

# 2. Install dependencies
npm install

# 3. Environment setup
cp .env.example .env
# Edit .env with your backend URL

# 4. Start development server
npm run dev

# 5. Open browser
# Navigate to http://localhost:5173
```

### 🎯 Environment Configuration

```env
# App Configuration
VITE_APP_NAME=EndlessChat
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=http://localhost:5000/api/v2
VITE_APP_DESCRIPTION=EndlessChat Enterprise Social Media Platform

# Network Configuration
VITE_BACKEND_HOST=localhost
VITE_BACKEND_PORT=5000

# Environment
VITE_NODE_ENV=development

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
VITE_ENABLE_REAL_TIME=true
VITE_ENABLE_NOTIFICATIONS=true

# UI Configuration
VITE_DEFAULT_THEME=system
VITE_ENABLE_DARK_MODE=false
VITE_ENABLE_ANIMATIONS=true

# Upload Configuration
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
VITE_MAX_FILES_PER_POST=5

# Social Features
VITE_ENABLE_COMMENTS=true
VITE_ENABLE_LIKES=true
VITE_ENABLE_REPOSTS=true
VITE_ENABLE_BOOKMARKS=true
VITE_ENABLE_HASHTAGS=true

# Admin Features
VITE_ENABLE_ADMIN_DASHBOARD=true
VITE_ENABLE_USER_MANAGEMENT=true
VITE_ENABLE_ANALYTICS_DASHBOARD=true
VITE_ENABLE_SECURITY_MONITORING=true

# Development
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_API_MOCKING=false
VITE_LOG_LEVEL=info
```

---

## ✨ Enterprise Features

### 🎛️ Social Media Core

#### Instagram-like Feed Experience

- **Post Creation** - Text, images with drag-and-drop upload
- **Engagement System** - Likes, comments, reposts, shares
- **View Tracking** - Real-time view counts
- **Media Support** - Multiple image uploads (up to 5)
- **Emoji Support** - Rich emoji picker
- **Bookmark System** - Save posts for later

#### Advanced Interactions

- **Quote Reposts** - Twitter-like quote functionality
- **Comment Threading** - Nested discussions
- **Real-time Updates** - Live feed without refresh
- **Follow System** - Follow/unfollow users
- **User Profiles** - Detailed profile pages

### 🔔 Notification System

- **Tabbed Interface** - All, Following, You notifications
- **Real-time Updates** - Live notification badges
- **Sound Alerts** - Audio notifications
- **Interaction Types** - Likes, comments, follows, mentions
- **User Thumbnails** - Profile pictures in notifications
- **Action Buttons** - Quick follow/unfollow

### 👑 Enterprise Admin Dashboard

- **User Analytics** - Total users, active users, growth metrics
- **Content Metrics** - Posts, comments, engagement rates
- **Real-time Statistics** - Live dashboard updates
- **User Management** - Search, filter, suspend, activate users
- **Export Functionality** - CSV export for user data
- **Role-based Access** - Admin and super admin roles
- **Security Monitoring** - Admin access controls

### 🎨 Professional UI/UX

- **Shadcn/UI Components** - 40+ accessible components
- **Gradient Themes** - Professional color schemes
- **Smooth Animations** - Tailwind CSS animations
- **Loading States** - Skeleton loaders and spinners
- **Error Boundaries** - Graceful error handling
- **Toast Notifications** - User feedback system
- **Responsive Design** - Mobile-first approach

---

## 🏗️ Architecture

### 📁 Project Structure

```
endlessChat_client/
├── 🏢 src/
│   ├── 🎯 components/
│   │   ├── 🔐 auth/                 # Login, Register, ForgotPassword
│   │   ├── 👑 admin/                # Admin dashboard components
│   │   ├── 🦸 super_admin/          # Super admin components
│   │   ├── 📝 posts/                # Post creation, display, actions
│   │   ├── 📰 feed/                 # Feed components
│   │   ├── 🔔 notifications/        # Notification components
│   │   ├── 👤 user/                 # User profile components
│   │   ├── 📋 forms/                # Form components
│   │   ├── 🎨 ui/                   # Shadcn UI library (40+ components)
│   │   ├── 🏗️ layout/               # Navbar, Footer, Layout
│   │   ├── 🔄 loaders/              # Loading components
│   │   └── 🧩 common/               # Shared components
│   ├── 📄 pages/
│   │   ├── public/                  # Landing, About, Features, Contact
│   │   ├── auth/                    # Login, Register pages
│   │   ├── app/                     # Feed, Profile, Notifications
│   │   ├── admin/                   # Admin dashboard pages
│   │   ├── user/                    # User-specific pages
│   │   └── index.ts                 # Page exports
│   ├── 🔗 contexts/
│   │   ├── AuthContext.tsx          # Authentication state
│   │   ├── ThemeContext.tsx         # Theme management
│   │   ├── NotificationContext.tsx  # Notification state
│   │   └── RateLimitContext.tsx     # Rate limiting
│   ├── 🛠️ services/
│   │   ├── core/                    # Core service utilities
│   │   ├── modules/                 # Service modules
│   │   ├── config/                  # Service configuration
│   │   ├── __tests__/               # Service tests
│   │   ├── authService.ts           # Authentication API
│   │   ├── userService.ts           # User management
│   │   ├── postService.ts           # Post operations
│   │   ├── commentService.ts        # Comment operations
│   │   ├── followService.ts         # Follow/unfollow
│   │   ├── notificationService.ts   # Notifications
│   │   ├── adminService.ts          # Admin operations
│   │   ├── uploadService.ts         # File uploads
│   │   ├── realTimePostService.ts   # Real-time updates
│   │   ├── apiCache.ts              # API caching
│   │   ├── apiOptimizer.ts          # Performance optimization
│   │   └── serviceManager.ts        # Service orchestration
│   ├── 🎣 hooks/
│   │   ├── use-toast.ts             # Toast notifications
│   │   ├── use-mobile.tsx           # Mobile detection
│   │   ├── useApi.ts                # API hook
│   │   ├── useDebounce.ts           # Debouncing
│   │   ├── useAccessibility.ts      # Accessibility features
│   │   ├── useAnalytics.ts          # Analytics tracking
│   │   ├── usePerformance.ts        # Performance monitoring
│   │   ├── useRealTimeUpdates.ts    # Real-time data
│   │   ├── useOptimizedFeed.ts      # Optimized feed loading
│   │   └── useResponsive.ts         # Responsive utilities
│   ├── 🛠️ utils/
│   │   ├── debounce.ts              # Input debouncing
│   │   ├── throttle.ts              # Request throttling
│   │   ├── sanitizer.ts             # Input sanitization
│   │   ├── secureStorage.ts         # Secure local storage
│   │   ├── logger.ts                # Logging utility
│   │   ├── performance.ts           # Performance utilities
│   │   ├── accessibility.ts         # A11y helpers
│   │   ├── roleUtils.ts             # Role management
│   │   └── constants.ts             # App constants
│   ├── 🔧 config/
│   │   └── environment.ts           # Environment config
│   ├── 🎨 lib/
│   │   ├── utils.ts                 # Utility functions
│   │   ├── axios.ts                 # Axios configuration
│   │   └── arcjet.ts                # Security integration
│   ├── 📊 types/
│   │   └── api.ts                   # API type definitions
│   ├── 🎨 assets/
│   │   ├── hero-social.jpg
│   │   └── world-hero.jpg
│   └── 🎨 styles/
│       ├── index.css                # Main styles
│       ├── App.css                  # App styles
│       └── responsive.css           # Responsive styles
├── 🌐 public/
│   ├── favicon.svg
│   ├── manifest.json                # PWA manifest
│   ├── notification-sound.mp3
│   └── robots.txt
├── 📚 docs/
│   ├── COMPONENT_LIBRARY.md
│   ├── RESPONSIVE_DESIGN_GUIDE.md
│   └── PRODUCTION_ARCHITECTURE.md
├── 📮 postman/
│   ├── Blog all APIs.postman_collection.json
│   └── social-medial-app.postman_collection.json
├── 📦 package.json
├── ⚙️ vite.config.ts
├── 🎨 tailwind.config.ts
├── 🔧 tsconfig.json
├── 🎨 .prettierrc
├── 🔍 .eslintrc.json
└── 📝 README.md
```

### 🔄 Service Architecture

#### API Service Layer

- **Service Manager** - Centralized service orchestration
- **API Cache** - Request caching for performance
- **API Optimizer** - Request batching and optimization
- **Axios Instance** - Configured HTTP client with interceptors
- **Error Handling** - Centralized error management
- **Request Queue** - Request throttling and queuing

#### State Management

- **React Context** - Global state (Auth, Theme, Notifications)
- **React Query** - Server state caching and synchronization
- **Local Storage** - Secure persistent storage
- **Session Storage** - Temporary data storage

---

## 📡 Backend Integration

### 🎯 API Configuration

This frontend integrates with the **Enterprise Social Media Blog Platform** backend (API v2).

**Backend Repository**: [social-media-blog-app](https://github.com/mr-deepansh/social-media-blog-app)

### 📊 API Endpoints (v2)

#### Authentication

```typescript
const API_BASE = import.meta.env.VITE_API_BASE_URL; // http://localhost:5000/api/v2

POST ${API_BASE}/auth/register          # User registration
POST ${API_BASE}/auth/login             # User login
POST ${API_BASE}/auth/logout            # User logout
POST ${API_BASE}/auth/refresh-token     # Refresh JWT token
POST ${API_BASE}/auth/forgot-password   # Password reset request
POST ${API_BASE}/auth/reset-password    # Password reset
```

#### User Management

```typescript
GET    ${API_BASE}/users/profile        # Get current user profile
PUT    ${API_BASE}/users/profile        # Update profile
GET    ${API_BASE}/users/:id            # Get user by ID
POST   ${API_BASE}/users/follow/:id     # Follow user
DELETE ${API_BASE}/users/unfollow/:id   # Unfollow user
GET    ${API_BASE}/users/:id/followers  # Get followers
GET    ${API_BASE}/users/:id/following  # Get following
```

#### Posts

```typescript
GET    ${API_BASE}/posts                # Get all posts (feed)
POST   ${API_BASE}/posts                # Create post
GET    ${API_BASE}/posts/:id            # Get post by ID
PUT    ${API_BASE}/posts/:id            # Update post
DELETE ${API_BASE}/posts/:id            # Delete post
POST   ${API_BASE}/posts/:id/like       # Like post
DELETE ${API_BASE}/posts/:id/unlike     # Unlike post
POST   ${API_BASE}/posts/:id/repost     # Repost
POST   ${API_BASE}/posts/:id/bookmark   # Bookmark post
DELETE ${API_BASE}/posts/:id/bookmark   # Remove bookmark
GET    ${API_BASE}/posts/user/:id       # Get user posts
```

#### Comments

```typescript
GET    ${API_BASE}/posts/:id/comments   # Get post comments
POST   ${API_BASE}/posts/:id/comments   # Create comment
PUT    ${API_BASE}/comments/:id         # Update comment
DELETE ${API_BASE}/comments/:id         # Delete comment
POST   ${API_BASE}/comments/:id/like    # Like comment
```

#### Notifications

```typescript
GET ${API_BASE}/notifications           # Get all notifications
GET ${API_BASE}/notifications/unread    # Get unread count
PUT ${API_BASE}/notifications/:id/read  # Mark as read
PUT ${API_BASE}/notifications/read-all  # Mark all as read
```

#### Admin Dashboard

```typescript
GET    ${API_BASE}/admin/dashboard/stats    # Dashboard statistics
GET    ${API_BASE}/admin/users              # Get all users
GET    ${API_BASE}/admin/users/:id          # Get user details
PUT    ${API_BASE}/admin/users/:id/status   # Update user status
DELETE ${API_BASE}/admin/users/:id          # Delete user
GET    ${API_BASE}/admin/posts              # Get all posts
DELETE ${API_BASE}/admin/posts/:id          # Delete post
GET    ${API_BASE}/admin/analytics          # Analytics data
```

#### File Upload

```typescript
POST ${API_BASE}/upload/image           # Upload single image
POST ${API_BASE}/upload/multiple        # Upload multiple images
```

### 🔐 Authentication Flow

1. **Login** - User submits credentials
2. **JWT Token** - Backend returns access token
3. **Token Storage** - Stored in secure httpOnly cookie
4. **Auto Refresh** - Token refreshed before expiration
5. **Protected Routes** - Token validated on each request
6. **Logout** - Token invalidated and cleared

### 🔄 Real-time Features

- **Notifications** - Live notification updates
- **Feed Updates** - Real-time post updates
- **Like Counts** - Instant engagement updates
- **Comment Updates** - Live comment additions

---

## 🔒 Security Features

### 🛡️ Authentication & Authorization

- **JWT Tokens** - Secure token-based authentication
- **HttpOnly Cookies** - XSS protection
- **Token Refresh** - Automatic token renewal
- **Role-based Access** - Admin, user permissions
- **Protected Routes** - Route-level authentication
- **Session Management** - Proper logout and cleanup

### 🔐 Input Security

- **Input Sanitization** - XSS prevention
- **Form Validation** - Zod schema validation
- **CSRF Protection** - Token-based validation
- **Rate Limiting** - Request throttling
- **Secure Storage** - Encrypted local storage

### 🛡️ API Security

- **Request Interceptors** - Automatic token injection
- **Error Handling** - Secure error messages
- **HTTPS Only** - Production SSL enforcement
- **CORS Configuration** - Proper origin validation

---

## ⚡ Performance

### 🚀 Optimization Strategies

- **Code Splitting** - Route-based lazy loading
- **Tree Shaking** - Unused code elimination
- **Bundle Optimization** - Vite production build
- **Image Optimization** - Lazy loading images
- **API Caching** - Request caching with React Query
- **Debouncing** - Input and search optimization
- **Memoization** - React.memo and useMemo

### 📊 Performance Metrics

- **LCP** - < 2.5s (Largest Contentful Paint)
- **FID** - < 100ms (First Input Delay)
- **CLS** - < 0.1 (Cumulative Layout Shift)
- **Bundle Size** - Optimized with code splitting

---

## 🚀 Deployment

### 🌐 Build Process

```bash
# Development build
npm run build:dev

# Production build
npm run build:prod

# Preview production build
npm run preview

# Analyze bundle
npm run analyze
```

### 🚀 Deployment Options

#### Vercel (Recommended)

```bash
npm i -g vercel
vercel
vercel --prod
```

#### Netlify

```bash
# Build command: npm run build
# Publish directory: dist
```

#### Docker

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 🔧 Production Environment

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v2
VITE_NODE_ENV=production
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=true
```

---

## 🤝 Contributing

### 📋 Available Scripts

```bash
# Development
npm run dev                  # Start development server
npm run preview              # Preview production build

# Build
npm run build                # Production build
npm run build:prod           # Production build (explicit)
npm run build:dev            # Development build

# Code Quality
npm run lint                 # Run ESLint (max 10 warnings)
npm run lint:fix             # Fix ESLint issues
npm run lint:strict          # Strict linting (0 warnings)
npm run lint:ci              # CI linting with JSON report
npm run lint:report          # Generate HTML lint report

# Formatting
npm run format               # Format source files
npm run format:check         # Check formatting
npm run format:all           # Format all files
npm run format:staged        # Format staged files

# Type Checking
npm run type-check           # TypeScript type checking

# Quality Checks
npm run quality              # Run all quality checks
npm run quality:ci           # Strict quality checks for CI
npm run fix                  # Fix linting and formatting

# Git Hooks
npm run precommit            # Pre-commit quality check
npm run prepush              # Pre-push quality check

# Analysis
npm run analyze              # Bundle size analysis
```

### 👥 Development Workflow

1. Fork the repository
2. Clone: `git clone https://github.com/mr-deepansh/endlessChat_client.git`
3. Install: `npm install`
4. Create branch: `git checkout -b feature/amazing-feature`
5. Develop: `npm run dev`
6. Quality check: `npm run quality`
7. Commit: Follow conventional commits
8. Push and create PR

### 📋 Code Standards

- **TypeScript** - Strict type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Conventional Commits** - Commit message format
- **Husky** - Git hooks for quality checks

---

## 📄 License

MIT License - Copyright (c) 2024 Deepansh Gangwar

---

## 📞 Support & Contact

- **📧 Email**: deepanshgangwar7037@gmail.com
- **🐛 Issues**: [GitHub Issues](https://github.com/mr-deepansh/endlessChat_client/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/mr-deepansh/endlessChat_client/discussions)

### 🌐 Resources

- **Backend Repository**: [social-media-blog-app](https://github.com/mr-deepansh/social-media-blog-app)
- **Live Demo**: [EndlessChat Demo](https://endlesschat.vercel.app)
- **API Documentation**: Backend API v2 Reference

---

<div align="center">

**🚀 Built with Modern React Excellence by [Deepansh Gangwar](https://github.com/mr-deepansh)**

[![GitHub](https://img.shields.io/badge/GitHub-Profile-blue?style=for-the-badge&logo=github)](https://github.com/mr-deepansh)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/deepansh-gangwar)
[![Email](https://img.shields.io/badge/Email-Contact-red?style=for-the-badge&logo=gmail)](mailto:deepanshgangwar7037@gmail.com)

**⭐ Star this repository if it powers your social media experience! ⭐**

_Last Updated: January 2025 | Version: 1.0.0 | Enterprise Frontend Edition_

</div>
