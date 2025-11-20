# Quickstart: Landing Page Updates

**Feature**: `002-landing-gsap-content`

## Overview

This feature updates the landing page with new Persian content, a dark AI-themed aesthetic, and GSAP animations.

## Usage

### 1. Setup Theme
Ensure `tailwind.config.js` is configured with the new brand colors.

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      brand: {
        bg: '#0f172a', // Slate 900
        text: '#f8fafc', // Slate 50
        accent: '#a855f7', // Purple 500
      }
    }
  }
}
```

### 2. Component Usage
Import and use the `LandingContent` component in your main App or layout.

```jsx
import LandingContent from './components/LandingContent';

function App() {
  return (
    <main className="bg-brand-bg text-brand-text min-h-screen" dir="rtl">
      <LandingContent />
    </main>
  );
}
```

## Troubleshooting

- **Text not animating?**: Check console for GSAP errors. Ensure `gsap` is installed.
- **Wrong colors?**: Verify Tailwind config and that you are using the `bg-brand-bg` classes.
- **RTL issues?**: Ensure the root element or container has `dir="rtl"`.

