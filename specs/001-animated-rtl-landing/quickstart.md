# Quickstart: Animated RTL Landing

**Feature**: Animated RTL Landing & Menu
**Branch**: `001-animated-rtl-landing`

## Setup & Run

1. **Install Dependencies**:
   ```bash
   npm install gsap
   # (Tailwind and React are already installed per project)
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Verify Implementation**:
   - Open `http://localhost:5173` (or provided port).
   - **Check 1**: "TryBear" text appears in "Abril Fatface" font.
   - **Check 2**: Text fades out after ~1.5s.
   - **Check 3**: Menu lines appear top-right.
   - **Check 4**: Hover menu lines -> see magnetic/elastic effect.

## Usage Example (Code Snippet)

```jsx
// App.jsx integration idea
import { useState } from 'react';
import IntroSequence from './components/IntroSequence';
import MenuBar from './components/MenuBar';

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-white text-black">
       {!introDone && <IntroSequence onComplete={() => setIntroDone(true)} />}
       <MenuBar visible={introDone} />
       {/* Main Content */}
    </div>
  );
}
```

