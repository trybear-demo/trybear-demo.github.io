# Data Model & Component State

**Feature**: Animated RTL Landing & Menu

## Entities / Components

### 1. IntroSequence (Component)
**Purpose**: Controls the initial "TryBear" text presentation and exit.

| Property | Type | Description |
|----------|------|-------------|
| `isVisible` | `boolean` | Internal state. True on mount, false after timer/transition. |
| `onComplete` | `function` | Callback prop. Fired when exit animation finishes. |
| `duration` | `number` | (Const) Duration of hold time (e.g., 1.5s). |

**States**:
- `MOUNTED`: Text visible (opacity 1).
- `EXITING`: Text fading (opacity 1 -> 0).
- `COMPLETED`: Component unmounts or returns null.

### 2. MenuBar (Component)
**Purpose**: Displays the menu button and handles magnetic hover effects.

| Property | Type | Description |
|----------|------|-------------|
| `visible` | `boolean` | Prop. Controls initial fade-in entry. |
| `isHovered` | `boolean` | Internal ref/state (GSAP managed). |

**GSAP Context**:
- `x`, `y`: Magnetic offset values.
- `scaleX`: Elastic width stretch factor.

## Global State
- `appReady`: `boolean` (in App.jsx). False initially, True after IntroSequence `onComplete`.

## Validation Rules
- `IntroSequence` must fire `onComplete` exactly once.
- `MenuBar` must not attach event listeners if `prefers-reduced-motion` is true (optional optimization).

