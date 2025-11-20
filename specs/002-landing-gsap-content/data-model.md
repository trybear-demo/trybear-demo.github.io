# Data Model: Landing Page Content

**Feature**: `002-landing-gsap-content`

## Entities

### LandingContent

*Representation of the mission statement structure.*

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `headline` | `string` | The main headline text | Not empty |
| `bodyParagraphs` | `string[]` | Array of paragraph texts | Min 2 items |
| `highlightKeywords` | `string[]` | Words to be highlighted/animated | e.g., "هوش مصنوعی" |

### ThemeConfig

*Representation of the active color theme.*

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `backgroundColor` | `hex/rgb` | Main background | Dark Slate/Black |
| `textColor` | `hex/rgb` | Main body text | White |
| `accentColor` | `hex/rgb` | Brand accent for highlights | Neon Purple/Cyan |

## State Transitions

- **Page Load** -> **Animating Entry** (Menu fade in, Text staggered reveal) -> **Idle** (Content visible, ready for interaction)
- **Idle** -> **Hover Keyword** -> **Glowing**
- **Glowing** -> **Mouse Leave** -> **Idle**

