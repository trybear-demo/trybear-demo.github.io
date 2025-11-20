# Implementation Plan: Animated RTL Landing & Menu

**Branch**: `001-animated-rtl-landing` | **Date**: 2025-11-19 | **Spec**: [specs/001-animated-rtl-landing/spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-animated-rtl-landing/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a high-impact landing intro sequence and interactive menu bar for a React-based web application. The feature includes a "TryBear" intro text fade-out transition and a magnetic elastic hover animation for the menu button, strictly utilizing GSAP for motion and standardizing on an RTL layout.

## Technical Context

**Language/Version**: JavaScript/JSX (React)
**Primary Dependencies**: React 18+, GSAP v3, Tailwind CSS
**Storage**: N/A (Frontend only state)
**Testing**: Manual Visual Verification (per Constitution), optional Unit Tests for logic
**Target Platform**: Web (Modern Browsers)
**Project Type**: Single Page Application (Web)
**Performance Goals**: 60fps animations, <200ms perceived load time
**Constraints**: Must respect `prefers-reduced-motion`, strict GSAP usage
**Scale/Scope**: Single landing page component set

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **I. Motion-First UX**: Animations are central to this feature (Intro + Menu).
- [x] **II. The GSAP Standard**: All animations will use GSAP (`useGSAP` hook).
- [x] **III. Performance & Fluidity**: Animations target transforms/opacity; magnetic effect needs careful performant implementation.
- [x] **IV. Inclusive Motion**: `prefers-reduced-motion` is explicitly handled in requirements.
- [x] **V. Component-Co-located Logic**: Animation logic will reside in `IntroSequence` and `MenuBar` components.

## Project Structure

### Documentation (this feature)

```text
specs/001-animated-rtl-landing/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── IntroSequence.jsx      # New component: Manages intro text & state
│   ├── MenuBar.jsx            # New component: The animated menu button
│   └── Layout.jsx             # (Optional) Wrapper for RTL & main structure
├── App.jsx                    # Update: Integration point
└── index.css                  # Update: Font imports (Abril Fatface)
```

**Structure Decision**: Single project structure. Components are co-located in `src/components/` to keep simple architecture.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       |            |                                      |
