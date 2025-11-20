---
description: "Task list for Animated RTL Landing feature"
---

# Tasks: Animated RTL Landing & Menu

**Input**: Design documents from `/specs/001-animated-rtl-landing/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md
**Tests**: Manual visual verification per Constitution (no unit tests requested).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: User Story ID (US1, US2)
- **Path**: src/ (Frontend)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize project dependencies and font assets.

- [x] T001 Install GSAP dependency in package.json
- [x] T002 [P] Add Google Fonts link for 'Abril Fatface' in index.html
- [x] T003 Configure global RTL support in src/index.css or html tag

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core layout and state management structure.

**⚠️ CRITICAL**: Complete before starting user stories.

- [x] T004 Create Layout component structure (if needed) or prepare App.jsx for RTL in src/App.jsx
- [x] T005 Define basic animation constants/config in src/lib/constants.js (optional, or inline)

**Checkpoint**: Project ready for RTL rendering and GSAP usage.

---

## Phase 3: User Story 1 - Landing Intro Experience (Priority: P1) 🎯 MVP

**Goal**: Display "TryBear" intro text in Abril Fatface, hold for 1.5s, then fade out to reveal main content.

**Independent Test**: Refresh page -> See Text -> Wait 1.5s -> Text Fades -> UI appears.

### Implementation for User Story 1

- [x] T006 [US1] Create IntroSequence component skeleton in src/components/IntroSequence.jsx
- [x] T007 [US1] Implement "TryBear" text styling (Abril Fatface, centered) in src/components/IntroSequence.jsx
- [x] T008 [US1] Implement fade-out logic using GSAP and onComplete callback in src/components/IntroSequence.jsx
- [x] T009 [US1] Integrate IntroSequence into src/App.jsx with state handling
- [x] T010 [US1] Implement reduced-motion fallback for instant transition in src/components/IntroSequence.jsx

**Checkpoint**: Intro sequence works independently.

---

## Phase 4: User Story 2 - Menu Bar Interaction (Priority: P2)

**Goal**: Show Menu Bar after intro, with magnetic elastic hover effect.

**Independent Test**: Intro finishes -> Menu appears. Hover menu -> Lines stretch/move magnetically.

### Implementation for User Story 2

- [x] T011 [US2] Create MenuBar component structure in src/components/MenuBar.jsx
- [x] T012 [US2] Implement visual styling (two lines, top-right position) in src/components/MenuBar.jsx
- [x] T013 [US2] Implement initial fade-in animation (triggered by visible prop) in src/components/MenuBar.jsx
- [x] T014 [US2] Implement GSAP magnetic hover effect (mousemove listener + quickTo) in src/components/MenuBar.jsx
- [x] T015 [US2] Integrate MenuBar into src/App.jsx (show after intro completes)
- [x] T016 [US2] Add reduced-motion check to disable magnetic effect in src/components/MenuBar.jsx

**Checkpoint**: Menu Bar fully functional with animations.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final adjustments and verification.

- [x] T017 Verify RTL layout correctness across all components
- [x] T018 Run quickstart.md validation steps manually
- [x] T019 Code cleanup (remove unused CSS/imports)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup**: Starts immediately.
- **Foundational**: Blocks US1/US2.
- **US1**: Blocks US2 (logic dependency: menu appears _after_ intro).
- **US2**: Depends on US1 completion (sequential flow).

### Parallel Opportunities

- **Setup**: T001, T002, T003 can run in parallel.
- **Implementation**: T006 (Intro) and T011 (Menu Structure) can start in parallel if mocked state used.

## Implementation Strategy

### MVP First

1. Complete Setup (T001-T003) + Foundational (T004)
2. Build US1 (Intro) -> Verify "TryBear" fade out.
3. Build US2 (Menu) -> Verify appearance and magnetic hover.
