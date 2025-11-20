# Feature Specification: Animated RTL Landing & Menu

**Feature Branch**: `001-animated-rtl-landing`
**Created**: 2025-11-19
**Status**: Draft
**Input**: User description: "من میخوام راست چین باشه صفحم. بالا سمت راست دوتا خط باشه که نشانگر دکمه منوبار هستش! همچنین میخوام وقتی کرسرم رفت روی این منوبار یه انیمیشن خیلی جذاب بگیره! همچنین وقتی صفحه بالا اومد یه متن اول نمایش بده با یه فونت انگلیسی جذاب. متنه این باشه: TryBear. بعد از یک یا دو ثانیه منوبار نمایش داده بشه."

## Clarifications

### Session 2025-11-19

- Q: Intro text transition style? → A: **Fade Out** (Text smoothly fades to opacity 0 and is removed, revealing the main UI).
- Q: Menu hover animation style? → A: **Magnetic Elasticity** (Lines slightly follow the cursor and stretch/scale width-wise when hovered).
- Q: Intro text font selection? → A: **Abril Fatface** (Bold, high-contrast serif; modern and premium).

## User Scenarios & Testing

### User Story 1 - Landing Intro Experience (Priority: P1)

As a visitor, I want to be greeted with an engaging introduction so that I feel welcomed and impressed by the brand before seeing the main controls.

**Why this priority**: Sets the first impression and creates the "premium" feel requested.

**Independent Test**: Refresh the page; verify "TryBear" appears immediately, stays for ~1-2s, then fades out as the Menu Bar appears.

**Acceptance Scenarios**:

1. **Given** the user loads the page, **When** the page renders, **Then** the text "TryBear" is the only visible element, centered or prominent, using the **Abril Fatface** font.
2. **Given** the intro text has been visible for 1.5 seconds, **When** the timer expires, **Then** the text **smoothly fades out** to opacity 0 over ~0.5s, and the Menu Bar element fades in or animates into view at the top right.
3. **Given** the intro sequence is active, **When** the user waits, **Then** the layout direction is initialized as RTL (Right-to-Left).

---

### User Story 2 - Menu Bar Interaction (Priority: P2)

As a visitor, I want visual feedback when interacting with the menu button so that I know it's interactive and feel the application's responsiveness.

**Why this priority**: Core navigation element requested by the user; "delight" factor.

**Independent Test**: Hover over the top-right menu icon; observe the specific GSAP animation.

**Acceptance Scenarios**:

1. **Given** the Menu Bar is visible, **When** the cursor hovers over the two lines, **Then** the lines exhibit a **magnetic elastic effect**, slightly tracking the cursor position and stretching/scaling width-wise.
2. **Given** the cursor leaves the Menu Bar area, **When** hover ends, **Then** the animation reverses or returns to the idle state smoothly.
3. **Given** the page structure, **When** inspected, **Then** the Menu Bar consists of exactly two horizontal lines positioned at the top right.

### Edge Cases

- **Reduced Motion**: If the user has `prefers-reduced-motion: reduce` enabled, the intro text MUST appear instantly (no fade/slide) and the Menu Bar MUST appear instantly after the text without motion.
- **Font Loading Failure**: If the specialized English font fails to load within 500ms, the text MUST display using a fallback sans-serif font to avoid invisible text (FOIT).
- **Mobile Viewport**: The "Two Lines" menu MUST remain visible and correctly positioned at the top-right on small screens, ensuring it does not overlap with the "TryBear" text if they coexist.

## Requirements

### Functional Requirements

- **FR-001**: The page document direction MUST be set to RTL (`dir="rtl"`).
- **FR-002**: A Menu Bar component MUST be positioned in the top-right corner of the viewport.
- **FR-003**: The Menu Bar MUST consist visually of two parallel lines.
- **FR-004**: Upon initial page load, the text "TryBear" MUST be displayed.
- **FR-005**: The "TryBear" text MUST use the **Abril Fatface** font (via Google Fonts).
- **FR-006**: The Menu Bar MUST be hidden initially and appear automatically after a 1-2 second delay following the intro text appearance.
- **FR-007**: Hovering the Menu Bar MUST trigger a **magnetic elastic** GSAP animation (tracking cursor + width scaling).
- **FR-008**: All animations MUST respect the `prefers-reduced-motion` media query (per Constitution).

### Key Entities

- **IntroSequence**: Manages the state timeline (Start -> Text Visible -> Text Fade Out -> Menu Enter).
- **MenuBar**: The visual component containing the two lines and hover logic.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Time from page load to "TryBear" visibility is < 200ms (perceived instant).
- **SC-002**: Intro sequence total duration is between 1.5s and 2.5s.
- **SC-003**: Menu bar hover animation maintains 60fps on standard devices.
- **SC-004**: Lighthouse/Performance score for "Cumulative Layout Shift" remains < 0.1 during the intro sequence.

## Assumptions

- The "two lines" menu icon serves as a standard toggle button (functionality beyond animation is out of scope for this specific visual story, but the button itself must exist).
- "Right-aligned page" implies the global layout direction is RTL, placing the menu naturally at the top-start (right).
- The "TryBear" text hides or moves aside after the intro to reveal the main content (or the page remains minimal). For this spec, we focus on the _appearance_ of the menu after the text.
