# Design System Documentation

## Overview

This document describes the design system for Dama Home Realty, including design tokens, components, and usage guidelines.

## Design Tokens

### Colors

#### Primary (Deep Navy Blue)

-   **Default**: `#0F172A`
-   **Usage**: Main brand color for headings, primary actions, and key UI elements
-   **Shades**: Available from 50 (lightest) to 950 (darkest)

#### Secondary (Bronze/Gold)

-   **Default**: `#B49162`
-   **Usage**: Accent color for CTAs, highlights, and premium features
-   **Light Variant**: `#D4AF37` for gradients

#### Background

-   **Light**: `#F8F9FA` (Very light off-white/cream)
-   **Dark**: `#020617` (Deep Navy for dark mode)

### Typography

#### Font Families

-   **Sans (LTR)**: Inter
-   **Arabic (RTL)**: Cairo
-   **Mono**: Geist Mono

#### Font Sizes

-   **xs**: 12px
-   **sm**: 14px
-   **base**: 16px
-   **lg**: 18px
-   **xl**: 20px
-   **2xl**: 24px
-   **3xl**: 30px
-   **4xl**: 36px
-   **5xl**: 48px
-   **6xl**: 60px

#### Font Weights

-   **Light**: 300
-   **Normal**: 400
-   **Medium**: 500
-   **Semibold**: 600
-   **Bold**: 700

### Spacing

Uses a 4px base unit system:

-   **1**: 4px
-   **2**: 8px
-   **3**: 12px
-   **4**: 16px
-   **6**: 24px
-   **8**: 32px
-   **12**: 48px
-   **16**: 64px

### Shadows

-   **sm**: Subtle shadow for cards
-   **md**: Medium shadow for elevated elements
-   **lg**: Large shadow for modals
-   **xl**: Extra large shadow for overlays
-   **glow**: Custom glow effects for buttons

### Border Radius

-   **sm**: 2px
-   **DEFAULT**: 6px
-   **md**: 8px
-   **lg**: 12px
-   **xl**: 16px
-   **2xl**: 24px
-   **full**: 9999px (for pills/circles)

## Components

### Buttons

#### Primary Button

```tsx
<Button className="bg-primary hover:bg-primary/90 text-white">
    Primary Action
</Button>
```

#### Secondary Button (Bronze)

```tsx
<Button className="bg-secondary hover:bg-secondary/90 text-white btn-secondary-glow">
    Secondary Action
</Button>
```

### Cards

All cards use:

-   Rounded corners (`rounded-xl`)
-   Soft shadows
-   Hover effects with scale and shadow increase
-   Dark mode support

### Loading States

#### Spinner

```tsx
<LoadingSpinner size="md" variant="secondary" />
```

#### Skeleton

```tsx
<LoadingSkeleton variant="rectangular" width="100%" height="200px" />
```

#### Progress Bar

```tsx
<LoadingProgress value={50} max={100} showLabel />
```

### Success States

#### Toast Notification

```tsx
<SuccessToast
    message="Success!"
    description="Your action was completed successfully"
    variant="success"
    duration={3000}
/>
```

#### Success Icon

```tsx
<SuccessIcon size="lg" animated />
```

## Micro-interactions

### Button Hover

-   Scale: 1.02
-   Glow effect for secondary buttons
-   Smooth transition (300ms)

### Card Hover

-   Scale: 1.02
-   Y translation: -4px
-   Shadow increase
-   Smooth transition (300ms)

### Image Hover

-   Scale: 1.05
-   Smooth zoom effect (400ms)

## Animations

### Page Transitions

-   Fade in with slight Y translation
-   Duration: 400ms
-   Easing: cubic-bezier(0.4, 0, 0.2, 1)

### List Animations

-   Stagger children by 100ms
-   Fade in with Y translation

### Success Animations

-   Scale from 0 to 1.2 to 1
-   Duration: 500ms

## Performance Guidelines

### Images

-   Always use Next.js Image component
-   Provide proper sizes attribute
-   Use WebP format when possible
-   Implement lazy loading
-   Add blur placeholders

### Code Splitting

-   Use dynamic imports for heavy components
-   Lazy load routes
-   Split vendor chunks

### Core Web Vitals Targets

-   **LCP**: < 2.5s
-   **FID**: < 100ms
-   **CLS**: < 0.1
-   **TTFB**: < 600ms

## Accessibility

-   All interactive elements have focus states
-   Proper ARIA labels
-   Keyboard navigation support
-   Color contrast ratios meet WCAG AA standards

## Dark Mode

-   Automatic detection of system preference
-   Manual toggle available
-   All components support dark mode
-   Uses Deep Navy (#020617) as dark background
