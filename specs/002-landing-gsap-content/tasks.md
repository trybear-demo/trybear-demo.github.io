# Tasks: Update Landing Text and Add GSAP Animations

**Feature**: `002-landing-gsap-content`
**Status**: In Progress
**Feature Spec**: [specs/002-landing-gsap-content/spec.md](../specs/002-landing-gsap-content/spec.md)

## Phase 1: Setup

- [x] T001 Install GSAP dependency if not present
- [x] T002 Define theme CSS variables (bg, text, accent) in `src/index.css`
- [x] T003 Extend Tailwind config with brand colors in `tailwind.config.js`

## Phase 2: Foundational Components

- [x] T004 Create `src/components/LandingContent.jsx` with initial boilerplate
- [x] T005 Implement text splitting helper function in `src/components/LandingContent.jsx` (or a utils file) for word-by-word animation

## Phase 3: User Story 1 - View Landing Page Animations

- [x] T006 [US1] Update `src/components/LandingContent.jsx` with the final Persian text structure
- [x] T007 [US1] Implement GSAP staggered fade-in animation for text in `src/components/LandingContent.jsx`
- [x] T008 [US1] Update `src/components/MenuBar.jsx` to include GSAP fade-in on load
- [x] T009 [US1] Integrate `LandingContent` into `src/App.jsx` replacing old content

## Phase 4: User Story 2 - Interact with Highlighted Keywords (DEPRECATED)

- [x] T010 [US2] Identify and wrap "هوش مصنوعی" phrases in `src/components/LandingContent.jsx` with interactive spans
- [x] T011 [US2] Implement GSAP mouseEnter/mouseLeave hover effects (glow/shadow) in `src/components/LandingContent.jsx`

## Phase 5: User Story 3 - Read Updated Content & Polish

- [x] T012 [US3] Verify text accuracy against spec in `src/components/LandingContent.jsx`
- [x] T013 [US3] Add `aria-label` to split text containers for accessibility in `src/components/LandingContent.jsx`
- [x] T014 [US3] Verify responsive behavior (line wrapping) of animated text

## Phase 6: Refinements (New)

- [x] T015 [Polish] Update `src/index.css` or `src/components/IntroSequence.jsx` to match background color exactly (fix flickering)
- [x] T016 [Polish] Update `src/components/LandingContent.jsx` to group "هوش مصنوعی" in a single interactive container for unified hover effect
- [x] T017 [Polish] Adjust typography sizes in `src/components/LandingContent.jsx` for a more minimal look (reduce font sizes)

## Phase 7: Content Revision (New)

- [x] T018 [Revision] Update `src/components/LandingContent.jsx` with the new text copy ("اینجا جاییه که...")
- [x] T019 [Revision] Remove keyword hover effects logic in `src/components/LandingContent.jsx` (keep "هوش مصنوعی" plain)
