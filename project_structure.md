```
endlessChat_client/
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/                # Layout components
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── PageTransition.tsx
│   │   ├── auth/                  # Authentication components
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── StepForm.tsx
│   │   ├── Posts/                  # Posts components
│   │   │   ├── CreatePost.tsx
│   │   │   └── PostCard.tsx
│   │   ├── user/                  # user components
│   │   │   └── UserCard.tsx
│   │   └── loaders/                # Reusable components
│   │       ├── AdminDashboardSkeleton.tsx
│   │       └── ProfileSkeleton.tsx
│   ├── pages/                     # Page components
│   │   ├── AdminDashboard.tsx
│   │   ├── CurrentUserProfile.tsx
│   │   ├── Feed.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── Index.tsx
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx
│   │   ├── ProfilePage.tsx
│   │   └── Register.tsx
│   ├── hooks/                     # Custom React hooks
│   │   ├── user-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/                     # 
│   │   ├── axios.tsx
│   │   └── utils.ts
│   ├── services/                  # API and external services
│   │   ├── AdminService.tsx
│   │   ├── api.ts
│   │   └── userService.ts
│   ├── contexts/                    # Global styles
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── assets/                    # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── App.tsx                    # Main App component
│   ├── main.tsx                   # Entry point
│   ├── App.css
│   ├── index.css
│   └── vite-env.d.ts             # Vite type definitions
├── .env                          # Environment variables
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
├── package-lock.json             # Locked dependency versions
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── vite.config.ts                # Vite configuration
├── components.json               # shadcn/ui configuration
└── README.md                     # Project documentation
```