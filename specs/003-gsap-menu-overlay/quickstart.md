# Quickstart: GSAP Menu Overlay

## Usage

To use the Menu Overlay in the application:

1.  The `MenuOverlay` component is already integrated into `App.jsx`.
2.  It is controlled by the `isMenuOpen` state in `App.jsx`.
3.  Triggering the menu is done via the `MenuBar` component.

## Development

### Modifying Links

To change the navigation links, update the `navLinks` array in `src/components/MenuOverlay.jsx`.

```javascript
const navLinks = [
  { title: "Home", href: "#" },
  // Add more links here
];
```

### Adjusting Animations

Animation timing and easing are defined within the `useGSAP` hook in `MenuOverlay.jsx`.

- **Entrance**: Controlled by `tl.to(overlayRef.current, ...)`
- **Exit**: Controlled by `tl.reverse()` or separate exit logic.

## Accessibility

- The overlay uses `aria-modal="true"`.
- Focus is trapped within the overlay when open.
- Pressing `Escape` closes the menu.

