---
description: "Task list template for feature implementation"
---

# Tasks: Implement GSAP Menu Overlay

**Input**: Design documents from `/specs/003-gsap-menu-overlay/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Update `src/lib/constants.js` with `MENU_OVERLAY` animation configuration (duration, ease, stagger)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Create `src/components/MenuOverlay.jsx` component file with basic functional component structure and imports
- [x] T003 Update `src/App.jsx` to add `isMenuOpen` state (default false) and conditional rendering logic

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Open Menu Overlay (Priority: P1) 🎯 MVP

**Goal**: Overlay opens with animation when MenuBar is clicked.

**Independent Test**: Click the menu bar trigger and verify the overlay covers the screen with the specified animation.

### Implementation for User Story 1

- [x] T004 [US1] Implement `MenuOverlay` layout (fixed position, full screen, z-index 50, background color) in `src/components/MenuOverlay.jsx`
- [x] T005 [US1] Define navigation links array and render list structure in `src/components/MenuOverlay.jsx`
- [x] T006 [US1] Update `src/components/MenuBar.jsx` to accept `onClick` prop and attach it to the container div
- [x] T007 [US1] Update `src/App.jsx` to pass `onClick` handler (setting state to true) to `MenuBar` component
- [x] T008 [US1] Implement `useGSAP` opening animation (timeline: overlay slide down + links stagger fade in) in `src/components/MenuOverlay.jsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Close Menu Overlay (Priority: P1)

**Goal**: Overlay closes when X is clicked.

**Independent Test**: Open the menu, then click the close icon and verify the overlay disappears.

### Implementation for User Story 2

- [x] T009 [P] [US2] Add Close button element (X icon) to `src/components/MenuOverlay.jsx`
- [x] T010 [US2] Update `src/App.jsx` to pass `onClose` handler (setting state to false) to `MenuOverlay` component
- [x] T011 [US2] Implement `onClose` prop handling in `src/components/MenuOverlay.jsx` to trigger exit animation before state change (or use context revert)
- [x] T012 [US2] Implement exit animation (reverse of opening or fade out) in `src/components/MenuOverlay.jsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Menu Item Interaction (Priority: P2)

**Goal**: Links are interactive and accessible.

**Independent Test**: Click any link within the open menu and verify it is an interactive anchor element.

### Implementation for User Story 3

- [x] T013 [P] [US3] Add hover animations/styles to navigation links in `src/components/MenuOverlay.jsx`
- [x] T014 [P] [US3] Add `aria-modal="true"`, `role="dialog"`, and appropriate labels to `src/components/MenuOverlay.jsx`
- [x] T015 [US3] Implement `Escape` key event listener to trigger close action in `src/components/MenuOverlay.jsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T016 Implement `prefers-reduced-motion` check in `src/components/MenuOverlay.jsx` to disable/simplify animations
- [x] T017 Verify and clean up imports and unused variables in `src/components/MenuOverlay.jsx` and `src/App.jsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Enhances US1

### Within Each User Story

- Layout/Structure before Logic
- Logic before Animation
- Animation before Polish

### Parallel Opportunities

- T009 (Close Button) and T013 (Link Hover) can be done while T008 (Opening Animation) is being tuned.
- T014 (A11y attributes) can be added at any time after layout (T004).

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories
