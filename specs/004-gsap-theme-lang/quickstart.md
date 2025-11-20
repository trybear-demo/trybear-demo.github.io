# Quickstart: Theme & Language

## Usage

### Consuming Theme

```jsx
import { useTheme } from '../context/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Current Theme: {theme}
    </button>
  );
};
```

### Consuming Language

```jsx
import { useLanguage } from '../context/LanguageContext';

const MyComponent = () => {
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <div dir={language === 'fa' ? 'rtl' : 'ltr'}>
      <h1>{t('welcome_message')}</h1>
      <button onClick={toggleLanguage}>
        Switch Lang
      </button>
    </div>
  );
};
```

### CSS Variables

The theme system uses CSS variables defined in `index.css`. Use them in Tailwind configuration or arbitrary CSS:

```css
:root {
  /* Default (Dark) */
  --bg-color: #000000;
  --text-color: #ffffff;
}
```

Tailwind usage: `bg-[var(--bg-color)]` or configured theme colors.

