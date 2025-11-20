# Research: GSAP Theme & Language Toggles

## 1. GSAP Text Animation Strategy

**Question**: Can we use GSAP's `ScrambleTextPlugin` for the "scramble/morph" effect requested?
**Finding**: `ScrambleTextPlugin` is a "Club GSAP" (paid) feature. `TextPlugin` is free but only handles simple text replacement (typing effect).
**Decision**: Implement a **custom scramble effect** using vanilla JS + GSAP.
**Rationale**: Avoids paid dependency. We can achieve a similar "hacker text" scramble effect by rapidly updating the text content with random characters before settling on the final text, driven by a GSAP timeline.

## 2. Tailwind CSS v4 RTL Support

**Question**: How to handle RTL/LTR switching dynamically in Tailwind v4?
**Finding**: Tailwind uses CSS logical properties (e.g., `start`, `end` instead of `left`, `right`) and `rtl:` / `ltr:` variants. It relies on the `dir` attribute of the root element.
**Decision**: Update the `dir` attribute of the `<html>` tag in `LanguageContext`. Use Tailwind logical properties (e.g., `ms-4` for margin-start) where possible, or `rtl:ml-0` overrides if needed.
**Rationale**: Native web standard compliance and full Tailwind compatibility.

## 3. Theme Implementation

**Question**: How to animate theme colors with GSAP?
**Decision**: Use CSS Variables (Custom Properties) for colors (e.g., `--bg-color`, `--text-color`).
**Mechanism**:
1. Define light/dark values for these variables.
2. On toggle, use GSAP to tween the values of these CSS variables on the `:root` or `body` element.
   ```javascript
   gsap.to("html", {
     "--bg-color": isDark ? "#ffffff" : "#000000",
     duration: 0.5
   });
   ```
**Rationale**: Performance. Animating CSS variables is often smoother than animating properties on every single element, and it allows Tailwind to just use `bg-[var(--bg-color)]` without knowing about the animation.

## 4. Icons

**Decision**: Use `lucide-react` or inline SVGs for Sun, Moon, Globe (or generic language icon).
**Rationale**: Minimalist, lightweight, and commonly used in React ecosystem.

