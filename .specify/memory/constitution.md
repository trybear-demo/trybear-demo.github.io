<!-- Sync Impact Report
Version: 1.0.0 (Initial Ratification)
Modified Principles: N/A (New Constitution)
Added Sections: Core Principles (Animation, GSAP, Performance, Accessibility, Encapsulation), Tech Stack, Workflow
Templates Status:
  - .specify/templates/plan-template.md: ✅ (Contains Constitution Check)
  - .specify/templates/spec-template.md: ✅
  - .specify/templates/tasks-template.md: ✅
Follow-up TODOs: None
-->

# TryBear Constitution

<!-- Governance for the TryBear project, focusing on animation-driven UX. -->

## Core Principles

### I. Motion-First UX

Animations are a core requirement, not a progressive enhancement. Every user interaction (clicks, transitions, state changes) MUST be accompanied by fluid, meaningful motion feedback to guide the user.

### II. The GSAP Standard

All animations MUST be implemented using GSAP (GreenSock Animation Platform).

- **Rationale**: Ensures a unified animation API, high performance, and cross-browser compatibility.
- **Constraint**: Do not use CSS transitions or other libraries (e.g., Framer Motion) unless for simple hover states where GSAP is overkill, but prefer GSAP for consistency.

### III. Performance & Fluidity

Animations MUST NOT degrade application performance.

- **Target**: Maintain 60fps consistently.
- **Technique**: Animate cheap properties (`transform`, `opacity`) over layout-triggering properties (`width`, `height`, `top`, `left`). Use `will-change` sparingly.

### IV. Inclusive Motion

While motion is primary, accessibility is mandatory.

- **Constraint**: Respect the user's `prefers-reduced-motion` setting.
- **Requirement**: When reduced motion is requested, animations must be disabled or replaced with instant transitions/fades to avoid triggering motion sensitivity.

### V. Component-Co-located Logic

Animation logic MUST be encapsulated.

- **Pattern**: Use React hooks (`useGSAP` or `useEffect`) within components or custom hooks (e.g., `useEnterAnimation`).
- **Anti-Pattern**: Do not scatter animation imperative calls in global scopes.

## Technology Stack

<!-- Defined constraints for the project environment -->

### Core Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Animation Engine**: GSAP (v3+)
- **Language**: JavaScript/JSX (as seen in current files)

### Library Policy

- **New Libraries**: Must be justified against the "GSAP Standard". If a UI library includes its own animation engine, it must be configurable to use GSAP or be compatible with it.

## Development Workflow

<!-- Process for maintaining quality -->

### Code Review Standards

- **Motion Check**: PRs must include a description or recording of the animation behavior.
- **Performance Check**: Reviewers must flag animations that trigger layout thrashing (reflows).

### Testing Strategy

- **Visual Verification**: Animations are primarily verified visually during the `dev` cycle.
- **Logic Testing**: Complex animation sequences should have unit tests for their state triggers.

## Governance

<!-- Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

### Amendment Process

- Changes to this constitution (e.g., switching animation libraries) require a MAJOR version bump and team consensus.
- New principles can be added via MINOR version bumps.

### Compliance

- All Feature Plans (`/speckit.plan`) MUST pass a Constitution Check confirming alignment with the GSAP Standard and Performance First principles.

**Version**: 1.0.0 | **Ratified**: 2025-11-19 | **Last Amended**: 2025-11-19
