interface ThemeContextType {
  /**
   * Current active theme.
   * Defaults to 'dark' for new users.
   */
  theme: 'light' | 'dark';

  /**
   * Toggles between 'light' and 'dark' modes.
   * Triggers GSAP animation on CSS variables.
   * Persists new value to localStorage.
   */
  toggleTheme: () => void;
}

