# 🧩 Component Library - EndlessChat

## Overview

EndlessChat uses a comprehensive component library built on top of shadcn/ui, providing consistent, accessible, and responsive components across the entire application.

## 🏗️ Architecture

### Component Hierarchy

```
src/components/
├── ui/                     # Base UI components (shadcn/ui)
├── forms/                  # Form-specific components
├── layout/                 # Layout and navigation components
├── common/                 # Shared utility components
├── auth/                   # Authentication components
├── feed/                   # Feed-specific components
├── user/                   # User-related components
├── admin/                  # Admin dashboard components
├── super_admin/            # Super admin components
├── posts/                  # Post-related components
├── notifications/          # Notification components
└── loaders/                # Loading and skeleton components
```

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary: 262 83% 58%; /* Purple-blue gradient base */
--primary-foreground: 0 0% 100%; /* White text on primary */
--primary-glow: 252 100% 75%; /* Glowing accent */

/* Secondary Colors */
--secondary: 270 20% 96%; /* Light purple-gray */
--accent: 212 100% 50%; /* Electric blue */

/* Social Action Colors */
--social-like: 0 84% 60%; /* Red for likes */
--social-repost: 120 60% 50%; /* Green for reposts */
--social-comment: 200 80% 55%; /* Blue for comments */
--social-share: 280 60% 60%; /* Purple for shares */
```

### Typography Scale

```css
/* Responsive text sizes */
text-xs:     12px → 14px → 16px → 18px → 20px
text-sm:     14px → 16px → 18px → 20px → 24px
text-base:   16px → 18px → 20px → 24px → 28px
text-lg:     18px → 20px → 24px → 28px → 32px
text-xl:     20px → 24px → 28px → 32px → 36px
text-2xl:    24px → 28px → 32px → 36px → 42px
```

### Spacing System

```css
/* 8px base unit system */
gap-1: 4px   → 6px   → 8px   → 10px  → 12px
gap-2: 8px   → 10px  → 12px  → 16px  → 20px
gap-3: 12px  → 16px  → 20px  → 24px  → 32px
gap-4: 16px  → 20px  → 24px  → 32px  → 40px
gap-6: 24px  → 32px  → 40px  → 48px  → 64px
```

## 🧩 Core Components

### ResponsiveContainer

Provides consistent container sizing across breakpoints.

```tsx
import { ResponsiveContainer } from '@/components/ui/responsive-container';

<ResponsiveContainer variant="default" padding="md">
  <YourContent />
</ResponsiveContainer>;
```

**Props:**

- `variant`: 'default' | 'narrow' | 'wide' | 'full'
- `padding`: 'none' | 'sm' | 'md' | 'lg' | 'xl'

### ResponsiveGrid

Intelligent grid system that adapts to screen size.

```tsx
import { ResponsiveGrid } from '@/components/ui/responsive-grid';

<ResponsiveGrid cols={{ default: 1, md: 2, lg: 3, xl: 4 }} gap="md" align="stretch">
  {items.map(item => (
    <GridItem key={item.id} />
  ))}
</ResponsiveGrid>;
```

**Props:**

- `cols`: Object defining columns per breakpoint
- `gap`: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- `align`: 'start' | 'center' | 'end' | 'stretch'

### ResponsiveText

Typography component with automatic scaling.

```tsx
import { ResponsiveText } from '@/components/ui/responsive-text';

<ResponsiveText as="h1" size="3xl" weight="bold" color="primary" align="center">
  Responsive Heading
</ResponsiveText>;
```

**Props:**

- `as`: HTML element type
- `size`: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
- `weight`: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
- `color`: 'default' | 'muted' | 'primary' | 'secondary' | 'accent' | 'destructive'
- `align`: 'left' | 'center' | 'right' | 'justify'
- `responsive`: boolean (enables responsive scaling)

### ResponsiveCard

Enhanced card component with responsive sizing.

```tsx
import { ResponsiveCard } from '@/components/ui/responsive-card';

<ResponsiveCard variant="elevated" size="md" hover={true} interactive={true}>
  <ResponsiveCardHeader>
    <ResponsiveCardTitle>Card Title</ResponsiveCardTitle>
    <ResponsiveCardDescription>Card description</ResponsiveCardDescription>
  </ResponsiveCardHeader>
  <ResponsiveCardContent>{/* Card content */}</ResponsiveCardContent>
</ResponsiveCard>;
```

### ResponsiveButton

Button component with responsive sizing and states.

```tsx
import { ResponsiveButton } from '@/components/ui/responsive-button';

<ResponsiveButton
  variant="gradient"
  size="lg"
  loading={isSubmitting}
  icon={<Save />}
  iconPosition="left"
  disabled={!isValid}
>
  Save Changes
</ResponsiveButton>;
```

## 📝 Form Components

### FormInputField

Comprehensive input field with validation and accessibility.

```tsx
import { FormInputField } from '@/components/forms/FormField';

<FormInputField
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={setEmail}
  error={emailError}
  hint="We'll never share your email"
  required={true}
  icon={<Mail />}
  iconPosition="left"
  maxLength={100}
  autoComplete="email"
/>;
```

### FormTextareaField

Multi-line text input with character counting.

```tsx
import { FormTextareaField } from '@/components/forms/FormField';

<FormTextareaField
  label="Bio"
  placeholder="Tell us about yourself"
  value={bio}
  onChange={setBio}
  rows={4}
  maxLength={500}
  resize={false}
  hint="This will be visible on your profile"
/>;
```

### FormSelectField

Dropdown selection with proper accessibility.

```tsx
import { FormSelectField } from '@/components/forms/FormField';

<FormSelectField
  label="Country"
  value={country}
  onChange={setCountry}
  placeholder="Select your country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
  required={true}
/>;
```

### FormContainer

Wrapper for forms with loading states and error handling.

```tsx
import { FormContainer } from '@/components/forms/FormContainer';

<FormContainer
  title="Create Account"
  description="Join the EndlessChat community"
  loading={isSubmitting}
  error={submitError}
  success={submitSuccess}
  maxWidth="md"
  onSubmit={handleSubmit}
>
  {/* Form fields */}
</FormContainer>;
```

## 🎯 Layout Components

### ResponsiveLayout

Main layout wrapper with multiple variants.

```tsx
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';

// Dashboard layout with sidebar
<ResponsiveLayout
  variant="sidebar"
  showNavbar={true}
  showSidebar={true}
  showFooter={false}
  containerVariant="wide"
  padding="lg"
>
  <DashboardContent />
</ResponsiveLayout>

// Centered auth layout
<ResponsiveLayout variant="auth">
  <LoginForm />
</ResponsiveLayout>
```

**Variants:**

- `default`: Standard page layout
- `centered`: Centered content (for auth pages)
- `sidebar`: Layout with left sidebar
- `dashboard`: Admin dashboard layout
- `auth`: Authentication page layout

## 🎨 Styling Guidelines

### Responsive Spacing

```tsx
// Use responsive spacing classes
<div className="p-3 sm:p-4 lg:p-6 xl:p-8 2xl:p-10">
  {/* Content with responsive padding */}
</div>

// Or use utility classes
<div className="padding-responsive">
  {/* Content with predefined responsive padding */}
</div>
```

### Responsive Typography

```tsx
// Manual responsive text
<h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold">
  Manual Responsive Heading
</h1>

// Using ResponsiveText component
<ResponsiveText as="h1" size="3xl" weight="bold">
  Component Responsive Heading
</ResponsiveText>
```

### Responsive Grids

```tsx
// Product grid that adapts to screen size
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6 xl:gap-8">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

## 🔧 Custom Hooks

### useResponsive

Comprehensive responsive state management.

```tsx
import { useResponsive } from '@/hooks/useResponsive';

const MyComponent = () => {
  const { isMobile, isTablet, isDesktop, currentBreakpoint, isAbove, isBetween } = useResponsive();

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}

      {isAbove('lg') && <LargeScreenFeature />}
      {isBetween('md', 'xl') && <MediumScreenFeature />}
    </div>
  );
};
```

### useAccessibility

Accessibility utilities and helpers.

```tsx
import { useAccessibility } from '@/hooks/useAccessibility';

const AccessibleComponent = () => {
  const { useFocusManagement, useKeyboardNavigation, useScreenReader, useReducedMotion } =
    useAccessibility();

  const { setFocus, trapFocus } = useFocusManagement();
  const { announce } = useScreenReader();
  const prefersReducedMotion = useReducedMotion();

  // Use accessibility features
};
```

## 📱 Mobile-Specific Components

### Mobile Navigation

```tsx
// Mobile-optimized navigation drawer
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" className="md:hidden touch-target">
      <Menu className="icon-responsive-md" />
    </Button>
  </SheetTrigger>
  <SheetContent side="right" className="w-72 sm:w-80">
    <MobileNavigationContent />
  </SheetContent>
</Sheet>
```

### Touch-Optimized Buttons

```tsx
// Buttons optimized for touch interaction
<ResponsiveButton variant="gradient" size="lg" className="touch-target hover-scale-responsive">
  Touch-Friendly Button
</ResponsiveButton>
```

## 🖥️ Desktop-Specific Components

### Multi-Column Layouts

```tsx
// Desktop-optimized multi-column layout
<div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
  <aside className="lg:col-span-1">
    <Sidebar />
  </aside>
  <main className="lg:col-span-2 xl:col-span-3 2xl:col-span-4">
    <MainContent />
  </main>
  <aside className="lg:col-span-1">
    <RightSidebar />
  </aside>
</div>
```

### Hover Interactions

```tsx
// Rich hover states for desktop
<Card className="hover-lift-responsive hover:shadow-primary/20 transition-all duration-300">
  <CardContent>{/* Content with desktop hover effects */}</CardContent>
</Card>
```

## 🎯 Usage Examples

### Complete Responsive Page

```tsx
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { ResponsiveGrid } from '@/components/ui/responsive-grid';
import { ResponsiveCard } from '@/components/ui/responsive-card';
import { ResponsiveText } from '@/components/ui/responsive-text';

const ResponsivePage = () => {
  return (
    <ResponsiveLayout
      variant="default"
      showNavbar={true}
      showFooter={true}
      containerVariant="default"
      padding="md"
    >
      <ResponsiveText as="h1" size="3xl" weight="bold" align="center">
        Page Title
      </ResponsiveText>

      <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3, xl: 4 }} gap="md">
        {items.map(item => (
          <ResponsiveCard key={item.id} variant="elevated" hover={true} interactive={true}>
            <ResponsiveCardContent>{/* Card content */}</ResponsiveCardContent>
          </ResponsiveCard>
        ))}
      </ResponsiveGrid>
    </ResponsiveLayout>
  );
};
```

### Responsive Form

```tsx
import { FormContainer, FormInputField, FormTextareaField } from '@/components/forms';

const ResponsiveForm = () => {
  return (
    <FormContainer
      title="Contact Us"
      description="We'd love to hear from you"
      maxWidth="lg"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInputField
          label="First Name"
          value={firstName}
          onChange={setFirstName}
          required={true}
        />
        <FormInputField label="Last Name" value={lastName} onChange={setLastName} required={true} />
      </div>

      <FormInputField
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        required={true}
        icon={<Mail />}
      />

      <FormTextareaField
        label="Message"
        value={message}
        onChange={setMessage}
        rows={5}
        maxLength={1000}
        required={true}
      />

      <ResponsiveButton
        type="submit"
        variant="gradient"
        size="lg"
        className="w-full"
        loading={isSubmitting}
      >
        Send Message
      </ResponsiveButton>
    </FormContainer>
  );
};
```

## 🎨 Theming and Customization

### CSS Custom Properties

```css
:root {
  /* Responsive spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Responsive typography */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 1rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1.25rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.5rem);

  /* Animation timing */
  --transition-fast: 150ms ease-out;
  --transition-normal: 300ms ease-out;
  --transition-slow: 500ms ease-out;
}
```

### Dark Mode Support

```css
.dark {
  /* Dark mode color overrides */
  --background: 220 15% 15%;
  --foreground: 220 15% 95%;
  --card: 220 15% 18%;
  --primary: 262 83% 68%;
}
```

## ♿ Accessibility Features

### ARIA Support

All components include proper ARIA attributes:

```tsx
// Automatic ARIA attributes
<ResponsiveButton aria-label="Save document" aria-describedby="save-hint" aria-pressed={isSaved}>
  Save
</ResponsiveButton>
```

### Keyboard Navigation

```tsx
// Built-in keyboard support
<FormInputField
  onKeyDown={e => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }}
/>
```

### Screen Reader Support

```tsx
// Screen reader announcements
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

## 🚀 Performance Optimizations

### Lazy Loading

```tsx
// Lazy load heavy components
const AdminDashboard = lazy(() => import('./AdminDashboard'));

<Suspense fallback={<DashboardSkeleton />}>
  <AdminDashboard />
</Suspense>;
```

### Code Splitting

```tsx
// Route-based code splitting
const routes = [
  {
    path: '/admin',
    component: lazy(() => import('./pages/admin/AdminDashboard')),
  },
  {
    path: '/feed',
    component: lazy(() => import('./pages/app/Feed')),
  },
];
```

### Image Optimization

```tsx
// Responsive images with optimization
<img
  src={getOptimizedImageUrl(imageUrl, screenWidth)}
  alt="Description"
  className="w-full h-auto"
  loading="lazy"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

## 🧪 Testing Components

### Component Testing

```tsx
import { render, screen } from '@testing-library/react';
import { Responsive Button } from '@/components/ui/responsive-button';

test('ResponsiveButton renders correctly', () => {
  render(
    <ResponsiveButton variant="gradient" size="lg">
      Test Button
    </ResponsiveButton>
  );

  expect(screen.getByRole('button')).toBeInTheDocument();
  expect(screen.getByText('Test Button')).toBeInTheDocument();
});
```

### Accessibility Testing

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

test('Component has no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 📚 Best Practices

### Component Development

1. **Always use TypeScript** for type safety
2. **Include proper ARIA attributes** for accessibility
3. **Test on multiple screen sizes** during development
4. **Use semantic HTML elements** when possible
5. **Implement proper error boundaries** for robustness
6. **Follow naming conventions** for consistency
7. **Document component props** and usage examples

### Performance Guidelines

1. **Lazy load non-critical components**
2. **Use React.memo for expensive components**
3. **Implement proper key props for lists**
4. **Optimize images and assets**
5. **Use CSS-in-JS sparingly** for better performance
6. **Implement proper loading states**

### Accessibility Guidelines

1. **Ensure 4.5:1 color contrast ratio**
2. **Provide alternative text for images**
3. **Use proper heading hierarchy**
4. **Implement keyboard navigation**
5. **Test with screen readers**
6. **Use semantic HTML elements**
7. **Provide clear error messages**

## 🔄 Migration Guide

### Updating Existing Components

```tsx
// Before: Fixed sizing
<div className="p-4 text-lg">
  Content
</div>

// After: Responsive sizing
<div className="p-3 sm:p-4 lg:p-6 xl:p-8 text-sm sm:text-base lg:text-lg xl:text-xl">
  Content
</div>

// Or using utility classes
<div className="padding-responsive text-responsive-base">
  Content
</div>

// Or using components
<ResponsiveContainer padding="md">
  <ResponsiveText size="base">
    Content
  </ResponsiveText>
</ResponsiveContainer>
```

## 📈 Future Roadmap

### Planned Enhancements

1. **Container Queries**: When browser support improves
2. **Advanced Animations**: Framer Motion integration
3. **Micro-interactions**: Enhanced user feedback
4. **Advanced Theming**: Dynamic color generation
5. **Component Variants**: More design variations
6. **Internationalization**: RTL language support

---

_This component library is continuously evolving. For the latest updates and examples, refer to the Storybook documentation and component source code._
