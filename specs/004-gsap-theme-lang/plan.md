# Implementation Plan: GSAP Theme & Language Toggles

**Branch**: `004-gsap-theme-lang` | **Date**: 2025-11-19 | **Spec**: [specs/004-gsap-theme-lang/spec.md](../spec.md)
**Input**: Feature specification from `/specs/004-gsap-theme-lang/spec.md`

## Summary

Implement a global Theme (Light/Dark) and Language (English/Persian) toggle system using React Context API. The system will persist user preferences to `localStorage`, default to Dark Mode and Persian (RTL) for new users, and use GSAP for smooth color transitions and text scrambling effects during language switches.

## Technical Context

**Language/Version**: JavaScript (ES6+), React 19.1.1 (Vite)
**Primary Dependencies**: `gsap` ^3.13.0, `@gsap/react` ^2.1.2, `tailwindcss` ^4.1.16
**Storage**: `localStorage` (for user preferences)
**Testing**: Manual validation (no automated test suite configured)
**Target Platform**: Modern Web Browsers (Mobile/Desktop)
**Project Type**: Single Page Application (React/Vite)
**Performance Goals**: Animations < 1s, 60fps.
**Constraints**: Minimalist design (icons only), RTL/LTR support.
**Scale/Scope**: Global state affecting all components.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Minimalism**: Feature adds visual complexity but is requested for accessibility/preference. Implementation must be "clean" and "minimal".
- **Performance**: GSAP is performant; logic must not block main thread.
- **No unnecessary dependencies**: Uses existing `gsap` and `react`. No new heavy libs.

## Project Structure

### Documentation (this feature)

```text
specs/004-gsap-theme-lang/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── ThemeToggle.jsx       # [NEW] Component for theme switching
│   ├── LanguageToggle.jsx    # [NEW] Component for language switching
│   └── ...
├── context/
│   ├── ThemeContext.jsx      # [NEW] Context for theme state
│   └── LanguageContext.jsx   # [NEW] Context for language state
├── App.jsx                   # [UPDATE] Wrap with Providers
└── index.css                 # [UPDATE] Add CSS variables/classes for themes
```

**Structure Decision**: Adding new contexts to `src/context/` and new components to `src/components/` follows the existing flat structure.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Context API | Global state for theme/lang | Prop drilling is unmanageable for app-wide styling/text. |
