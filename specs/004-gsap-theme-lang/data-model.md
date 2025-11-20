# Data Model: GSAP Theme & Language Toggles

## Entities

### UserPreference

Persisted settings for the user. Stored in `localStorage` under key `app-preferences`.

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `theme` | `'light' \| 'dark'` | Visual theme preference | `'dark'` |
| `language` | `'en' \| 'fa'` | Language/Locale preference | `'fa'` |

### Context State

State held in React Contexts.

#### ThemeState
| Field | Type | Description |
|-------|------|-------------|
| `theme` | `'light' \| 'dark'` | Current active theme |
| `toggleTheme` | `() => void` | Function to switch themes |

#### LanguageState
| Field | Type | Description |
|-------|------|-------------|
| `language` | `'en' \| 'fa'` | Current active language |
| `toggleLanguage` | `() => void` | Function to switch language |
| `t` | `(key: string) => string` | Translation helper function |
| `dir` | `'ltr' \| 'rtl'` | Layout direction helper |

