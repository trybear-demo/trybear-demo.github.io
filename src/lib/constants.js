// Animation Configuration Constants

export const ANIMATION_CONFIG = {
  INTRO: {
    DURATION: 1.5, // Duration to hold the text visible (seconds)
    FADE_OUT: 0.5, // Duration of the fade out transition (seconds)
    EASE: "power2.inOut",
  },
  MENU: {
    FADE_IN_DELAY: 0.2, // Delay after intro complete before menu appears
    FADE_IN_DURATION: 0.8,
    MAGNETIC_STRENGTH: 0.5, // Multiplier for cursor tracking strength
    MAGNETIC_THRESHOLD: 150, // Distance in px to trigger magnetic effect
    ELASTIC_SCALE: 1, // No scale on hover (1 = 100% width)
    ELASTIC_EASE: "elastic.out(1, 0.3)",
  },
  MENU_OVERLAY: {
    DURATION: 1.2, // Duration of opening animation
    EASE: "power4.inOut", // Easing for the overlay slide
    STAGGER: 0.1, // Stagger delay for links
    LINK_REVEAL_DELAY: 0.5, // Delay before links start revealing
  },
};
