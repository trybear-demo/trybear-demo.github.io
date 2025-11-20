# Data Model: Implement GSAP Menu Overlay

## Components

### MenuOverlay

**Type**: UI Component (React)

**Props**:
- `isOpen` (boolean): Controls the visibility state of the overlay.
- `onClose` (function): Callback to close the overlay.

**Internal State**:
- None (Animation state managed via GSAP context).

**Children**:
- Close Button (triggers `onClose`).
- Navigation Links (Array of objects).

**Navigation Link Data Structure**:
```javascript
[
  { label: "صفحه اصلی", href: "#home" },
  { label: "محصولات", href: "#products" },
  { label: "درباره ما", href: "#about" },
  { label: "تماس با ما", href: "#contact" }
]
```

### MenuBar (Update)

**Props**:
- `visible` (boolean): Existing prop.
- `onClick` (function): New prop to trigger the menu opening.

**Events**:
- `onClick`: Fires when the user clicks the menu icon.

## State Management

**Location**: `App.jsx` (Parent Component)

**State**:
- `isMenuOpen` (boolean): Default `false`.

**Flow**:
1. User clicks `MenuBar` -> calls `onClick` -> sets `isMenuOpen` to `true`.
2. `MenuOverlay` receives `isOpen=true` -> Animate In.
3. User clicks `Close Button` in `MenuOverlay` -> calls `onClose` -> sets `isMenuOpen` to `false`.
4. `MenuOverlay` receives `isOpen=false` -> Animate Out.

