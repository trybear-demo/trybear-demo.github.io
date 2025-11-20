# Research: Implement GSAP Menu Overlay

## Decision Log

### 1. Animation Strategy
- **Decision**: Use `useGSAP` hook from `@gsap/react`.
- **Rationale**: The `@gsap/react` package is already installed and `useGSAP` provides automatic cleanup (reverting context) which is safer than manual `useEffect` cleanup, especially for React 18+ strict mode.
- **Alternatives**: `useEffect` (used in `CustomCursor.jsx`) - acceptable but `useGSAP` is more robust for animations.

### 2. Overlay Implementation
- **Decision**: Full-screen fixed `div` with high z-index (`z-50` or similar in Tailwind).
- **Animation**: `yPercent: -100` (hidden top) to `yPercent: 0` (visible).
- **Rationale**: Performance-friendly (transform only), simple to implement.
- **Alternatives**: `height: 0` to `height: 100%` (causes layout thrashing, avoided per constitution).

### 3. Navigation Links Sequencing
- **Decision**: Use `gsap.timeline()` to sequence the overlay opening followed by staggered link entry.
- **Rationale**: Ensures the links only appear once the background is stable/visible, providing a polished feel.

### 4. State Management
- **Decision**: Local state in a parent component (e.g., `Navbar` or `Layout`) passed down, or a lightweight context if needed globally.
- **Rationale**: The menu state is UI-specific.

### 5. Accessibility (A11y)
- **Decision**:
    - Use `aria-modal="true"` and `role="dialog"` on the overlay.
    - Implement Focus Trap when open.
    - Support `Escape` key to close.
- **Rationale**: Mandatory for inclusive motion and usability.

## Technical implementation details

- **Trigger**: A simple button with an icon (hamburger).
- **Close**: A button with an "X" icon.
- **GSAP Config**:
    - `ease: "power4.inOut"` for a premium feel.
    - `duration: 1` to `1.2` seconds for the full sequence.

