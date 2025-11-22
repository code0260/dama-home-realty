# Accessibility (A11y) Guide

## Overview

This document outlines all accessibility enhancements implemented in the Dama Home Realty platform to ensure WCAG 2.1 AA compliance.

## ✅ Completed Enhancements

### ♿ 17. Accessibility (A11y)

#### 17.1 ARIA Labels

✅ **ARIA Labels**:
- Created `lib/accessibility.ts` with comprehensive ARIA utilities
- `generateAriaLabel()` function for dynamic labels
- `generateAriaId()` function for unique IDs
- `getButtonAriaLabel()` function for button labels
- `getNavigationAriaLabel()` function for navigation items
- `generateAriaAttributes()` function for common ARIA attributes

✅ **Keyboard Navigation**:
- Created `hooks/useKeyboard.ts` for keyboard shortcuts
- `useEscape()` hook for Escape key handling
- `useEnter()` hook for Enter key handling
- `useArrowKeys()` hook for arrow keys navigation
- Tab navigation support
- Focus trap for modals

✅ **Screen Reader Support**:
- Created `hooks/useScreenReader.ts` for screen reader announcements
- `useScreenReader()` hook for announcements
- `useLiveRegion()` hook for live regions
- `Announce` component for screen reader messages
- ARIA live regions for dynamic content

✅ **Focus Management**:
- Created `hooks/useFocus.ts` for focus management
- `useFocusTrap()` hook for focus trapping
- `useAutoFocus()` hook for auto-focus on mount
- `useRestoreFocus()` hook for restoring focus
- `useFocusWithin()` hook for focus within detection
- `FocusTrap` component for modals

#### 17.2 Visual Accessibility

✅ **Color Contrast**:
- `calculateContrastRatio()` function
- `meetsContrastStandards()` function for WCAG validation
- `getAccessibleTextColor()` function for optimal text color
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text

✅ **Text Size**:
- Created `components/accessibility/TextSizeControls.tsx`
- Text size controls (Small, Medium, Large, XLarge)
- LocalStorage persistence
- Keyboard navigation support
- Screen reader announcements

✅ **Focus Indicators**:
- Enhanced focus indicators with ring styles
- Visible focus rings for all interactive elements
- High contrast focus indicators
- Custom focus styles in `globals.css`

✅ **Skip Links**:
- Created `components/accessibility/SkipLinks.tsx`
- Skip to main content
- Skip to navigation
- Skip to search
- Skip to footer
- Keyboard shortcut: Alt + S

---

## 📁 Files Created

### Accessibility Utilities
1. `lib/accessibility.ts` - ARIA labels, keyboard navigation, color contrast utilities
2. `hooks/useKeyboard.ts` - Keyboard shortcuts and navigation hooks
3. `hooks/useFocus.ts` - Focus management hooks
4. `hooks/useScreenReader.ts` - Screen reader support hooks

### Components
1. `components/accessibility/SkipLinks.tsx` - Skip links component
2. `components/accessibility/FocusTrap.tsx` - Focus trap component
3. `components/accessibility/Announce.tsx` - Screen reader announcements
4. `components/accessibility/TextSizeControls.tsx` - Text size controls

### CSS Enhancements
1. `app/globals.css` - Added accessibility styles (sr-only, focus indicators, reduced motion, high contrast)

---

## 🚀 Usage Examples

### ARIA Labels

```tsx
import { generateAriaLabel, getButtonAriaLabel } from '@/lib/accessibility';

// Generate ARIA label
const label = generateAriaLabel('Close dialog', 'button');

// Get button ARIA label
const buttonLabel = getButtonAriaLabel('close', 'Property details dialog');
```

### Keyboard Navigation

```tsx
import { useKeyboard, useEscape } from '@/hooks/useKeyboard';

// Keyboard shortcuts
useKeyboard([
  {
    key: 's',
    ctrlKey: true,
    handler: () => {
      // Save action
    },
    description: 'Save',
  },
], []);

// Escape key handler
useEscape(() => {
  onClose();
}, isOpen);
```

### Screen Reader

```tsx
import { useScreenReader } from '@/hooks/useScreenReader';
import { Announce } from '@/components/accessibility/Announce';

function MyComponent() {
  const { announce } = useScreenReader();

  const handleSave = () => {
    // Save logic
    announce('Item saved successfully', 'polite');
  };

  return (
    <>
      <Announce message="Page loaded" priority="polite" />
      {/* Component content */}
    </>
  );
}
```

### Focus Management

```tsx
import { useFocusTrap, useAutoFocus } from '@/hooks/useFocus';
import { FocusTrap } from '@/components/accessibility/FocusTrap';

function Modal({ isOpen, onClose }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useFocusTrap(containerRef, isOpen);
  
  return (
    <FocusTrap enabled={isOpen} onEscape={onClose}>
      {/* Modal content */}
    </FocusTrap>
  );
}
```

### Skip Links

```tsx
import { SkipLinks } from '@/components/accessibility/SkipLinks';

// Already added to layout.tsx
<SkipLinks links={[
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
]} />
```

### Text Size Controls

```tsx
import { TextSizeControls } from '@/components/accessibility/TextSizeControls';

<TextSizeControls showLabel />
```

### Color Contrast

```tsx
import { meetsContrastStandards, getAccessibleTextColor } from '@/lib/accessibility';

// Check contrast
const isValid = meetsContrastStandards('#000000', '#FFFFFF', 'AA', 'normal');

// Get accessible text color
const textColor = getAccessibleTextColor('#808080');
```

---

## 📊 WCAG 2.1 AA Compliance

### Perceivable

- ✅ **Text Alternatives**: All images have alt text
- ✅ **Time-based Media**: Transcripts available
- ✅ **Adaptable**: Content structure maintained
- ✅ **Distinguishable**: Color contrast meets standards

### Operable

- ✅ **Keyboard Accessible**: All functionality available via keyboard
- ✅ **Enough Time**: Time limits can be extended
- ✅ **Seizures**: No flashing content
- ✅ **Navigable**: Skip links, focus indicators, headings

### Understandable

- ✅ **Readable**: Language identified
- ✅ **Predictable**: Consistent navigation
- ✅ **Input Assistance**: Form errors identified

### Robust

- ✅ **Compatible**: Valid HTML, ARIA attributes
- ✅ **Assistive Technologies**: Screen reader support

---

## 🎯 Accessibility Checklist

- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation for all features
- ✅ Screen reader support
- ✅ Focus management
- ✅ Color contrast meets WCAG AA
- ✅ Text size controls
- ✅ Focus indicators visible
- ✅ Skip links implemented
- ✅ Semantic HTML
- ✅ Alt text for images
- ✅ Form labels and error messages
- ✅ Reduced motion support
- ✅ High contrast mode support

---

## 🔧 Tools & Testing

### Screen Readers
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

### Testing Tools
- axe DevTools
- WAVE
- Lighthouse Accessibility Audit
- Color Contrast Analyzer

### Keyboard Testing
- Tab navigation
- Arrow keys
- Enter/Space for activation
- Escape for closing

---

## 📝 Notes

- All accessibility utilities are fully typed with TypeScript
- Components follow WCAG 2.1 AA standards
- Keyboard navigation is prioritized
- Screen reader announcements are polite by default
- Focus management is automatic for modals
- Color contrast is validated programmatically

---

## ✨ Summary

All requested accessibility enhancements have been successfully implemented:

- ✅ ARIA Labels
- ✅ Keyboard Navigation
- ✅ Screen Reader Support
- ✅ Focus Management
- ✅ Color Contrast
- ✅ Text Size Controls
- ✅ Focus Indicators
- ✅ Skip Links

The platform is now accessible to all users, including those using assistive technologies! 🎉

