# Research: Landing Page Updates with GSAP

**Feature**: `002-landing-gsap-content`
**Status**: Phase 0 Complete

## Decisions & Rationale

### 1. Text Reveal Animation
**Decision**: Use `gsap.from()` with `stagger` on split words.
**Rationale**:
- **Technique**: Split text into spans (words). Use `gsap.from(words, { opacity: 0, y: 20, stagger: 0.05, ease: "power2.out" })`.
- **Performance**: Animating `opacity` and `transform` is performant (compositor-only).
- **Accessibility**: Ensure the container has `aria-label` with the full text, as screen readers might stutter on split spans. Use `aria-hidden="true"` on the animated spans if necessary, or rely on modern screen reader heuristics.
- **Alternatives**: `SplitText` plugin is paid (Club GreenSock). For this project, we will implement a simple custom string splitter helper function to wrap words in spans to stay within "standard" constraints without requiring paid plugins.

### 2. Neon Glow Hover Effect
**Decision**: Use GSAP to animate `text-shadow` and `color`.
**Rationale**:
- **Technique**: On hover, `gsap.to(target, { textShadow: "0 0 10px #a855f7, 0 0 20px #a855f7", color: "#ffffff", duration: 0.3 })`.
- **Theme**: Using the "Modern Dark AI" accent color (e.g., purple/cyan).
- **Accessibility**: Ensure color contrast ratios meet WCAG AA when not hovered. The glow is an enhancement, not the only indicator.
- **Reduced Motion**: Wrap animations in a check for `prefers-reduced-motion` or use `gsap.matchMedia()` to disable/simplify effects.

### 3. Theme Implementation
**Decision**: Use CSS Variables + Tailwind Config.
**Rationale**:
- **Structure**: Define `--color-bg`, `--color-text`, `--color-accent` in `index.css`.
- **Tailwind**: Extend `tailwind.config.js` to use these variables (e.g., `colors: { brand: { bg: 'var(--color-bg)', ... } }`).
- **Maintenance**: Centralizes theme control.

## Unknowns Resolved

- **GSAP Text Split**: Will use manual splitting logic (Space delimiter) to avoid paid plugin dependency.
- **RTL Support**: Standard CSS `direction: rtl` works with `text-align`. GSAP animations on `y` or `opacity` are direction-agnostic.

