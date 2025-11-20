# Research & Decisions: Animated RTL Landing

**Feature**: Animated RTL Landing & Menu
**Branch**: `001-animated-rtl-landing`

## Key Decisions

### 1. GSAP Magnetic Effect Implementation

- **Decision**: Use `mousemove` event listener on the button container with `gsap.to` (quick setter) for performant cursor tracking.
- **Rationale**: `gsap.quickTo` or simple `gsap.to` with overwrite 'auto' ensures high performance (60fps) without layout thrashing compared to pure CSS or heavy React state updates.
- **Alternatives Considered**:
  - _CSS Variables_: Less fluid, harder to implement "elasticity".
  - _React State_: Too slow (renders on every frame), causes jank.

### 2. Font Loading Strategy

- **Decision**: Use Google Fonts via standard `<link>` in `index.html` with `display: swap` (or block if critical) to ensure "Abril Fatface" loads.
- **Rationale**: Simplest integration with Vite/React.
- **Alternatives Considered**:
  - _npm package (@fontsource)_: Good, but CDN is faster for prototyping and caching is handled well by Google. (Constitution allows new libraries if justified, but standard CDN is zero-install).

### 3. State Management for Intro

- **Decision**: Simple local state (`useState`) in a parent component or `IntroSequence` that notifies parent via callback (`onComplete`) to show `MenuBar`.
- **Rationale**: No global store needed for a transient 1-time intro sequence. Keep it simple (KISS).

## Unknowns & Clarifications

- _Resolved_: Transition style (Fade Out), Menu Animation (Magnetic), Font (Abril Fatface) are all defined in Spec.
